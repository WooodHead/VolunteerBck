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
    causes: [String]
    images:[String]
    worldwide: String
    continents: [String]
    countries: [String]
    cities: [String]
  },
  type CTA {
    _id: String,
    owner: NGO,
    name: String,
    goal: String,
    description: String,
    causes: [String],
    startDate: String,
    endDate: String,
    objective: Int,
    progress: Int,
    images:[String],
    continents: [String]
    countries: [String]
    cities: [String]
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
    login(email: String!, password: String!): User
    signup(email: String!, password: String!, name: String!): User
    createNGO(
      name: String!,
      mission: String!,
      description: String,
      logo: String,
      dateFounded: String
      causes: [String!],
      images:[String],
      worldwide: String,
      continents: [String!],
      countries: [String!],
      cities: [String!],
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
