import { AppContext } from "site/apps/site.ts";

export async function loader(_props: unknown, req: Request, ctx: AppContext) {
  let id = new URL(req.url).searchParams.get("user");

  if (!id) {
    id = await ctx.invoke.site.loaders.userCookie() ?? null;
  }

  if (id) {
    const user = await ctx.invoke.site.loaders.invitee({ id });
    if (user) {
      console.log("SHOULD REDIRECT")
      ctx.response.headers.set("Set-Cookie", `user=${user.id}`);
      ctx.response.headers.set("Location", "/itens");
      ctx.response.status = 302;
    }
  }
}

export default function Private() {

}
