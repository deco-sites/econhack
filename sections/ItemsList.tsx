import { Item } from "site/components/Item/index.tsx";
import { DatabaseItem } from "site/loaders/getItems.ts";

export default function ItemsList({ items = [] }: { items: DatabaseItem[] }) {
    return (
        <div class="flex px-12 py-8 flex flex-col">
            <h2 class="text-4xl font-bold">
                Itens
            </h2>
            <div class="flex gap-4 mt-4">
                {items.map((item) => (
                    <Item
                        image={item.image}
                        name={item.name}
                        price={item.price}
                        key={item.id}
                        id={item.id}
                        isReserved={item.reservedBy !== null &&
                            item.reservedBy !== undefined}
                    />
                ))}
            </div>
        </div>
    );
}
