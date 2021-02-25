const faunadb = require("faunadb")
const q = faunadb.query

const client = new faunadb.Client({
  secret: "fnAEC2WLDbACAScbEQXB-pJfiXuCPURkI5tUVSiI---"
})

console.log("AAAAA")

const main = async () => {
  try {
    const res = await client.query(
      q.Create(q.Collection("Visit"), {
        data: {
          ip: "1.2.3.4",
          userAgent: "TestAgent",
          created: new Date().toISOString(),
          account: {
            connect: "1291435445219230209"
          }
        }
      })
    )
  } catch (err) {
    // console.log("ERRR", JSON.stringify(err))
    console.log("ERRR", err.requestResult.statusCode)
  }

  // console.log(res)
  process.exit()
}

main()
