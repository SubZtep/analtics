import { serve, serveStatic } from "../deps.ts";
import { handleEvent, handleFeature, handleTracker } from "./tracker.ts";

// const baseUrl = import.meta.url.startsWith("file")
//   ? "http://localhost:8080/"
//   : import.meta.url;
const baseUrl = import.meta.url;

console.log(baseUrl)

serve({
  // Api
  "/tracker/:account/:noscript?": handleTracker,
  "/event/:visit/:event": handleEvent,
  "/feature/:visit": handleFeature,

  // Web
  "/": serveStatic("home.html", {
    baseUrl,
    cache: false,
    intervene: (response: Response) => {
      response.headers.set("Content-Type", "text/html; charset=utf-8");
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set(
        "Content-Security-Policy",
        "default-src * data: 'unsafe-inline' 'unsafe-eval'; img-src * data:; style-src * 'unsafe-inline' 'unsafe-eval'"
      );
      return response;
    },
  }),
  "home.css": serveStatic("home.css", {
    baseUrl,
    cache: false,
    intervene: (response: Response) => {
      response.headers.set("Content-Type", "text/css; charset=utf-8");
      return response;
    },
  }),
  "/favicon.ico": serveStatic("favicon.ico", {
    baseUrl,
    cache: false,
    intervene: (response: Response) => {
      response.headers.set("Content-Type", "image/vnd.microsoft.icon")
      return response
    }
  }),
});
