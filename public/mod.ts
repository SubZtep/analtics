import { serve } from "../deps.ts";
import serveEvent from "./serve_event.ts";
import serveFeature from "./serve_feature.ts";
import serveTracker from "./serve_tracker.ts";
import serveTester from "./serve_tester.ts";

serve({
  "/tester": serveTester,
  "/tracker/:account/:noscript?": serveTracker,
  "/event/:visit/:event": serveEvent,
  "/feature/:visit": serveFeature,
  "/favicon.ico": () => new Response(null, { status: 418 }),
});
