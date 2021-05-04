import type { PathParams } from "../deps.ts";
import type { Feature } from "../types/analtics.ts";
import { createFeature } from "../core/creates.ts";

function validParams(params?: PathParams) {
  return params !== undefined && !Array.isArray(params.event);
}

export default async function serveFeature(
  request: Request,
  params?: PathParams
) {
  if (!validParams(params)) {
    return new Response(null, { status: 400 });
  }

  const feature: Feature = await request.json();
  await createFeature(params!.visit as string, feature);
  return new Response();
}
