import { Product } from "apps/vtex/utils/types.ts";

export interface Props {
  domain: string;
  query: Record<string, string>;
}

export default async function loader(props: Props): Promise<Product[]> {
  const queryString = new URLSearchParams();

  for (const [key, value] of Object.entries(props.query ?? {})) {
    queryString.append(key, encodeURIComponent(value));
  }

  queryString.append("fq", "isAvailablePerSalesChannel_1:1");

  return await fetch(
    `${props.domain}/api/catalog_system/pub/products/search?${queryString}`,
  ).then((res) => res.json());
}
