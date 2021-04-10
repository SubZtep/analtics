import type { GeoData } from "./geoip.ts";
import type * as GQL from "./gql.types.ts";
import type { Feature } from "./analtics.types.ts";
import { cyan, green, red } from "../deps.ts";
import gql from "./gql.ts";

export const q = gql(
  Deno.env.get("GRAPHQL_URL")!,
  Deno.env.get("GRAPHQL_SECRET")!,
);

/**
 * Query all the existing _Visits_ which belongs to the _Account_ in `.env` file.
 * @param handleGeo ‒ Callback function with Visit ID and IP for process.
 * @param limit ‒ Number of items per requests.
 */
export const accountVisits = async (
  handleGeo: (visitId: string, ip: string) => Promise<void>,
  limit = 10,
) => {
  let after: string | null = null;
  // TODO: filter visits with geo data

  do {
    const res: GQL.AccountVisits = await q(`
      query {
        findAccountByID(id: ${Deno.env.get("ACCOUNT")}) {
          name
          visits(_size: ${limit}${
      after !== null ? `, _cursor: "${after}"` : ""
    }) {
            data {
              _id
              ip
            }
            after
          }
        }
      }
    `);

    console.log(green("Geo data for"), cyan(res.findAccountByID.name));

    if (res.findAccountByID.visits.data.length === 0) {
      console.info(red("No visit data on this page."));
    }

    for (const { _id, ip } of res.findAccountByID.visits.data) {
      await handleGeo(_id, ip);
    }

    after = res.findAccountByID.visits.after;
  } while (after);
};

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
  }`;
  let res: GQL.CreateGeo;

  try {
    res = await q(query);
  } catch (e) {
    console.error(red(e.message));
    return;
  }

  if (res.error) {
    console.error(red(res.error.message));
    return;
  }

  return res.createGeo._id;
};

const queryGeo = async ({ location }: GeoData): Promise<string | undefined> => {
  const query = `
    query {
      geoCoords(latitude: ${location.latitude}, longitude: ${location.longitude}) {
        _id
      }
    }
  `;

  let res: GQL.GeoCoords;
  try {
    res = await q(query);
  } catch (e) {
    console.error(red(e.message));
    return;
  }

  if (res.error) {
    console.error(red(res.error.message));
    return;
  }
  return res.geoCoords?._id;
};

export const getGeoId = async (geo: GeoData) => {
  const id = await queryGeo(geo);
  if (id) {
    return id;
  }
  return await insertGeo(geo);
};

export const linkVisitGeo = async (geoId: string, visitId: string) => {
  const query = `mutation {
    updateVisit(id: ${visitId}, data: {
      geo: {
        connect: ${geoId}
      }
    }) {
     _id
    }
  }`;
  let res: GQL.UpdateVisit;
  try {
    res = await q(query);
  } catch (e) {
    console.error(red(e.message));
    return;
  }
  if (res.error) {
    console.error(red(res.error.message));
    return;
  }
  return res.updateVisit._id;
};

export const createAccount = async (
  name: string,
): Promise<string | undefined> => {
  const query = `mutation {
    createAccount(data: {
      name: "${name.replaceAll('"', '\\"')}",
    }) {
     _id
    }
  }`;
  let res: GQL.CreateAccount;
  try {
    res = await q(query);
  } catch (e) {
    console.error(red(e.message));
    return;
  }
  if (res.error) {
    console.error(red(res.error.message));
    return;
  }
  return res.createAccount._id;
};

export const createVisit = async (
  account: string,
  request: Request,
  noScript: boolean,
) => {
  const query = `mutation {
    createVisit(data: {
      account: {
        connect: ${account}
      },
      ip: "${request.headers.get("x-forwarded-for")}",
      userAgent: "${request.headers.get("user-agent")}",
      noscript: ${String(noScript)},
      created: "${new Date().toISOString()}"
    }) {
     _id
    }
  }`;
  let res: GQL.CreateVisit;
  try {
    res = await q(query);
  } catch (e) {
    console.error(red(e.message));
    return;
  }
  if (res.error) {
    console.error(red(res.error.message));
    return;
  }
  return res.createVisit._id;
};

export const createEvent = async (
  visit: string,
  name: string,
  value?: string,
) => {
  const query = `mutation {
    createEvent(data: {
      name: "${name}",
      ${value ? `value: "${value.replaceAll('"', '\\"')}",` : ""}
      created: "${new Date().toISOString()}",
      visit: {
        connect: ${visit}
      }
    }) {
     _id
    }
  }`;
  let res: GQL.CreateEvent;
  try {
    res = await q(query);
  } catch (e) {
    console.error(red(e.message));
    return;
  }
  if (res.error) {
    console.error(red(res.error.message));
    return;
  }
  return res.createEvent._id;
};

export const createFeature = async (visit: string, feature: Feature) => {
  const query = `mutation {
    createFeature(data: {
      location: "${feature.location}",
      referrer: "${feature.referrer}",
      screenWidth: ${feature.screenWidth},
      screenHeight: ${feature.screenHeight},
      innerWidth: ${feature.innerWidth},
      innerHeight: ${feature.innerHeight},
      pixelRatio: ${feature.pixelRatio},
      visit: {
        connect: ${visit}
      }
    }) {
     _id
    }
  }`;
  let res: GQL.CreateFeature;
  try {
    res = await q(query);
  } catch (e) {
    console.error(red(e.message));
    return;
  }
  if (res.error) {
    console.error(red(res.error.message));
    return;
  }
  return res.createFeature._id;
};
