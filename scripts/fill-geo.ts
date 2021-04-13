import type { GeoData } from "../types/analtics.ts";
import Kia, { Spinners } from "https://deno.land/x/kia@v0.1.0/mod.ts";
import { linkVisitGeo } from "../core/creates.ts";
import { accountVisits, getGeoId } from "../core/queries.ts";
import geoip from "../core/geoip.ts";

await accountVisits(async (visitId, ip) => {
  const kia = new Kia({
    text: `Looking up ${ip}`,
    color: "cyan",
    spinner: Spinners.windows,
  });
  kia.start();

  let geo: GeoData;
  try {
    geo = geoip(ip);
  } catch (e) {
    kia.fail(e.message);
    return;
  }

  kia.set({ text: `Save ${ip} geo data` });
  const id = await getGeoId(geo);
  if (id !== undefined) {
    await linkVisitGeo(id, visitId);
    kia.succeed(`${ip} geo added`);
  } else {
    kia.warn(`${ip} unlinked`);
  }
}, 1);
