import { AppContext } from "site/apps/site.ts";

export interface Props {
  userId?: string | null;
}

export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const id = props.userId ?? await ctx.invoke.site.loaders.userCookie();
  return await ctx.invoke.site.loaders.invitee({ id });
}
