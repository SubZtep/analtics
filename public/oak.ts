import { Application, send } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import * as path from "https://deno.land/std@0.93.0/path/mod.ts";

const app = new Application();

// app.use((ctx) => {
//   ctx.response.body = "Hello world!";
// });

// console.log("XXX", `${Deno.cwd()}/public`)

app.use(
  oakCors({
    // origin: "http://localhost:8000"
    origin: "*"
  }),
);

app.use(async (context) => {
  await send(context, context.request.url.pathname, {
    root: path.join(Deno.cwd(), "public"),
    index: "home.html",
  });
});

await app.listen("localhost:8000");
// await app.listen({ port: 8000 });
