require('dotenv').config()
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import jwt from 'express-jwt';
import * as bodyParser from 'body-parser-graphql'
import * as Schema from './schema';

const PORT = 3000;
const server = express();

const schemaFunction =
  Schema.schemaFunction ||
  function() {
    return Schema.schema;
  };

let schema;

const rootFunction =
  Schema.rootFunction ||
  function() {
    return schema.rootValue;
  };

const contextFunction =
  Schema.context ||
  function(headers) {
    return Object.assign(
      {
        headers: headers,
      },
    );
  };

server.use('/graphql', jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
}), bodyParser.graphql(), graphqlExpress(async req => {
  if (!schema) {
    schema = schemaFunction(process.env)
  }
  const context = await contextFunction(req.headers, process.env);
  const rootValue = await rootFunction(req.headers, process.env);

  return {
    schema: await schema,
    rootValue,
    context,
    tracing: true,
  };
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  query: ``,
}));

server.listen(PORT, () => {
  console.log(`Volunteer GraphQL Server is running on http://localhost:${PORT}/graphql`);
  console.log(`Volunteer View GraphiQL at http://localhost:${PORT}/graphiql`);
});
