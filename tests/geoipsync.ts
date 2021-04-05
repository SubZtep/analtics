import { Maxmind } from "https://raw.githubusercontent.com/josh-hemphill/maxminddb-deno/dev/mod.ts"
const geodb = new Maxmind(await Deno.readFile("bin/GeoLite2-City.mmdb"))

for (let i = 0; i < 100; i++) {
  console.log("lookup")
  const geo = geodb.lookup_city("81.99.217.104")
  console.log(geo.city.names.en)
}
