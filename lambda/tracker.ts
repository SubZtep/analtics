import type { APIGatewayProxyEvent } from "aws-lambda"
import fetch from "node-fetch"

interface VisitParams {
  ip?: string
  userAgent?: String
  location?: String
  referrer?: String
  noscript?: Boolean
}

const parseVisit = (event: APIGatewayProxyEvent) => {
  const params: VisitParams = {}
  if (event.headers["client-ip"]) {
    params.ip = event.headers["client-ip"]
  }
  if (event.headers["user-agent"]) {
    params.userAgent = event.headers["user-agent"]
  }
  if (event.queryStringParameters.referrer) {
    params.referrer = event.queryStringParameters.noscript
  } else if (event.headers.referer) {
    params.referrer = event.headers.referer
  }
  if (event.queryStringParameters.location) {
    params.location = event.queryStringParameters.location
  }
  if (event.queryStringParameters.noscript) {
    params.noscript = event.queryStringParameters.noscript === "true"
  }
  return params
}

const createVisit = (event: APIGatewayProxyEvent) => `mutation {
  createVisit(data: {
    ${Object.entries(event).map(([key, value]) => `${key}:${value}`).join(",")},
    created: "${new Date().toISOString()}",
    account: {
      connect: "${event.queryStringParameters.account}"
    }
  }) {
   _id
  }
}`

const gql = (url: string, secret: string) => async (mutation: string) =>
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({ query: mutation }),
  })


exports.handler = async (event: APIGatewayProxyEvent) => {
  const dbres = await gql(process.env.GRAPHQL_URL, process.env.GRAPHQL_SECRET)(createVisit(event))
  const response: { [key: string]: any } = { statusCode: dbres.status }

  if (dbres.ok) {
    response.headers = {
      "Content-Type": event.queryStringParameters.noscript ? "text/html" : "text/javascript",
      "X-Content-Type-Options": "nosniff",
    }
    response.body = ""
  } else {
    response.body = dbres.statusText
  }
  return response
}
