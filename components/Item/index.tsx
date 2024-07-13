import ReserveButton from "site/islands/reserveButton.tsx";

interface ItemProps {
    name: string;
    price: number;
    image: string;
    isReserved: boolean;
    id: string;
}

export function Item({ name, price, image, isReserved, id }: ItemProps) {
    return (
        <div class="flex flex-col">
            <img
                src={image}
                alt="Imagem do produto"
                class="w-full h-auto"
            />
            <h3>{name}</h3>
            <span>{price}</span>

            <ReserveButton
                disabled={isReserved}
                itemId={id}
            />
            {isReserved && <span>Já reservado</span>}
        </div>
    );
}
