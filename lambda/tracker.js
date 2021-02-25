const fetch = require("node-fetch")

const gql = url => async mutation => {
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: mutation }),
  }
  const res = await fetch(url, opts)
  return await res.json()
}

const createVisit = event => `mutation {
  createVisit(data: {
    ip: "${event.headers["client-ip"]}"
    userAgent: "${event.headers["user-agent"]}",
    created: "${new Date().toISOString()}",
    account: {
      connect: "${event.queryStringParameters.account}"
    }
 }) {
   _id
 }`

exports.handler = async event => {
  let = statusCode = 200
  await gql("https://graphql.fauna.com/graphql")(createVisit(event))
  return {
    statusCode,
  }
}
