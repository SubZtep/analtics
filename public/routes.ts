import { serve, jsx } from "https://deno.land/x/sift@0.2.0/mod.ts"
import { handleTracker, handleEvent } from "./tracker.ts"
import homePage from "./home.jsx"
import "../lib/dotenv.ts"

serve({
  "/": () => jsx(homePage()),
  "/tracker/:account/:noscript?": handleTracker,
  "/event/:visit/:event": handleEvent,
  "/favicon.ico": () => new Response(null, { status: 418 }),
})
