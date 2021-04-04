import { config } from "https://deno.land/x/dotenv@v1.0.1/mod.ts"
import { Maxmind } from "https://raw.githubusercontent.com/josh-hemphill/maxminddb-deno/dev/mod.ts"
import * as R from "https://raw.githubusercontent.com/selfrefactor/rambda/master/dist/rambda.esm.js"
import chalkin from "https://deno.land/x/chalkin/mod.ts"
import gql from "../lib/gql-deno.ts"

const dbRawFile = await Deno.readFile("bin/GeoLite2-City.mmdb")
const geodb = new Maxmind(dbRawFile)
// const result = db.lookup_city("81.99.217.104")
// console.log(result)

// console.log(Deno.env.toObject())

// console.log(dotEnvConfig({ path: "../.env" }))

const q = gql(config().GRAPHQL_URL, config().GRAPHQL_SECRET)

const res = await q(`
query {
  findAccountByID(id: ${Deno.args[0]}) {
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

console.log(chalkin.green("Set geo data for:"), chalkin.cyan(res.findAccountByID.name))

let geodata
res.findAccountByID.visits.data.forEach(({ ip }) => {
  console.log(chalkin.bold.cyan(ip))
  try {
    geodata = geodb.lookup_city(ip)
  } catch (e) {
    console.log(chalkin.red(e.message))
    return
  }
  console.log({
    city: geodata.city.names.en,
    continent: geodata.continent.names.en,
    country: geodata.country.names.en,
    location: R.dissoc("metro_code", geodata.location),
  })
})

//TODO: Store data
