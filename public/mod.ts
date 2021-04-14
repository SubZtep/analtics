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
      response.headers.set("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'");
      return response;
    },
  }),
  "/favicon.ico": serveStatic("favicon.ico", {
    baseUrl: import.meta.url,
    cache: false,
  }),
});
