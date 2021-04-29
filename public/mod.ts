import { serve, serveStatic } from "../deps.ts";
import { handleEvent, handleFeature, handleTracker } from "./tracker.ts";

serve({
  // Api
  "/tracker/:account/:noscript?": handleTracker,
  "/event/:visit/:event": handleEvent,
  "/feature/:visit": handleFeature,

  // Web
  "/": serveStatic("map.html", {
    baseUrl: import.meta.url,
    cache: false,
    intervene: (_request: Request, response: Response) => {
      response.headers.set("Content-Type", "text/html; charset=utf-8");
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set(
        "Content-Security-Policy",
        "default-src * data: 'unsafe-inline' 'unsafe-eval'; img-src * data:; style-src * 'unsafe-inline' 'unsafe-eval'",
      );
      return response;
    },
  }),
  "home.css": serveStatic("home.css", {
    baseUrl: import.meta.url,
    cache: false,
    intervene: (_request: Request, response: Response) => {
      response.headers.set("Content-Type", "text/css; charset=utf-8");
      return response;
    },
  }),
  "favicon.ico": serveStatic("favicon.ico", {
    baseUrl: import.meta.url,
    cache: false,
    intervene: (_request: Request, response: Response) => {
      response.headers.set("Content-Type", "image/vnd.microsoft.icon");
      return response;
    },
  }),
});
