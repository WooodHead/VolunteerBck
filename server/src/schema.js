import { makeExecutableSchema } from 'graphql-tools';
import { Resolvers } from './resolvers';

//Type Definitions
const typeDefs = [`
  type User {
    _id: String
    email: String
    password: String
		jwt: String
  },
  type NGO {
    _id: String
    name: String
    mission: String
    description: String
    logo: String
    dateFounded: String
    cause1: String,
    cause2: String
    images:[String]
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
    ngosByName(name: String!): NGO,
    currentUser: User
  },
  type Mutation {
    login(email: String!, password: String!): User
    signup(email: String!, password: String!): User
    createNGO(name: String!, mission: String!): NGO
  }
`];

export const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers: Resolvers,
})
