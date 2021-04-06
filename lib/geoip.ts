import type {
  CityResponse,
  CountryResponse,
} from "https://raw.githubusercontent.com/runk/mmdb-lib/b5d96d5943b6127b4255b6b33ce561511170ec2c/src/reader/response.ts"
import { Maxmind } from "https://raw.githubusercontent.com/josh-hemphill/maxminddb-deno/dev/mod.ts"
import { log, logError } from "./log.ts"

export type GeoData = Required<Pick<CountryResponse, "continent" | "country">> &
  Required<Pick<CityResponse, "location">> &
  Pick<CityResponse, "city">

const geodb = new Maxmind(await Deno.readFile("bin/GeoLite2-City.mmdb"))

export default (ip: string): GeoData | undefined => {
  log("Looking up", ip)

  try {
    return geodb.lookup_city(ip)
  } catch (e) {
    logError(e.message)
  }
}
