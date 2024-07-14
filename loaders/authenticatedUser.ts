import { AppContext } from "site/apps/site.ts";

export default async function loader(
  _props: unknown,
  _req: Request,
  ctx: AppContext,
) {
  const id = await ctx.invoke.site.loaders.userCookie();
  return await ctx.invoke.site.loaders.invitee({ id });
}
