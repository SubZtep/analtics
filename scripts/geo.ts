import { accountVisits, getGeoId, linkVisitGeo } from "../bin/queries.ts"
import type { GeoData } from "../lib/geoip.ts"

await accountVisits(async (geo: GeoData, visitId: string) => {
  const id = await getGeoId(geo)
  await linkVisitGeo(id, visitId)
})
