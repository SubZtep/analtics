import { createAccount } from "../core/creates.ts";

if (Deno.args.length !== 1) {
  console.log("The only argument is the account name.");
  Deno.exit(2);
}

if (Deno.env.get("ACCOUNT")) {
  console.log("To use this script please remove account from .env file.");
  Deno.exit(2);
}

const id = await createAccount(Deno.args[0]);

if (id === undefined) {
  Deno.exit(1);
}

console.log(id);
