import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts"
import { createAccount } from "../bin/queries.ts"
import { log, logError } from "../lib/log.ts"

if (Deno.args.length !== 1) {
  logError("The only argument is the account name.")
  Deno.exit(2)
}

if (config().ACCOUNT) {
  logError("To use this script please remove account from .env file.")
  Deno.exit(2)
}

const id = await createAccount(Deno.args[0])

if (id === undefined) {
  Deno.exit(1)
}

log("Account ID:", id)
