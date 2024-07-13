import { Item } from "site/loaders/itemList.ts";

export interface Props {
  id: string;
}

export default async function loader(
  props: Props,
  _req: Request,
  _ctx: unknown,
) {
  const response = await fetch(
    `http://econhackapi.edurodrigues.dev/item/?id=${props.id}`,
  )
    .then((res) => res.json()).catch(() => null);

  return response as Item | null;
}
