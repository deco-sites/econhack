import type { Item } from "site/loaders/itemList.ts";
import { useSection } from "deco/hooks/useSection.ts";
import { AppContext } from "site/apps/site.ts";

interface Props {
    itemId?: string;
    username?: string;
}

export async function loader(props: Props, req: Request, ctx: AppContext) {
    const items = await ctx.invoke("site/loaders/itemList.ts");

    const { itemId, username } = props;
    if (itemId !== undefined || username !== undefined) {
        await ctx.invoke.site.actions.reserveItem({ itemId, username });
    }
    return { items };
}

export default function ItemsList({ items = [] }: { items: Item[] }) {
    return (
        <div class="flex px-12 py-8 flex flex-col">
            <h2 class="text-4xl font-bold">
                Itens
            </h2>
            <div class="flex gap-4 mt-4">
                {items.map((item) => {
                    const isReserved = item.reservedBy !== undefined;
                    return (
                        <div class="flex flex-col">
                            <img
                                src={item.image}
                                alt="Imagem do produto"
                                class="w-full h-auto"
                            />
                            <h3>{item.name}</h3>
                            <span>{item.price}</span>

                            <a
                                href={useSection<Props>({
                                    props: {
                                        username: "Gabriel",
                                        itemId: item.id,
                                    },
                                })}
                                hx-swap="outerHTML"
                                class={`bg-black text-white px-2 py-1 rounded ${
                                    !isReserved
                                        ? "cursor-pointer"
                                        : "opacity-70"
                                }`}
                            >
                                Reservar
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
