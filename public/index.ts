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
  "/tracker/:account/:noscript?": async (request, { account, noscript }) => {
    await createVisit(account, request, noscript === "noscript")
    return new Response()
  },
  "/favicon.ico": () => new Response(null, { status: 418 }),
})
