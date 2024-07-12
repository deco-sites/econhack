import { AppContext } from "site/apps/deco/records.ts";
import { items } from "site/db/schema.ts";

export interface Item {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  url: string;
  reservedBy: string | null;
}

export default async function loader(
  _props: unknown,
  _req: Request,
  ctx: AppContext,
) {
  const drizzle = await ctx.invoke.records.loaders.drizzle();
  return await drizzle.select().from(items);
}
