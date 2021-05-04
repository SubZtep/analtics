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

  const scripts = ["tester.js", "tester_recorder.js"];

  let js = "";

  try {
    const resAll = await Promise.all(
      scripts.map((src) => fetch(new URL(src, import.meta.url)))
    );
    js = (await Promise.all(resAll.map((res) => res.text()))).join(";");
  } catch {
    return new Response(null, { status: 500 });
  }

  // const js =
  //   // `window.KAJAIO = ${JSON.stringify(vars)};\n\n` +
  //   await res.text();

  return new Response(js, { headers });
}
