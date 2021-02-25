import { APIGatewayProxyEvent, APIGatewayProxyCallback } from "aws-lambda"
import fetch from "node-fetch"

const gql = (url, secret) => async mutation =>
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({ query: mutation }),
  })

const createVisit = event => `mutation {
  createVisit(data: {
    ip: "${event.headers["client-ip"]}",
    userAgent: "${event.headers["user-agent"]}",
    referer: "${event.queryStringParameters.referer || ""}",
    noscript: ${event.queryStringParameters.noscript || "false"},
    created: "${new Date().toISOString()}",
    account: {
      connect: "${event.queryStringParameters.account}"
    }
  }) {
   _id
  }
}`

exports.handler = async event => {
  const dbres = await gql(process.env.GRAPHQL_URL, process.env.GRAPHQL_SECRET)(createVisit(event))
  const response: { [key: string]: any } = { statusCode: dbres.status }

  if (dbres.ok) {
    response.headers = {
      "Content-Type": event.queryStringParameters.noscript ? "text/css" : "text/javascript",
      "X-Content-Type-Options": "nosniff",
    }
  } else {
    response.body = dbres.statusText
  }
  return response
}
