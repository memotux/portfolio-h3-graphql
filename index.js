import { createServer } from 'node:http'
import { createApp, eventHandler, toNodeListener, readBody, createError } from 'h3'
import { graphql } from 'graphql'
import { schema } from './schema.js'

const app = createApp()
app.use(
  '/gql',
  eventHandler(async (event) => {
    const body = await readBody(event)
    if (!body) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid Request form user',
      })
    }
    return graphql({ schema, source: body.query })
  })
)

createServer(toNodeListener(app)).listen(process.env.PORT || 4000)
