import type { Item } from "site/loaders/itemList.ts";
import { useSection } from "deco/hooks/useSection.ts";
import { AppContext } from "site/apps/site.ts";
import Image from "apps/website/components/Image.tsx";

interface Props {
    itemId?: string;
    username?: string;
}

export async function loader(props: Props, req: Request, ctx: AppContext) {
    const { itemId, username } = props;
    if (itemId !== undefined || username !== undefined) {
        await ctx.invoke.site.actions.reserveItem({ itemId, username });
    }
    const items = await ctx.invoke("site/loaders/itemList.ts");
    return { items };
}

export default function ItemsList({ items = [] }: { items: Item[] }) {
    return (
        <div class="flex px-8 pt-6 flex-col justify-end items-center bg-pink-500 min-h-screen">
            <h1 class="text-5xl text-white font-bold">
                Lista de presentes
            </h1>
            <ul class="gap-3 mt-8 mx-auto grid grid-cols-4 w-max bg-white rounded-t-xl p-6">
                {items.map((item) => {
                    const isReserved = item.reservedBy !== undefined;
                    return (
                        <li class="relative flex flex-col w-48 p-3 rounded shadow-sm">
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
                                        props: {
                                            username: "Gabriel",
                                            itemId: item.id,
                                        },
                                    })}
                                    hx-swap="outerHTML"
                                    hx-target="closest section"
                                    hx-trigger="click"
                                    class={`bg-pink-500 text-white rounded p-2 mt-3 bg-pink text-center ${
                                        !isReserved
                                            ? "cursor-pointer"
                                            : "opacity-70 cursor-default"
                                    }`}
                                    disabled={isReserved}
                                >
                                    {isReserved ? "Reservado" : "Reservar"}
                                </button>
                            </form>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
