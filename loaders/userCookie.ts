export default function loader(
  _props: unknown,
  req: Request,
  _ctx: unknown,
) {
  return req.headers.get("cookie")?.split(";").map((c) => c.trim()).find((c) =>
    c.startsWith("user=")
  );
}
