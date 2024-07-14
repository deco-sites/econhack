import { AppContext } from "site/apps/site.ts";

export interface Props {
  itemId: string;
  username: string;
  message?: string;
}

export default async function action(
  props: Props,
  _req: Request,
  _ctx: AppContext,
) {
  return await fetch(
    "http://econhackapi.edurodrigues.dev/reservation-by-user",
    {
      method: "POST",
      body: JSON.stringify(props),
      headers: {
        "Content-Type": "application/json",
      },
    },
  ).then((r) => r.json());
}
