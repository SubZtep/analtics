import { assertEquals, assertThrows } from "../dev_deps.ts";
import geoip from "./geoip.ts";

Deno.test("geo ip", () => {
  assertEquals(geoip("81.99.217.104")?.continent.code, "EU");
});

Deno.test("geo nothing", () => {
  assertThrows(() => geoip(""));
});
