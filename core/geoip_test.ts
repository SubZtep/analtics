import { assertEquals, assertThrows } from "../dev_deps.ts";
import geoip from "./geoip.ts";

Deno.test("Geo IP", () => {
  assertEquals(geoip("81.99.217.104")?.continent.code, "EU");
});

Deno.test("Geo nothing", () => {
  assertThrows(() => geoip(""));
});
