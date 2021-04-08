import { accountVisits, getGeoId, linkVisitGeo } from "../lib/queries.ts"
import geoip from "../lib/geoip.ts"


await accountVisits(async (visitId, ip) => {
  const geo = geoip(ip)
  if (geo === undefined) {
    return
  }

  const id = await getGeoId(geo)
  if (id !== undefined) {
    await linkVisitGeo(id, visitId)
  }
})
