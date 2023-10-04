import { makeExecutableSchema } from '@graphql-tools/schema'
import { authors, posts } from './data.js'

const typeDefs = `#graphql
  type Author {
    id: ID!
    firstName: String!
    lastName: String!
  }
  type Post {
    id: ID!
    authorId: ID!
    title: String
    votes: Int 
  }

  type Query {
    countAuthors: Int!
    allAuthors: [Author]!
    findAuthor(firstName: String!): Author
  }
`

const resolvers = {
  Query: {
    countAuthors: () => authors.length,
    allAuthors: () => authors,
    findAuthor: (_, args) => authors.find((a) => a.firstName === args.firstName),
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
