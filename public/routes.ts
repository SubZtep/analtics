import { serve, jsx } from "https://deno.land/x/sift@0.2.0/mod.ts"
import { handleTracker, handleEvent, handleFeature } from "./tracker.ts"
import homePage from "./home.jsx"
import "../lib/dotenv.ts"

console.log("XXX", Deno.env.get("GRAPHQL_SECRET"))

serve({
  // Api
  "/tracker/:account/:noscript?": handleTracker,
  "/event/:visit/:event": handleEvent,
  "/feature/:visit": handleFeature,

  // Web
  "/": () => jsx(homePage()),
  "/favicon.ico": () => new Response(null, { status: 418 }),
})
