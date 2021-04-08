/**
 * This script is delete all your data, hopefully TEST DATA and not production.
 * Very dangerous!
 */
import "../lib/dotenv.ts"
import gql from "../lib/gql.ts"
import { log, logError } from "../lib/log.ts"

export const q = gql(Deno.env.get("GRAPHQL_URL")!, Deno.env.get("GRAPHQL_SECRET")!)

let doDelete = true
if (Deno.args.length === 0 || Deno.args[0] !== "--delete") {
  logError("If .env surely points to a test, for real delete add argument", "--delete")
  doDelete = false
}

const res = await q(`
  query {
    findAccountByID(id: ${Deno.env.get("ACCOUNT")}) {
      name
      visits(_size: 100) {
        data {
          _id
          events(_size: 100) {
            data {
              _id
            }
          }
        }
      }
    }
  }
`)

if (res.findAccountByID.visits.data.length === 0) {
  logError("No visit for", res.findAccountByID.name)
  Deno.exit(0)
}

log("Delete for account", res.findAccountByID.name)

for (const { _id: vid, events } of res.findAccountByID.visits.data) {
  log("Visit", vid)

  if (events.data.length === 0) {
    if (doDelete) {
      const res2 = await q(`
        mutation {
          deleteVisit(id: ${vid}) {
            _id
          }
        }
      `)
      console.log(res2)
    }
  } else {
    for (const { _id: eid } of events.data) {
      log("Event", eid)

      if (doDelete) {
        const res2 = await q(`
          mutation {
            deleteEvent(id: ${eid}) {
              _id
            }
          }
        `)
        console.log(res2)
      }
    }
  }
}
