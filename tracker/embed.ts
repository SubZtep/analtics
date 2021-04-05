addEventListener("fetch", event => {
  const response = new Response(
    JSON.stringify({
      ip: event.request.headers.get("x-forwarded-for"),
      uagent: event.request.headers.get("user-agent"),
      req: JSON.stringify(event.request),
    }),
    {
      headers: {
        "content-type": "text/javascript; charset=utf-8",
        // "content-type": "application/json; charset=UTF-8",
        // "Content-Type": "text/html; charset=utf-8"
        // "Content-Type": "text/javascript; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    }
  )
  event.respondWith(response)
})
