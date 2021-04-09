import Kia, { Spinners } from "https://deno.land/x/kia@v0.1.0/mod.ts"
import { accountVisits, getGeoId, linkVisitGeo } from "../lib/queries.ts"
import geoip from "../lib/geoip.ts"

await accountVisits(async (visitId, ip) => {
  const kia = new Kia({
    text: `Looking up ${ip}`,
    color: "cyan",
    spinner: Spinners.windows,
  });
  kia.start()

  const geo = geoip(ip)
  if (geo === undefined) {
    kia.fail(`${ip} not found`)
    return
  }

  kia.set({ text: `Save ${ip} geo data` })
  const id = await getGeoId(geo)
  if (id !== undefined) {
    await linkVisitGeo(id, visitId)
    kia.succeed(`${ip} geo added`)
  } else {
    kia.warn(`${ip} unlinked`)
  }
}, 1)
