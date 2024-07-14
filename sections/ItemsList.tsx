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
        <div class="flex md:px-8 md:pt-6 pt-1 flex-col justify-end items-center bg-primary min-h-screen w-full">
            <img
                src="https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/11581/55d28154-9738-40af-93d5-a4d2c53abc81"
                alt="Uma flor em estilo minimalista"
                class="fixed w-80 h-auto left-0 top-[35%]"
            />
            <img
                src="https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/11581/55d28154-9738-40af-93d5-a4d2c53abc81"
                alt="Uma flor em estilo minimalista"
                class="fixed w-80 h-auto right-0 top-[55%] rotate-180"
            />
            <h1 class="md:text-5xl text-2xl text-white font-bold text-center">
                Lista de presentes
            </h1>
            <ul class="gap-3 md:mt-8 max-w-[900px] grid md:grid-cols-4 grid-cols-2 bg-base-200 rounded-t-xl md:p-6 p-2">
                {items.map((item) => {
                    const isReserved = item.reservedBy !== undefined;
                    return (
                        <li class="relative flex flex-col flex-1 p-3 rounded shadow-sm">
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
                                    class={`btn btn-primary mt-3 text-center w-full ${
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
