require('dotenv').config()
import express from 'express';
// import { ApolloEngine } from 'apollo-engine'
import { graphqlExpress } from 'apollo-server-express';
import { MongoClient, ObjectId } from 'mongodb';
import { apolloUploadExpress } from 'apollo-upload-server'
import jwt from 'express-jwt';
import * as bodyParser from 'body-parser-graphql'
import { executableSchema } from './schema';
import cors from 'cors';

const server = express();
server.use(cors(corseOptions))

let corseOptions = {
  "origin": "*",
  "methods": "HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "allowedHeaders": ['Content-Type', 'Authorization', 'token'],
}
console.log(corseOptions)

//Connect to DB
let mongo;
const getMongo = async () => {
  try {
    // this parse may fail
    const client = await MongoClient.connect(process.env.MONGO_URI);
    mongo = client.db('volunteer');
    console.log('Connected to DB')
  } catch (err) {
    console.log('Could not connect to DB');
    console.log(err);
  }
}
getMongo();

// Initialize the server
server.use(
  '/graphql', apolloUploadExpress(), jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
}), bodyParser.graphql(), graphqlExpress(async req => {

  console.log(req)
  //Return schema and context with DB connection and user if exists.
  return {
    schema: executableSchema,
    context: {
      mongo: mongo,
      user: req.user ? req.user._id : null
    },
  };
}));

server.listen(process.env.PORT || 5000, () => {
  console.log(`Volunteer GraphQL Server is running on ${process.env.PORT}`);
});
