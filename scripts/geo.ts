import { accountVisits, getGeoId, linkVisitGeo } from "../bin/queries.ts"
import geoip from "../lib/geoip.ts"


await accountVisits(async (ip, visitId) => {
  const geo = geoip(ip)
  if (geo === undefined) {
    return
  }

  const id = await getGeoId(geo)
  if (id !== undefined) {
    await linkVisitGeo(id, visitId)
  }
})
