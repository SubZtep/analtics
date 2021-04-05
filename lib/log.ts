import { styles } from "https://deno.land/x/ansi_styles@1.0.1/mod.ts"

export const log = (msg1: string, msg2?: string) => {
  if (msg2) {
    console.log(`${styles.green.open}${msg1}${styles.green.close}`, `${styles.cyan.open}${msg2}${styles.cyan.close}`)
  } else {
    console.log(`${styles.green.open}${msg1}${styles.green.close}`)
  }
}

export const logError = (msg1: string, msg2?: string) => {
  if (msg2) {
    console.log(`${styles.red.open}${msg1}${styles.red.close}`, `${styles.redBright.open}${msg2}${styles.redBright.close}`)
  } else {
    console.log(`${styles.red.open}${msg1}${styles.red.close}`)
  }
}
