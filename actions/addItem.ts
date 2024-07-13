import { Item } from "site/loaders/itemList.ts";

export interface Props {
  item: Item;
}

export default async function action(
  props: Props,
  _req: Request,
  _ctx: unknown,
) {
  return await fetch("http://econhackapi.edurodrigues.dev/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(props.item),
  });
}
