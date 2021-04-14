import type { Feature, GeoData } from "../types/analtics.ts";
import { q } from "./gql.ts";

export async function createGeo(geo: GeoData): Promise<string> {
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
  return (await q(query)).createGeo._id;
}

export async function createAccount(name: string): Promise<string> {
  const query = `mutation {
    createAccount(data: {
      name: "${name.replaceAll('"', '\\"')}",
    }) {
     _id
    }
  }`;
  return (await q(query)).createAccount._id;
}

export async function createVisit(
  account: string,
  options: {
    ip: string;
    userAgent: string;
    noScript: boolean;
    created?: string;
  }
): Promise<string> {
  const query = `mutation {
    createVisit(data: {
      account: {
        connect: ${account}
      },
      ip: "${options.ip}",
      userAgent: "${options.userAgent}",
      noscript: ${String(options.noScript ?? false)},
      created: "${options.created ?? new Date().toISOString()}"
    }) {
     _id
    }
  }`;
  return (await q(query)).createVisit._id;
}

export async function createEvent(
  visit: string,
  name: string,
  value?: string
): Promise<string> {
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
  return (await q(query)).createEvent._id;
}

export async function createFeature(
  visit: string,
  feature: Feature
): Promise<string> {
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
  return (await q(query)).createFeature._id;
}

export async function linkVisitGeo(
  geoId: string,
  visitId: string
): Promise<string | undefined> {
  const query = `mutation {
    updateVisit(id: ${visitId}, data: {
      geo: {
        connect: ${geoId}
      }
    }) {
     _id
    }
  }`;
  return (await q(query)).updateVisit._id;
}
