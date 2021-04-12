import type { CityResponse, CountryResponse } from "../deps.ts";

export type GeoData =
  & Required<Pick<CountryResponse, "continent" | "country">>
  & Required<Pick<CityResponse, "location">>
  & Pick<CityResponse, "city">;

export interface Feature {
  location: string;
  referrer: string;
  screenWidth: number;
  screenHeight: number;
  innerWidth: number;
  innerHeight: number;
  pixelRatio: number;
}
