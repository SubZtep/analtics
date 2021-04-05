import { accountVisits, getGeoId, linkVisitGeo } from "../bin/queries.ts"
import type { GeoData } from "../lib/geoip.ts"
import { logError } from "../lib/log.ts"
import geoip from "../lib/geoip.ts"


await accountVisits(async (ip: string, visitId: string) => {
  const geo = geoip(ip)

  if (geo === undefined) {
    return
  }

  const id = await getGeoId(geo)
  await linkVisitGeo(id, visitId)
})
