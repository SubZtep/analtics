import type * as GQL from "../types/gql.ts";
import type { GeoData } from "../types/analytics.ts";
import { createGeo } from "./creates.ts";
import { q } from "./gql.ts";

/**
 * Query all the existing _Visits_ which belongs to the _Account_ in `.env` file.
 * @param handleGeo ‒ Callback function with Visit ID and IP for process for no geo.
 * @param limit ‒ Number of items per requests.
 */
export async function accountVisits(
  handleGeo: (visitId: string, ip: string) => Promise<void>,
  limit = 10,
) {
  let after: string | null = null;

  do {
    const res: GQL.AccountVisits = await q(`#graphql
      query {
        findAccountByID(id: ${Deno.env.get("ACCOUNT")}) {
          name
          visits(_size: ${limit}${
      after !== null ? `, _cursor: "${after}"` : ""
    }) {
            data {
              _id
              ip
              geo {
                _id
              }
            }
            after
          }
        }
      }
    `);

    console.log("account", res.findAccountByID.name);

    if (res.findAccountByID.visits.data.length === 0) {
      console.info("no visits");
    }

    for (const { _id, ip, geo } of res.findAccountByID.visits.data) {
      if (geo === null) {
        await handleGeo(_id, ip);
      }
    }

    after = res.findAccountByID.visits.after;
  } while (after);
}

async function queryGeo({ location }: GeoData): Promise<string | undefined> {
  const query = `
    query {
      geoCoords(latitude: ${location.latitude}, longitude: ${location.longitude}) {
        _id
      }
    }
  `;
  return (await q(query)).geoCoords?._id;
}

export async function getGeoId(geo: GeoData) {
  const id = await queryGeo(geo);
  if (id) {
    return id;
  }
  return await createGeo(geo);
}
