import fetch from "node-fetch"

export default (url: string, secret: string) => async (mutation: string) =>
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({ query: mutation }),
  })
