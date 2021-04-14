import { serve, serveStatic } from "../deps.ts";
import { handleEvent, handleFeature, handleTracker } from "./tracker.ts";

serve({
  // Api
  "/tracker/:account/:noscript?": handleTracker,
  "/event/:visit/:event": handleEvent,
  "/feature/:visit": handleFeature,

  // Web
  "/": serveStatic("home.html", {
    baseUrl: import.meta.url,
    cache: false,
    intervene: (response) => {
      response.headers.set("Content-Type", "text/html; charset=utf-8");
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Content-Security-Policy", "default-src * data: 'unsafe-inline' 'unsafe-eval' 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=='; img-src * 'self' data:; style-src * 'unsafe-inline' 'unsafe-eval' 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=='");
      return response;
    },
  }),
  "/favicon.ico": serveStatic("favicon.ico", {
    baseUrl: import.meta.url,
    cache: false,
  }),
});
