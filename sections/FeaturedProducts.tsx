import { SectionProps } from "deco/types.ts";
import Image from "apps/website/components/Image.tsx";
import { useSection } from "deco/hooks/useSection.ts";
import { AppContext } from "site/apps/site.ts";
import { toItem } from "site/utils/transform.ts";
import { Item } from "site/loaders/itemList.ts";
import Icon from "site/components/ui/Icon.tsx";
import { Color, ImageWidget } from "apps/admin/widgets.ts";
import { useId } from "site/sdk/useId.ts";

/**
 * @title {{{name}}}
 */
interface Store {
  logo: ImageWidget;
  name: string;
  url: string;
  theme?: Color;
}

export interface Props {
  stores: Store[];

  /**
   * @hide
   */
  state: {
    storeIdx?: number;
    searchTerm?: string;
    products?: { item: Item; inList: boolean }[];
  };
}

export async function loader(props: Props, req: Request, ctx: AppContext) {
  const state = props.state ?? { storeIdx: 0 };

  const s = new URL(req.url).searchParams.get("s");
  if (s) {
    const n = Number(s);
    if (!isNaN(n)) state.storeIdx = n;
  }

  if (state.products?.length) {
    const url = new URL(req.url);
    const idx = Number(url.searchParams.get("idx"));

    const product = state.products[idx];

    if (!product) {
      throw new Error("Product not found");
    }

    const action = url.searchParams.get("action");
    if (action === "remove") {
      product.inList = false;
      await ctx.invoke.site.actions.removeItem({
        id: product.item.id,
      });

      return props;
    }

    if (action === "add") {
      product.inList = true;
      await ctx.invoke.site.actions.addItem({
        item: product.item,
      });

      console.log({ props });
      return props;
    }
  }

  if (req.headers.get("content-type") === "application/x-www-form-urlencoded") {
    const ft = await req.formData().then((d) => d.get("search")) as string;

    state.searchTerm = ft;

    let res = await ctx.invoke.site.loaders.vtexProductSearch({
      domain: props.stores[state.storeIdx ?? 0].url,
      query: { ft },
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

    return {
      ...props,
      state: { ...state, products, storeIdx: state.storeIdx },
    };
  }

  if (!state.products?.length) {
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

  const store = props.stores[state.storeIdx ?? 0];

  return (
    <div
      class="bg-primary min-h-screen flex flex-col justify-end transition-colors"
      style={store.theme ? { backgroundColor: store.theme } : {}}
    >
      <div class="flex flex-col items-center text-white mt-8 mb-8">
        <h1 class="text-3xl font-extrabold uppercase">
          Monte sua lista de presente
        </h1>
        <p class="text-xs">
          Selecione uma de nossas lojas parceiras e busque os produtos que
          deseja ser presenteado(a).
        </p>
      </div>
      <ul class="bg-white rounded-xl mb-3 mx-auto flex flex-wrap gap-3">
        {props.stores.map((store, idx) => (
          <li>
            <button
              class="btn rounded-xl w-32 h-24 opacity-50 hover:opacity-100 disabled:opacity-100 transition-all relative border-none"
              style={{ background: "transparent" }}
              hx-get={useSection<typeof Section>({
                href: "?s=" + idx,
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
      <div class="w-max bg-base-200 pt-6 px-6 pb-8 rounded-t-xl mx-auto">
        <input
          class="input input-bordered mb-4 w-full max-w-60"
          name="search"
          type="search"
          placeholder={`Busque em ${store.name}`}
          hx-post={useSection<typeof Section>({ props })}
          hx-trigger="input changed delay:500ms, search"
          hx-target="closest section"
          value={state.searchTerm}
        />
        {state.products?.length === 0 && (
          <p class="text-center mt-3">Nenhum produto encontrado</p>
        )}
        <ul
          class="gap-3 grid grid-cols-4"
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
                hx-post={useSection({
                  props,
                  href: `?action=add&idx=${idx}`,
                })}
                hx-trigger="click"
                hx-target="closest section"
                hx-swap="outerHTML"
                disabled={product.inList}
              >
                <span class="hidden loading loading-spinner loading-xs [.htmx-request_&]:inline " />
                <span class="[.htmx-request_&]:hidden inline">
                  {product.inList ? "Adicionado" : "Adicionar à lista"}
                </span>
              </button>
              {product.inList && (
                <button
                  class="absolute top-0 right-0 w-6 h-6 flex items-center justify-center p-1 bg-white rounded-full shadow-black [.htmx-request_&]:disabled"
                  hx-post={useSection({
                    props,
                    href: `?action=remove&idx=${idx}`,
                  })}
                  hx-trigger="click"
                  hx-target="closest section"
                  hx-swap="outerHTML"
                >
                  <span class="inline [.htmx-request_&]:hidden">
                    <Icon id="Trash" width={20} height={20} />
                  </span>
                  <span class="loading loading-spinner hidden [.htmx-request_&]:inline" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
