import { serve } from "https://deno.land/x/sift@0.2.0/mod.ts"
import { createVisit } from "../bin/queries.ts"

serve({
  "/": () =>
    new Response(
      `
                         _
        .-.          .-"' \`".
       :  .^._     .'        .
       "> I   +.-. : ,-.     :
       :  "."  I  "+ ._:     '
       |" "   .^.  I         .
       '.       "   \`-:     /
        \`-.     +        _.'
           \`-._     _.-='\`  zi.
                \`'\``,
      { headers: { "content-type": "text/plain; charset=UTF-8" } }
    ),

  "/tracker/:account/:noscript?": async (request, params) => {
    if (params === undefined || typeof params.account !== "string") {
      return new Response(null, { status: 400 })
    }

    const hasJS = params.noscript !== "noscript"
    await createVisit(params.account, request, !hasJS)

    return new Response(null, {
      headers: {
        "content-type": hasJS ? "text/javascript; charset=utf-8" : "text/plain; charset=UTF-8",
        "X-Content-Type-Options": "nosniff",
      },
    })
  },

  "/favicon.ico": () => new Response(null, { status: 418 }),
})
