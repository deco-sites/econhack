import { SectionProps } from "deco/types.ts";
import Image from "apps/website/components/Image.tsx";
import { useSection } from "deco/hooks/useSection.ts";
import { AppContext } from "site/apps/site.ts";
import { toItem } from "site/utils/transform.ts";
import { Item } from "site/loaders/itemList.ts";
import Icon from "site/components/ui/Icon.tsx";

export interface Props {
  domain: string;

  /**
   * @hide
   */
  products?: { item: Item; inList: boolean }[];

  /**
   * @hide
   */
  idx?: number;
}

export async function loader(props: Props, _req: Request, ctx: AppContext) {
  if (props.idx && props.products?.length) {
    const product = props.products[props.idx];

    if (!product) {
      throw new Error("Product not found");
    }

    product.inList = true;
    await ctx.invoke.site.actions.addItem({
      item: product.item,
    });

    return props;
  }

  if (props.domain) {
    const res = await ctx.invoke.site.loaders.vtexProductSearch({
      domain: props.domain,
    });

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

export default function Section(props: SectionProps<typeof loader>) {
  return (
    <ul class="gap-3 mt-8 mx-auto grid grid-cols-4 w-max">
      {props.products?.map((product, idx) => (
        <li class="relative flex flex-col w-48 p-3 border border-gray-200 rounded">
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
            hx-post={useSection<typeof Section>({
              props: { ...props, idx },
            })}
            hx-trigger="click"
            hx-target="closest section"
            hx-swap="outerHTML"
            disabled={product.inList}
          >
            <span class="hidden loading loading-spinner loading-xs [.htmx-request_&]:inline " />
            <span class="[.html-request_&]:hidden inline">
              {product.inList ? "Adicionado" : "Adicionar à lista"}
            </span>
          </button>
          {product.inList && (
            <button
              class="absolute top-0 right-0 p-1 bg-white rounded-full shadow-black"
              hx-post={useSection<typeof Section>({
                props: { ...props, idx },
              })}
              hx-trigger="click"
              hx-target="closest section"
              hx-swap="outerHTML"
            >
              <Icon id="Trash" width={20} height={20} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
