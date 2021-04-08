if (Deno.env.get("GRAPHQL_URL") === undefined) {
  await import("https://deno.land/x/dotenv@v2.0.0/load.ts")
}
