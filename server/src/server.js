require('dotenv').config()
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import jwt from 'express-jwt';
import { MongoClient, ObjectId } from 'mongodb';
import * as bodyParser from 'body-parser-graphql'
import { executableSchema } from './schema';

const PORT = 3000;
const server = express();

server.use('/graphql', jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
}), bodyParser.graphql(), graphqlExpress(async req => {

  //Connect to mongo db database
  let mongo;
  if(!mongo) {
    const client = await MongoClient.connect(process.env.MONGO_URI);
    mongo = client.db('volunteer');
  }

  const Users = mongo.collection('users');
  
  //Log req.user for testing purposes
  if (req.user) {
    console.log(req.user);
  }

  //Return schema and context with DB connection and user if exists.
  return {
    schema: executableSchema,
    context: {
      mongo: mongo,
      user: req.user ?
        Users.findOne({ where: { id: req.user.id }}) :
        Promise.resolve(null),
    },
  };
}));

//GraphiQL End point for testing (no token);
server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  query: ``,
}));

server.listen(PORT, () => {
  console.log(`Volunteer GraphQL Server is running on http://localhost:${PORT}/graphql`);
  console.log(`Volunteer GraphiQL Interface running at http://localhost:${PORT}/graphiql`);
});
