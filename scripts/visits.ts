import { ArgumentParser } from "argparse"
import chalk from "chalk"
import gql from "../lib/gql-js"

const parser = new ArgumentParser({
  description: "List visits",
})
parser.add_argument("-a", "--account", { help: "Account ID from collection", required: true })
;(async function () {
  const q = gql(process.env.GRAPHQL_URL, process.env.GRAPHQL_SECRET)

  const res = await q(`
    query {
      findAccountByID(id: ${parser.parse_args().account}) {
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

  const json = await res.json()
  // @ts-ignore
  if (json.errors) {
    // @ts-ignore
    console.log(chalk.red(json.errors.map(error => error.message)))
    process.exit(1)
  }

  // @ts-ignore
  console.log(chalk.cyan(JSON.stringify(json.data.findAccountByID.visits.data, null, "  ")))
})()
