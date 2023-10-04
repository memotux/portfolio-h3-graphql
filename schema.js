import { makeExecutableSchema } from '@graphql-tools/schema'
import { authors, posts } from './data.js'
import { v1 as uuid } from 'uuid'
import { createError } from 'h3'

const typeDefs = `#graphql
  type Author {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
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

  input CreateAuthorInput {
    firstName: String!
    lastName: String!
  }

  type Mutation {
    createAuthor(input: CreateAuthorInput): Author
  }
`

const resolvers = {
  Query: {
    countAuthors: () => authors.length,
    allAuthors: () => authors,
    findAuthor: (_, args) => authors.find((a) => a.firstName === args.firstName),
  },
  Mutation: {
    createAuthor(_, { input }) {
      if (
        authors.find(
          (a) => a.firstName === input.firstName && a.lastName === input.lastName
        )
      ) {
        return createError('User must be unique')
      }
      const newAuthor = { ...input, id: uuid() }
      authors.push(newAuthor)
      return newAuthor
    },
  },
  Author: {
    fullName: (root) => `${root.firstName} ${root.lastName}`,
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
