import type { GeoData } from "../types/analtics.ts";
import { assert } from "../dev_deps.ts";
import { createGeo } from "./creates.ts";

const geo: GeoData = {
  city: {
    geoname_id: 2646003,
    names: {
      en: "Islington",
    },
  },
  continent: {
    code: "EU",
    geoname_id: 6255148,
    names: {
      en: "Europe",
    },
  },
  country: {
    geoname_id: 2635167,
    iso_code: "GB",
    names: {
      en: "United Kingdom",
    },
  },
  location: {
    latitude: 51.5305,
    longitude: -0.0968,
    time_zone: "Europe/London",
    accuracy_radius: 0,
  },
};

Deno.test("createGeo #1", async () => {
  console.log(await createGeo(geo));
  assert(typeof await createGeo(geo) === "string");
});

// Deno.test("createGeo #2", () => {
//   assertThrowsAsync<string>(async () => await createGeo(geo));
// });
