import type { Item } from "site/loaders/itemList.ts";
import { useSection } from "deco/hooks/useSection.ts";
import { AppContext } from "site/apps/site.ts";
import Image from "apps/website/components/Image.tsx";

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
            <ul class="gap-3 mt-8 mx-auto grid grid-cols-4 w-max">
                {items.map((item) => {
                    const isReserved = item.reservedBy !== undefined;
                    return (
                        <li class="relative flex flex-col w-48 p-3 border border-gray-200 rounded">
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

                            <a
                                href={useSection<Props>({
                                    props: {
                                        username: "Gabriel",
                                        itemId: item.id,
                                    },
                                })}
                                hx-swap="outerHTML"
                                class={`btn btn-primary mt-3 ${
                                    !isReserved
                                        ? "cursor-pointer"
                                        : "opacity-70"
                                }`}
                                disabled={isReserved}
                            >
                                {isReserved ? "Reservado" : "Reservar"}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
