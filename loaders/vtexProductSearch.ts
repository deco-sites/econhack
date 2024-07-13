import { Product } from "apps/vtex/utils/types.ts";

export interface Props {
  domain: string;
  queryString: string;
}

export default async function loader(props: Props): Promise<Product[]> {
  return await fetch(
    `${props.domain}/api/catalog_system/pub/products/search?${props.queryString}`,
  ).then((res) => res.json());
}
