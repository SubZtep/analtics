import { config } from "https://deno.land/x/dotenv@v1.0.1/mod.ts"
import type { GeoData } from "../lib/geoip.ts"
import { log, logError } from "../lib/log.ts"
import geoip from "../lib/geoip.ts"
import gql from "../lib/gql.ts"

interface VisitLookUpParams {
  _id: string
  ip: string
}

const dotenv = config()
export const q = await gql(dotenv.GRAPHQL_URL, dotenv.GRAPHQL_SECRET)

/**
 * Query all the existing _Visits_ which belongs to the _Account_ in `.env` file.
 * @param handleGeo ‒ Callback function with valid `Geo` data parameter.
 * @param limit ‒ Number of items per requests.
 */
export const accountVisits = async (handleGeo: (geo: GeoData, visitId: string) => void, limit = 10) => {
  let after: string | null = null

  do {
    const res = await q(`
      query {
        findAccountByID(id: ${dotenv.ACCOUNT}) {
          name
          visits(_size: ${limit}${after !== null ? `, _cursor: "${after}"` : ""}) {
            data {
              _id
              ip
            }
            after
          }
        }
      }
    `)

    log("Geo data for:", res.findAccountByID.name)

    for (const { _id, ip } of res.findAccountByID.visits.data) {
      const geo = geoip(ip)
      if (geo) {
        await handleGeo(geo, _id)
      }
    }

    after = res.findAccountByID.visits.after
  } while (after)
}

const insertGeo = async (geo: GeoData): Promise<string | undefined> => {
  const query = `mutation {
    createGeo(data: {
      ${geo.city ? `city: "${geo.city.names.en}",` : ""}
      continent: "${geo.continent.names.en}",
      country: "${geo.country.names.en}",
      latitude: ${geo.location.latitude},
      longitude: ${geo.location.longitude},
      timeZone: "${geo.location.time_zone}"
    }) {
     _id
    }
  }`
  let res

  try {
    res = await q(query)
  } catch (e) {
    logError(e.message)
    return
  }

  if (res.error) {
    logError(res.error.message)
    return
  }

  return res.createGeo._id
}

const queryGeo = async ({ location }: GeoData): Promise<string | undefined> => {
  const query = `
    query {
      geoCoords(latitude: ${location.latitude}, longitude: ${location.longitude}) {
        _id
      }
    }
  `

  let res
  try {
    res = await q(query)
  } catch (e) {
    logError(e.message)
    return
  }

  if (res.error) {
    logError(res.error.message)
    return
  }

  return res.geoCoords?._id
}

export const getGeoId = async (geo: GeoData): Promise<string | undefined> => {
  const id = await queryGeo(geo)
  if (id) {
    return id
  }
  return await insertGeo(geo)
}

export const linkVisitGeo = async (geoId: string, visitId: string) => {
  const query = `mutation {
    updateVisit(id: ${visitId}, data: {
      geo: {
        connect: ${geoId}
      }
    }) {
     _id
    }
  }`
  let res

  try {
    res = await q(query)
  } catch (e) {
    logError(e.message)
    return
  }

  if (res.error) {
    logError(res.error.message)
    return
  }
}

export const createAccount = async (name: string): Promise<string | undefined> => {
  const query = `mutation {
    createAccount(data: {
      name: "${name.replaceAll('"', '\\"')}",
    }) {
     _id
    }
  }`
  let res

  try {
    res = await q(query)
  } catch (e) {
    logError(e.message)
    return
  }

  if (res.error) {
    logError(res.error.message)
    return
  }

  return res.createAccount._id
}

export const createVisit = async (account: string, request: Request, noScript: boolean) => {
  // FIXME: request.url doesn't contain hashbang
  const query = `mutation {
    createVisit(data: {
      account: {
        connect: ${account}
      },
      ip: "${request.headers.get("x-forwarded-for")}",
      userAgent: "${request.headers.get("user-agent")}",
      ${request.referrer ? `referrer: \"${request.referrer}\",` : ""}
      location: "${request.url}",
      noscript: ${String(noScript)},
      created: "${new Date().toISOString()}"
    }) {
     _id
    }
  }`
  let res

  try {
    res = await q(query)
  } catch (e) {
    logError(e.message)
    return
  }

  if (res.error) {
    logError(res.error.message)
    return
  }
}
