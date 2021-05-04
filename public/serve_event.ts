import type { PathParams } from "../deps.ts";
import { createEvent } from "../core/creates.ts";

function validParams(params?: PathParams): asserts params {
  // return (
  //   params !== undefined &&
  //   !Array.isArray(params.visit) &&
  //   !Array.isArray(params.event)
  // );
  if (
    params === undefined ||
    Array.isArray(params.visit) ||
    Array.isArray(params.event)
  ) {
    throw new Error("Boo")
  }
}

export default async function serveEvent(
  request: Request,
  params?: PathParams
) {
  // if (!validParams(params)) {
  //   return new Response(null, { status: 400 });
  // }
  validParams(params)

  await createEvent(
    params.visit as string,
    params.event as string,
    await request.text()
  );

  return new Response();
}
