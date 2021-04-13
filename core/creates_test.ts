import { assert } from "../dev_deps.ts";
import { createEvent, createFeature, createVisit } from "./creates.ts";

const visits = [
  {
    ip: "81.99.217.104",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
    noScript: false,
    feature: {
      location: "desktop location",
      referrer: "desktop referrer",
      screenWidth: 1920,
      screenHeight: 1080,
      innerWidth: 800,
      innerHeight: 600,
      pixelRatio: 1,
    },
    events: [
      {
        name: "visibilitychange",
        value: "hidden",
      },
      {
        name: "visibilitychange",
        value: "visible",
      },
      {
        name: "visibilitychange",
        value: "hidden",
      },
    ],
  },
  {
    ip: "81.99.217.104",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
    noScript: false,
    feature: {
      location: "desktop location",
      referrer: "desktop referrer",
      screenWidth: 1920,
      screenHeight: 1080,
      innerWidth: 800,
      innerHeight: 600,
      pixelRatio: 1,
    },
    events: [
      {
        name: "visibilitychange",
        value: "hidden",
      },
    ],
  },
  {
    ip: "81.99.217.104",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
    noScript: true,
  },
  {
    ip: "92.40.176.154",
    userAgent:
      "Mozilla/5.0 (Android 10; Mobile; rv:87.0) Gecko/87.0 Firefox/87.0",
    noScript: false,
    feature: {
      location: "mobile location",
      referrer: "mobile referrer",
      screenWidth: 414,
      screenHeight: 861,
      innerWidth: 414,
      innerHeight: 723,
      pixelRatio: 2.6,
    },
    events: [
      {
        name: "visibilitychange",
        value: "hidden",
      },
    ],
  },
];

for (const visit of visits) {
  let visitId: string;
  Deno.test("create visit", async () => {
    const { ip, userAgent, noScript } = visit;
    visitId = await createVisit(Deno.env.get("ACCOUNT")!, {
      ip,
      userAgent,
      noScript,
    });
    assert(typeof visitId === "string");
  });

  if (visit.feature) {
    Deno.test("create feature", async () => {
      const featureId = await createFeature(visitId, visit.feature);
      assert(typeof featureId === "string");
    });
  }

  if (visit.events) {
    for (const event of visit.events) {
      const { name, value } = event;
      Deno.test("create event", async () => {
        const eventId = await createEvent(visitId, name, value);
        assert(typeof eventId === "string");
      });
    }
  }
}
