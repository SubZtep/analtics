import { assertThrowsAsync } from "../dev_deps.ts";
import { gql, q } from "./gql.ts";

Deno.test("Invalid host", async () => {
  const query = gql("", "");
  await assertThrowsAsync(async () => await query(""));
});

Deno.test("Invalid account", async () => {
  const query = gql(Deno.env.get("GRAPHQL_URL")!, "");
  await assertThrowsAsync(async () => await query(""));
});

Deno.test("Invalid query", async () => {
  await assertThrowsAsync(async () => await q(""));
});
