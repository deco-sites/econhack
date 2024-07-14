export interface Item {
  id: string;
  name: string;
  price: number;
  image: string;
  url: string;
  reservedBy: string | null;
  message: string | null;
}

export default async function loader(
  _props: unknown,
  _req: Request,
  _ctx: unknown,
): Promise<Item[]> {
  return await fetch("http://econhackapi.edurodrigues.dev/items").then((res) =>
    res.json() as Promise<Item[]>
  );
}
