import { SectionProps } from "deco/types.ts";
import Image from "apps/website/components/Image.tsx";
import { useSection } from "deco/hooks/useSection.ts";
import { AppContext } from "site/apps/site.ts";
import { toItem } from "site/utils/transform.ts";
import { Item } from "site/loaders/itemList.ts";
import Icon from "site/components/ui/Icon.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";
import { useId } from "site/sdk/useId.ts";

/**
 * @title {{{name}}}
 */
interface Store {
  logo: ImageWidget;
  name: string;
  url: string;
}

export interface Props {
  stores: Store[];

  /**
   * @hide
   */
  state: {
    storeIdx?: number;
    products?: { item: Item; inList: boolean }[];
    idx?: number;
  };
}

export async function loader(props: Props, _req: Request, ctx: AppContext) {
  const state = props.state ?? { storeIdx: 0 };

  if (state.idx && state.products?.length) {
    const product = state.products[state.idx];

    if (!product) {
      throw new Error("Product not found");
    }

    product.inList = true;
    await ctx.invoke.site.actions.addItem({
      item: product.item,
    });

    return props;
  }

  if (state.storeIdx !== undefined && !state.products?.length) {
    let res = await ctx.invoke.site.loaders.vtexProductSearch({
      domain: props.stores[state.storeIdx].url,
    });

    res = res.splice(0, 8);

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

    return { ...props, state: { storeIdx: state.storeIdx, products } };
  }

  return props;
}

export default function Section(props: SectionProps<typeof loader>) {
  const id = useId();
  const state = props.state ?? {};

  return (
    <div class="bg-primary min-h-screen flex flex-col justify-end">
      <ul class="bg-white rounded-xl mb-3 mx-auto flex flex-wrap gap-3">
        {props.stores.map((store, idx) => (
          <li>
            <button
              class="btn rounded-xl w-32 h-24 opacity-50 hover:opacity-100 disabled:opacity-100 transition-all relative border-none"
              style={{ background: "transparent" }}
              hx-post={useSection<typeof Section>({
                props: { ...props, state: { storeIdx: idx } },
              })}
              hx-trigger="click"
              hx-target="closest section"
              hx-swap="outerHTML"
              disabled={state.storeIdx === idx}
            >
              <Image
                src={store.logo}
                width={128}
                class="mx-auto inline [.htmx-request_&]:hidden"
              />
              <span class="loading loading-spinner hidden [.htmx-request_&]:inline" />
            </button>
          </li>
        ))}
      </ul>
      <ul
        class="gap-3 mx-auto grid grid-cols-4 w-max bg-base-200 pt-6 px-6 rounded-t-xl"
        id={id}
      >
        {/* Skeleton */}
        {[...Array(8)].map(() => (
          <div class="skeleton w-48 h-[300px] rounded bg-gray-100 hidden [.htmx-request_&]:block">
          </div>
        ))}
        {/* Content */}
        {state.products?.map((product, idx) => (
          <li class="relative flex flex-col w-48 p-3 border border-gray-200 rounded [.htmx-request_&]:hidden">
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
              class="btn btn-secondary mt-3"
              hx-post={useSection<typeof Section>({
                props: { ...props, state: { ...state, idx } },
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
                  props: { ...props, state: { ...state, idx } },
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
    </div>
  );
}
