import { AppContext } from "site/apps/deco/records.ts";
import { Item } from "site/loaders/itemList.ts";
import { items } from "site/db/schema.ts";

export interface Props {
  item: Item;
}

export default async function action(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const drizzle = await ctx.invoke.records.loaders.drizzle();
  await drizzle.insert(items).values(props.item);
}
