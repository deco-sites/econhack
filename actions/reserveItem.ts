import { AppContext } from "site/apps/deco/records.ts";
import { gifts } from "site/db/schema.ts";

export interface Props {
  itemUrl: string;
  username: string;
  message?: string;
}

export default async function action(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const drizzle = await ctx.invoke.records.loaders.drizzle();
  await drizzle.insert(gifts).values(props);
}
