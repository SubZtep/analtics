import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import fetch from "node-fetch"

interface VisitParams {
  ip?: string
  userAgent?: String
  location?: String
  referrer?: String
  noscript?: Boolean
  account: string
}

const parseVisit = ({ headers, queryStringParameters }: APIGatewayProxyEvent) => {
  const params: VisitParams = {
    account: `{connect:"${queryStringParameters.account}"}`,
  }
  if (headers["client-ip"]) {
    params.ip = `"${headers["client-ip"]}"`
  }
  if (headers["user-agent"]) {
    params.userAgent = `"${headers["user-agent"]}"`
  }
  if (queryStringParameters.referrer) {
    params.referrer = `"${queryStringParameters.noscript}"`
  } else if (headers.referer) {
    params.referrer = `"${headers.referer}"`
  }
  if (queryStringParameters.location) {
    params.location = `"${queryStringParameters.location}"`
  }
  if (queryStringParameters.noscript) {
    params.noscript = queryStringParameters.noscript === "true"
  }
  return params
}

const createVisit = (params: VisitParams) => `mutation {
  createVisit(data: {
    ${Object.entries(params)
      .map(([key, value]) => `${key}:${value}`)
      .join(",")},
    created: "${new Date().toISOString()}"
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
  const dbres = await gql(process.env.GRAPHQL_URL, process.env.GRAPHQL_SECRET)(createVisit(parseVisit(event)))
  const response: APIGatewayProxyResult = { statusCode: dbres.status } as APIGatewayProxyResult

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
