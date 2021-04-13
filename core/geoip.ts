import type { GeoData } from "../types/analtics.ts";
import { Maxmind } from "../deps.ts";

const geodb = new Maxmind(await Deno.readFile("bin/GeoLite2-City.mmdb"));

export default function (ip: string): GeoData {
  return geodb.lookup_city(ip);
}
