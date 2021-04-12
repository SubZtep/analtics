/**
 * This script is delete all your data, hopefully TEST DATA and not production.
 * Very dangerous!
 */
import gql from "../core/gql.ts";

export const q = gql(
  Deno.env.get("GRAPHQL_URL")!,
  Deno.env.get("GRAPHQL_SECRET")!,
);

let doDelete = true;
if (Deno.args.length === 0 || Deno.args[0] !== "--delete") {
  console.log(
    "If .env surely points to a test, for real delete add argument",
    "--delete",
  );
  doDelete = false;
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
`);

if (res.findAccountByID.visits.data.length === 0) {
  console.log("No visit for", res.findAccountByID.name);
  Deno.exit(0);
}

console.log("Delete for account", res.findAccountByID.name);

for (const { _id: vid, events } of res.findAccountByID.visits.data) {
  console.log("Visit", vid);

  if (events.data.length === 0) {
    if (doDelete) {
      const res2 = await q(`
        mutation {
          deleteVisit(id: ${vid}) {
            _id
          }
        }
      `);
      console.log(res2);
    }
  } else {
    for (const { _id: eid } of events.data) {
      console.log("Event", eid);

      if (doDelete) {
        const res2 = await q(`
          mutation {
            deleteEvent(id: ${eid}) {
              _id
            }
          }
        `);
        console.log(res2);
      }
    }
  }
}
