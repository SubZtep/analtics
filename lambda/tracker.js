const faunadb = require("faunadb")
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})
const q = faunadb.query

exports.handler = async event => {
  const res = client.query(
    q.Create(q.Collection("Visit"), {
      data: {
        ip: event.headers["client-ip"],
        userAgent: event.headers["user-agent"],
        created: new Date().toISOString(),
        account: {
          connect: event.queryStringParameters.account
        }
      }
    })
  )

  return {
    statusCode: 200,
    body: JSON.stringify(res)
  }
}
