import { serve, serveStatic } from "../deps.ts";
import { handleEvent, handleFeature, handleTracker } from "./tracker.ts";

serve({
  // Api
  "/tracker/:account/:noscript?": handleTracker,
  "/event/:visit/:event": handleEvent,
  "/feature/:visit": handleFeature,

  // Web
  "/": serveStatic("home.html", { baseUrl: import.meta.url }),
  "/favicon.ico": serveStatic("favicon.ico", { baseUrl: import.meta.url }),
});
