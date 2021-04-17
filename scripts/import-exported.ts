import { red } from "https://deno.land/std@0.75.0/fmt/colors.ts";
import * as path from "https://deno.land/std@0.93.0/path/mod.ts";
import { readLine } from "https://raw.githubusercontent.com/deepakshrma/deno-by-example/master/examples/file_reader.ts";
import { createVisit } from "../core/creates.ts";

if (Deno.args.length === 0) {
  console.log("exported dir as argument required");
  Deno.exit(1);
}

const dir = Deno.args[0].replaceAll('"', "");
const account = Deno.env.get("ACCOUNT")!;

const reader = await readLine(path.join(dir, "Visit.json"));
for await (const value of reader) {
  let json;
  try {
    json = JSON.parse(value);
  } catch (e) {
    console.error(red(e.message));
    continue;
  }

  const { data } = json;
  delete data.geo;
  delete data.account;
  data.created = data.created["@ts"];
  createVisit(account, data);
  console.log(data.created);
}
