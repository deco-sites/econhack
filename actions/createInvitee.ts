import { Invitee } from "site/loaders/invitees.ts";

export interface Props {
  username: string;
  email?: string;
}

export default async function loader(
  props: Props,
  _req: Request,
  _ctx: unknown,
): Promise<Invitee> {
  return await fetch("http://econhackapi.edurodrigues.dev/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...props,
      email: props.email ?? "placeholder@email.com",
    }),
  }).then((res) => res.json());
}
