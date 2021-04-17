import { Application, send } from "../dev_deps.ts";
import { oakCors } from "../dev_deps.ts";
import { join } from "../dev_deps.ts";

const app = new Application();

app.use(
  oakCors({
    origin: "http://localhost:8080",
  }),
);

app.use(async (context) => {
  await send(context, context.request.url.pathname, {
    root: join(Deno.cwd(), "public"),
    index: "map.html",
  });
});

await app.listen("localhost:8080");
