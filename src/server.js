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

const PORT = 3000;
const server = express();
server.use(cors(corsOptionsDelegate))

<<<<<<< HEAD
const whitelist = ['http://volunteer-org.herokuapp.com']
=======
//CORSESETUP
const whitelist = ['volunteer-org.herokuapp.com', 'localhost:3000']
>>>>>>> f23d5940393b83518bc5df034337b693917f9035
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    console.log('true')
    corsOptions = { origin: true }
  }else{
    console.log('false')
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}

<<<<<<< HEAD
=======
// Enable CORS for all routes
server.use(cors(corsOptionsDelegate))
>>>>>>> f23d5940393b83518bc5df034337b693917f9035

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

  //Return schema and context with DB connection and user if exists.
  return {
    schema: executableSchema,
    context: {
      mongo: mongo,
      user: req.user ? req.user._id : null
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
});
