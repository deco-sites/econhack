import type { Item } from "site/loaders/itemList.ts";
import ReserveButton from "site/islands/reserveButton.tsx";
import { useSection } from "deco/hooks/useSection.ts";

export default function ItemsList({ items = [] }: { items: Item[] }) {
    return (
        <div class="flex px-12 py-8 flex flex-col">
            <h2 class="text-4xl font-bold">
                Itens
            </h2>
            <div class="flex gap-4 mt-4">
                {items.map((item) => {
                    const isReserved = item.reservedBy !== null;
                    return (
                        <div class="flex flex-col">
                            <img
                                src={item.image}
                                alt="Imagem do produto"
                                class="w-full h-auto"
                            />
                            <h3>{item.name}</h3>
                            <span>{item.price}</span>

                            <ReserveButton
                                disabled={isReserved}
                                itemId={item.id}
                            />
                            <a href={useSection({ props: {} })}>
                                Reservar denovo
                            </a>
                            {isReserved && <span>Já reservado</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
