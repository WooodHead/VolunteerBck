import { makeExecutableSchema } from 'graphql-tools';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const typeDefs = [`
  type User {
    _id: String
    email: String
    password: String
		jwt: String
  },
  type NGO {
    _id: Int!,
    name: String,
    mission: String,
    description: String,
    logo: String,
    dateFounded: String,
    cause1: String,
    cause2: String,
    images:[String],
    projects:[Project],
    ctas:[CTA],
    sponsors:[Sponsor]
  },
  type Project {
    _id: String,
    owner: String,
    name: String,
    goal: String,
    description: String,
    cause1: String,
    cause2: String,
    startDate: String,
    endDate: String,
    images:[String],
    ngos:[NGO],
    sponsors:[Sponsor],
    ctas:[CTA],
  },
  type CTA {
    _id: String,
    owner: String,
    name: String,
    goal: String,
    description: String,
    cause1: String,
    startDate: String,
    endDate: String,
    objective: Int,
    progress: Int,
    images:[String],
  },
  type Sponsor{
    _id: String!,
    name: String,
    logo: String,
    webUrl: String,
    supportedNgos:[NGO],
    supportedProjects:[Project],
  },
  type Query {
    allNGOS: [NGO],
    ngo(id: Int!): NGO,
    currentUser: User
  },
  type Mutation {
    login(email: String!, password: String!): User
    signup(email: String!, password: String!): User
  },
`];

const resolvers = {
  Query: {
    currentUser: (root, args, { user }) => {
      return user;
    },
    // allNGOS: () => {
    //   // return someData;
    // },
    // ngo: (root, {id}) => {
    //   return somedata.filter(ngo => {
    //     return ngo.id === id;
    //   })[0];
    // }
  },
  Mutation: {
    login: async (root, { email, password }, { secrets, mongo }) => {
      const Users = mongo.collection('users');

      const user = await Users.findOne({ email });
      if (!user) {
        throw new Error ('User does not exist, register first');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error ('Password is incorrect');
      }

      //if logged in, generate JWT and pass it to the user doc
      user.jwt = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      return user;
    },

    signup: async (root, { email, password }, { mongo, secrets }) => {
      const Users = mongo.collection('users');
      const existingUser = await Users.findOne({ email });

      if (existingUser) {
        throw new Error('Email already used');
      }

      const hash = await bcrypt.hash(password, 10);

      await Users.insert({
        email,
        password: hash,
      });

      const user = await Users.findOne({ email });

      user.jwt = jwt.sign({ _id: user._id }, process.env.JWT_SECRET );

      return user;
    },
  },
};

const getUser = async (authorization, secrets, mongo) => {
  const bearerLength = "Bearer ".length;
  if (authorization && authorization.length > bearerLength) {
    const token = authorization.slice(bearerLength);

    const { ok, result } = await new Promise(resolve =>
  		jwt.verify(token, process.env.JWT_SECRET , (err, result ) => {
      	if (err){
          resolve({
            ok: false,
            result: err,
          })
        }	else {
          resolve({
            ok: true,
            result,
          })
        }
    	})
    );
    if (ok) {
      const user = await mongo.collection('users').findOne({ _id: Object(result._id)});
      return user;
    }	else {
      return null;
    }
  }

  return null;
};

let mongo;
let client;
export async function context(headers, secrets) {
  if(!mongo) {
    client = await MongoClient.connect('mongodb://lukter4*:pichix39!@ds231739.mlab.com:31739/volunteer');
  	mongo = client.db('volunteer');
  }

  const user = await getUser(headers['authorization'], mongo, secrets );
  return {
    headers,
    secrets,
    mongo,
    user,
  };
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  context
})
