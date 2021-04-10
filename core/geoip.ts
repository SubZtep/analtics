import type { CityResponse, CountryResponse } from "../deps.ts";
import { Maxmind, red } from "../deps.ts";

export type GeoData =
  & Required<Pick<CountryResponse, "continent" | "country">>
  & Required<Pick<CityResponse, "location">>
  & Pick<CityResponse, "city">;

const geodb = new Maxmind(await Deno.readFile("bin/GeoLite2-City.mmdb"));

export default (ip: string): GeoData | undefined => {
  try {
    return geodb.lookup_city(ip);
  } catch (e) {
    console.error(red(e.message));
  }
};
