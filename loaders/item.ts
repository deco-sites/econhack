import { AppContext } from "site/apps/deco/records.ts";
import { items } from "site/db/schema.ts";
import { eq } from "drizzle-orm";

export interface Props {
  id: string;
}

export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const drizzle = await ctx.invoke.records.loaders.drizzle();

  return await drizzle.select().from(items).where(eq(items.id, props.id));
}
