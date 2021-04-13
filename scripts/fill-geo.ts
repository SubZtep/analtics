import type { GeoData } from "../types/analtics.ts";
import { linkVisitGeo } from "../core/creates.ts";
import { accountVisits, getGeoId } from "../core/queries.ts";
import geoip from "../core/geoip.ts";

await accountVisits(async (visitId, ip) => {
  let geo: GeoData;
  try {
    geo = geoip(ip);
  } catch (e) {
    console.error(e.message);
    return;
  }

  const id = await getGeoId(geo);
  if (id !== undefined) {
    await linkVisitGeo(id, visitId);
    console.log("geo added for", ip);
  } else {
    console.warn("unlinked", ip);
  }
});
