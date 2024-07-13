import { SectionProps } from "deco/types.ts";
import Image from "apps/website/components/Image.tsx";
import { useSection } from "deco/hooks/useSection.ts";
import { AppContext } from "site/apps/site.ts";
import { toItem } from "site/utils/transform.ts";
import { Item } from "site/loaders/itemList.ts";

export interface Props {
  domain: string;
  products?: { item: Item; inList: boolean }[];
}

export async function loader(props: Props, req: Request, ctx: AppContext) {
  const idx = new URL(req.url).searchParams.get("index") ?? "";
  console.log({ props });

  if (idx && props.products?.length) {
    const product = props.products[Number(idx)];

    if (!product) {
      throw new Error("Product not found");
    }

    product.inList = true;
    ctx.invoke.site.actions.addItem({
      item: product.item,
    });

    console.log("add item");
    console.log({ product });

    return props;
  }

  if (props.domain) {
    const res: any[] = await fetch(
      `${props.domain}/api/catalog_system/pub/products/search`,
    ).then((res) => res.json());

    const products = await Promise.all(res.map(async (r) => {
      const item = toItem(r, r.items[0]);

      const inList = !!(await ctx.invoke.site.loaders.item({
        id: item.id,
      }));

      return {
        item,
        inList,
      };
    }));
    return { ...props, products };
  }

  return { ...props, products: [] };
}

export default function FeaturedProducts(props: SectionProps<typeof loader>) {
  return (
    <ul class="flex gap-3 w-full flex-wrap">
      {props.products?.map((product, idx) => (
        <li class="flex flex-col w-48 p-3 border border-gray-200 rounded">
          <input type="hidden" name="index" value={idx} />
          {product.item.image
            ? (
              <a href={product.item.url} target="_blank">
                <Image
                  src={product.item.image ?? ""}
                  width={248}
                  height={248}
                  class="mx-auto mb-3"
                />
              </a>
            )
            : null}
          <span class="text-ellipsis whitespace-nowrap text-left overflow-hidden text-xs">
            {product.item.name}
          </span>
          <p class="font-bold text-sm">
            {product.item.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
          <button
            class="btn btn-primary mt-3"
            hx-post={useSection({ props })}
            hx-target="closest section"
            hx-swap="outerHTML"
            hx-trigger="click"
          >
            {product.inList ? "Adicionado" : "Adicionar à lista"}
          </button>
        </li>
      ))}
    </ul>
  );
}
