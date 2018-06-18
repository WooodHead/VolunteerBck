import { makeExecutableSchema } from 'graphql-tools';
import { Resolvers } from './resolvers';
import { GraphQLUpload } from 'apollo-upload-server'

//Type Definitions
const typeDefs = [`
  scalar Upload,
  type File {
    id: ID
    path: String
    filename: String
    mimetype: String
    encoding: String
  },
  type User {
    _id: String
    email: String
    password: String
    name : String
		jwt: String
    causes: [Cause]
    following: [NGO]
    suportingCtas: [CTA]
  },
  type NGOAdmin {
    _id: String
    orgId: String
    adminEmail: String
    name: String
    lastName: String
    password: String
    jwt: String
  },
  type NGO {
    _id: String
    orgName: String
    orgEmail: String
    website: String
    orgSize: String
    causes: [Cause]
    countries: [String]
    logo: String
    bannerImg: [String]
    mission: String
    description: String
    status: String
    validated: Int
    ctas: [CTA]
  },
  type Cause {
    _id: String
    name: String
  },
  type CTA {
    _id: String,
    name: String
    goal: String
    description: String
    startDate: String
    endDate: String
    objective: Int
    progress: Int
    images:[String]
    continents: [String]
    countries: [String]
    cities: [String]
    type: Int
  },
  type userCta {
    _id: String
    user: User
    cta: CTA
    status: String
    contributionQty: Int
  },
  type Query {
    currentUser: User,
    ngoFeedData: [NGO],
    ngosNameLike(name: String!): [NGO],
    ngosByCause(causes: String!): [NGO],
    ngosByContinent(continents: String!): [NGO],
    ngosByCountry(countries: String!): [NGO],
    ngosByCity(cities: String!): [NGO],
    ngosByCauseAndContinent(causes: String!, continents: String!): [NGO],
    ngosByCauseAndCountry(causes: String!, countries: String!): [NGO],
    ngosByCauseAndCity(causes: String!, cities: String!): [NGO],
    ctasFeedData: [CTA],
    ctasByCause(causes: String!): [CTA],
    ctasByContinent(continents: String!): [CTA],
  },
  type Mutation {
    singleUpload(file: Upload!): File!
    login(email: String!, password: String!): User
    signup(email: String!, password: String!, name: String!): User
    signupAdmin(adminEmail: String!, name: String!, lastName: String!, password: String!): NGOAdmin
    loginAdmin(adminEmail: String!, password: String!): NGOAdmin
    createNgo1(
      orgName: String!
      orgEmail: String!
      website: String!
      orgSize: String!
      causes: [String!]
      countries: [String!]
    ): NGO
    updateNgo(
      orgName: String
      orgEmail: String
      website: String
      orgSize: String
      causes: [String]
      countries: [String]
      logo: String
      bannerImg: [String]
      mission: String
      description: String
      status: String
      ctas: [String]
    ): NGO
    createCTA(
      ngo: String!,
      name: String!,
      goal: String!,
      description: String,
      startDate: String!,
      endDate: String!,
      numericObjective: Int,
      numericProgress: Int,
      images:[String],
      continents: [String],
      countries: [String],
      cities: [String],
    ): CTA
  }
`];

export const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers: Resolvers,
})
