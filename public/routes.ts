import { jsx, serve } from "../deps.ts";
import { handleEvent, handleFeature, handleTracker } from "./tracker.ts";
import homePage from "./home.jsx";

serve({
  // Api
  "/tracker/:account/:noscript?": handleTracker,
  "/event/:visit/:event": handleEvent,
  "/feature/:visit": handleFeature,

  // Web
  "/": () => jsx(homePage()),
  "/favicon.ico": () => new Response(null, { status: 418 }),
});
