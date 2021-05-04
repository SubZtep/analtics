import type { PathParams } from "../deps.ts";
// import { createVisit } from "../core/creates.ts";

function validParams(params?: PathParams) {
  return params !== undefined && !Array.isArray(params.account);
}

interface GlobalWindowVars {
  /** visit opening url */
  origin: string;
  /** visit id */
  visit: string;
}

export default async function serveTracker(
  request: Request,
  params?: PathParams
) {
  if (!validParams(params)) {
    return new Response(null, { status: 400 });
  }
  const hasJS = params!.noscript !== "noscript";

  const visit = "69";
  // const visit = await createVisit(params!.account as string, {
  //   ip: request.headers.get("x-forwarded-for") || "",
  //   userAgent: request.headers.get("user-agent") || "",
  //   noScript: !hasJS,
  // });

  if (visit === undefined) {
    return new Response(null, { status: 500 });
  }

  const headers = new Headers({
    "Cache-Control": "no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
  });

  if (!hasJS) {
    headers.append("Content-Type", "text/plain; charset=UTF-8");
    return new Response(null, { headers });
  }

  const vars: GlobalWindowVars = {
    origin: new URL(request.url).origin,
    visit,
  };

  const res = await fetch(new URL("tracker.js", import.meta.url));
  if (!res.ok) {
    return new Response(null, { status: 500 });
  }

  const js = `window.KAJAIO = ${JSON.stringify(vars)};\n\n` + (await res.text());
  headers.append("Content-Type", "text/javascript; charset=UTF-8");

  return new Response(js, { headers });
}
