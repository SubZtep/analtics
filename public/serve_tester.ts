// interface GlobalWindowVars {
//   /** visit opening url */
//   origin: string;
//   /** visit id */
//   visit: string;
// }

// export default async function serveTester(request: Request) {
export default async function serveTester() {
  // const vars: GlobalWindowVars = {
  //   origin: new URL(request.url).origin,
  //   visit: "69",
  // };

  const headers = new Headers({
    "Cache-Control": "no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "Content-Type": "text/javascript; charset=UTF-8",
  });

  let js = ""

  try {
    const ress = await Promise.all([
      // https://github.com/antonmedv/finder
      fetch(new URL("finder.js", import.meta.url)),
      fetch(new URL("tester.js", import.meta.url)),
    ])

    // js = (await Promise.all(ress.map(res => res.text()))).join(";")
    js = (await Promise.all(ress.map(res => res.text()))).join(";").replace("export function", "function")

    // js += (await finder.text()).replace("export ", "")
    // js += await tester.text()

  } catch {
    return new Response(null, { status: 500 });
  }

  // const res = await fetch(new URL("tester.js", import.meta.url));
  // if (!res.ok) {
  //   return new Response(null, { status: 500 });
  // }

  // const js =
  //   // `window.KAJAIO = ${JSON.stringify(vars)};\n\n` +
  //   await res.text();

  return new Response(js, { headers });
}
