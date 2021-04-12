import type { GeoData } from "../analtics.ts";
import { Maxmind, red } from "../deps.ts";

const geodb = new Maxmind(await Deno.readFile("bin/GeoLite2-City.mmdb"));

export default function (ip: string): GeoData | undefined {
  try {
    return geodb.lookup_city(ip);
  } catch (e) {
    console.error(red(e.message));
  }
}
