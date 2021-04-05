import chalkin from "https://deno.land/x/chalkin/mod.ts"

export const log = (msg1: string, msg2?: string) => {
  if (msg2) {
    console.log(chalkin.green(msg1), chalkin.cyan(msg2))
  } else {
    console.log(chalkin.green(msg1))
  }
}

export const logError = (message: string) => {
  console.log(chalkin.red(message))
}
