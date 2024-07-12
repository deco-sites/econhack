import { AppContext } from "site/apps/deco/records.ts";
import { invitees } from "site/db/schema.ts";

export default async function loader(
  _props: unknown,
  _req: Request,
  ctx: AppContext,
) {
  const drizzle = await ctx.invoke.records.loaders.drizzle();
  return drizzle.select().from(invitees);
}

