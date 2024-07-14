import type { Item } from "site/loaders/itemList.ts";
import { useSection } from "deco/hooks/useSection.ts";
import { AppContext } from "site/apps/site.ts";
import Image from "apps/website/components/Image.tsx";
import { FlowerIcon } from "site/components/ui/icons/Flower.tsx";
import Modal from "site/components/ui/Modal.tsx";

export interface Props {
  items: Item[];
  status?: "chose" | "gifted";
  selectedItem?: Item;
}

export async function loader(props: Props, req: Request, ctx: AppContext) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user");
  if (userId) {
    // It should be something global, but it works for the hackathon delivery.
    ctx.response.headers.set("Set-Cookie", `user=${userId}`);
  }

  const user = await ctx.invoke.site.loaders.authenticatedUser();
  const itemId = url.searchParams.get("itemId");

  if (itemId) {
    props.selectedItem = props.items.find((item) => item.id === itemId);
  }

  if (
    itemId && user &&
    req.headers.get("content-type") === "application/x-www-form-urlencoded"
  ) {
    const message = await req.formData().then((f) =>
      f.get("message")?.toString()
    );

    await ctx.invoke.site.actions.reserveItem({
      itemId,
      username: user.username,
      message,
    });
  }

  return props;
}

export default function ItemsList(props: Props) {
  return (
    <div class="flex md:px-8 md:pt-6 pt-1 flex-col justify-end items-center bg-primary min-h-screen w-full">
      <FlowerIcon className="fixed w-80 h-auto left-0 top-[35%]" />
      <FlowerIcon className="fixed w-80 h-auto right-0 top-[55%] rotate-180" />
      <h1 class="md:text-5xl text-2xl text-white font-bold text-center">
        Lista de presentes
      </h1>
      <ul class="gap-3 md:mt-8 max-w-[900px] grid md:grid-cols-4 grid-cols-2 bg-base-200 rounded-t-xl md:p-6 p-2">
        {props.items.map((item) => {
          const isReserved = item.reservedBy !== undefined;
          return (
            <li
              class={`relative flex flex-col w-48 p-3 border border-gray-200 rounded [.htmx-request_&]:hidden ${
                isReserved ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <a href={item.url} target="_blank">
                <Image
                  src={item.image}
                  alt="Imagem do produto"
                  width={248}
                  height={248}
                  class="mx-auto mb-3"
                />
              </a>
              <span class="text-ellipsis whitespace-nowrap text-left overflow-hidden text-xs">
                {item.name}
              </span>
              <p class="font-bold text-sm">
                {item.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>

              <form>
                <button
                  hx-post={useSection<Props>({
                    href: `?itemId=${item.id}`,
                    props: { ...props, status: "chose" },
                  })}
                  hx-swap="outerHTML"
                  hx-target="closest section"
                  hx-trigger="click"
                  class={`btn btn-primary mt-3 text-center w-full ${
                    !isReserved ? "cursor-pointer" : "opacity-70 cursor-default"
                  }`}
                  disabled={isReserved}
                >
                  <span class="inline [.htmx-request_&]:hidden">
                    {isReserved ? "Presenteado" : "Presentear"}
                  </span>
                  <span class="loading loading-spinner hidden [.htmx-request_&]:inline" />
                </button>
              </form>
            </li>
          );
        })}
      </ul>
      {props.selectedItem
        ? (() => {
          if (props.status === "chose") {
            return (
              <Modal open={true}>
                <div class="flex flex-col items-center justify-center p-6 bg-base-200 rounded-xl">
                  <h2 class="text-2xl font-bold text-center">
                    Ótima escolha! :)
                  </h2>
                  <p class="text-center mt-3">
                    1. Entre no site e comprar o produto.
                  </p>
                  <a
                    href={props.selectedItem.url}
                    target="_blank"
                    class="flex flex-col items-center mt-6"
                  >
                    <Image
                      src={props.selectedItem.image}
                      width={128}
                      height={128}
                    />
                    <span class="btn btn-primary w-full mt-3">Comprar</span>
                  </a>
                  <form
                    hx-post={useSection<Props>({
                      props: { ...props, status: "gifted" },
                      href: "?itemId=" + props.selectedItem.id,
                    })}
                    hx-swap="outerHTML"
                    hx-target="closest section"
                    hx-trigger="submit"
                    class="mt-6 flex flex-col items-center w-full"
                  >
                    <p class="mb-2">2. Deixe um recado</p>
                    <textarea
                      name="message"
                      class="textarea textarea-bordered w-full"
                    />
                    <button class="btn btn-secondary w-full mt-2" type="submit">
                      <span class="inline [.htmx-request_&]:hidden">
                        Enviar
                      </span>
                      <span class="loading loading-spinner hidden [.htmx-request_&]:inline" />
                    </button>
                  </form>
                </div>
              </Modal>
            );
          }

          if (props.status === "gifted") {
            return (
              <Modal open={true}>
                <div class="flex flex-col items-center justify-center p-6 bg-base-200 rounded-xl">
                  <h2 class="text-2xl font-bold text-center mb-3">
                    Muito obrigado pelo presente!
                  </h2>
                  <Image
                    src={props.selectedItem.image}
                    width={128}
                    height={128}
                  />
                  <span class="btn btn-primary w-full mt-3">
                    Presente confirmado!
                  </span>
                </div>
              </Modal>
            );
          }
        })()
        : null}
    </div>
  );
}
