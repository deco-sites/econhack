import { toProduct } from "apps/vtex/utils/transform.ts";
import { SectionProps } from "deco/types.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  domain: string;
}

export async function loader(props: Props, _req: Request, _ctx: unknown) {
  const res: any[] = await fetch(
    `${props.domain}/api/catalog_system/pub/products/search`,
  ).then((res) => res.json());

  const products = res.map((r) =>
    toProduct(r, r.items[0], 1, {
      baseUrl: props.domain,
      priceCurrency: "BRL",
    })
  );

  return { products };
}

export default function FeaturedProducts(props: SectionProps<typeof loader>) {
  return (
    <ul class="flex gap-3 w-full flex-wrap">
      {props.products.map((product) => (
        <li class="flex flex-col w-48 p-3 border border-gray-200 rounded">
          {product.image?.length
            ? (
              <a href={product.url} target="_blank">
                <Image
                  src={product.image[0].url ?? ""}
                  width={248}
                  height={248}
                  class="mx-auto mb-3"
                />
              </a>
            )
            : null}
          <span class="text-ellipsis whitespace-nowrap text-left overflow-hidden text-xs">
            {product.name}
          </span>
          <p class="font-bold text-sm">
            {product.offers?.highPrice.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
          <button class="btn btn-primary mt-3">Adicionar à lista</button>
        </li>
      ))}
    </ul>
  );
}
