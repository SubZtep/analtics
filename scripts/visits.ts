import gql from "../lib/gql"

;(async function () {
  const q = gql(process.env.GRAPHQL_URL, process.env.GRAPHQL_SECRET)

  const res = await q(`
    query {
      findAccountByID(id: ${process.argv.pop()}) {
        name
        visits {
          data {
            ip
            userAgent
            created
          }
        }
      }
    }
  `)

  if (!res.ok) {
    console.error(res.statusText)
    return
  }

  // @ts-ignore
  console.log((await res.json()).data.findAccountByID.visits.data)
})()
