import { AppContext } from "site/apps/site.ts";
import { Invitee } from "site/loaders/invitees.ts";

export interface Props {
  id: string;
}

export default async function loader(
  props: Props,
  _req: Request,
  _ctx: AppContext,
): Promise<Invitee> {
  return await fetch(`http://econhackapi.edurodrigues.dev/user/${props.id}`)
    .then((r) => r.json());
}
