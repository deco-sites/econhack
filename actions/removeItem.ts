export interface Props {
  id: string;
}

export default async function action(
  props: Props,
  _req: Request,
  _ctx: unknown,
) {
  console.log({ props })
  return await fetch(
    "http://econhackapi.edurodrigues.dev/item?itemId=" + props.id,
    { method: "DELETE" },
  );
}
