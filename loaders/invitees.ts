export interface Invitee {
  id: string;
  email: string;
  username: string;
}

export default async function loader(
  _props: unknown,
  _req: Request,
  _ctx: unknown,
): Promise<Invitee[]> {
  return await fetch(
    `http://econhackapi.edurodrigues.dev/user`,
  ).then((r) => r.json());
}
