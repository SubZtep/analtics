import type { Feature } from "../lib/analtics.types.ts"
import type { PathParams } from "https://deno.land/x/sift@0.2.0/mod.ts"
import { createVisit, createEvent, createFeature } from "../lib/queries.ts"

const js = (origin: string, visit: string) => `
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    navigator.sendBeacon("${origin}/feature/${visit}", JSON.stringify({
      location: window.location.href,
      referrer: document.referrer,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio
    }))
  }, 500)
}, { once: true })

document.addEventListener("visibilitychange", () => {
  navigator.sendBeacon("${origin}/event/${visit}/visibilitychange", document.visibilityState)
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

  const base = `${new URL(request.url).origin}/event/${visit}`

  return new Response(hasJS ? js(new URL(request.url).origin, visit) : null, {
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

export const handleFeature = async (request: Request, params?: PathParams) => {
  if (params === undefined || typeof params.visit !== "string") {
    return new Response(null, { status: 400 })
  }

  const feature: Feature = await request.json()
  await createFeature(params.visit, feature)
  return new Response()
}
