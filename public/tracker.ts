import type { PathParams } from "https://deno.land/x/sift@0.2.0/mod.ts"
import { createVisit, createEvent } from "../lib/queries.ts"

const js = (base: string) => `
document.addEventListener("visibilitychange", () => {
  navigator.sendBeacon(${base}/visibilitychange", document.visibilityState)
})
`

export const handleTracker = async (request: Request, params?: PathParams) => {
  if (params === undefined || typeof params.account !== "string") {
    return new Response(null, { status: 400 })
  }

  const hasJS = params.noscript !== "noscript"
  const visit = await createVisit(params.account, request, !hasJS)

  if (visit === undefined) {
    return new Response(null, { status: 500 })
  }

  return new Response(hasJS ? js(`${new URL(request.url).origin}/event/${visit}`) : null, {
    headers: {
      "content-type": hasJS ? "text/javascript; charset=utf-8" : "text/plain; charset=UTF-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  })
}

export const handleEvent = async (request: Request, params?: PathParams) => {
  if (params === undefined || typeof params.visit !== "string" || typeof params.event !== "string") {
    return new Response(null, { status: 400 })
  }

  await createEvent(params.visit, params.event, await request.text())
  return new Response()
}
