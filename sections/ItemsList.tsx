import { Item } from "site/components/Item/index.tsx";

export default function ItemsList() {
    return (
        <div class="flex px-12 py-8 flex flex-col">
            <h2 class="text-4xl font-bold">
                Itens
            </h2>
            <div class="flex gap-4 mt-4">
                <Item
                    image="https://via.placeholder.com/150/92c952"
                    name="Item 1"
                    price={25.00}
                />
                <Item
                    image="https://via.placeholder.com/150/92c952"
                    name="Item 1"
                    price={25.00}
                />
                <Item
                    image="https://via.placeholder.com/150/92c952"
                    name="Item 1"
                    price={25.00}
                />
            </div>
        </div>
    );
}
