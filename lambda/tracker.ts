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
    noscript: ${event.queryStringParameters.noscript ? "true" : "false"},
    created: "${new Date().toISOString()}",
    account: {
      connect: "${event.queryStringParameters.account}"
    }
  }) {
   _id
  }
}`

exports.handler = async event => {
  const res = await gql(process.env.GRAPHQL_URL, process.env.GRAPHQL_SECRET)(createVisit(event))
  return {
    statusCode: res.status,
    body: res.ok ? (event.queryStringParameters.noscript ? "" : await res.text()) : res.statusText,
  }
}
