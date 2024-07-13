interface ItemProps {
    name: string;
    price: number;
    image: string;
}

export function Item({ name, price, image }: ItemProps) {
    return (
        <div class="flex flex-col">
            <img
                src={image}
                alt="Imagem do produto"
                class="w-full h-auto"
            />
            <h3>{name}</h3>
            <span>{price}</span>
            <button class="bg-black text-white px-2 py-1 rounded cursor-pointer">
                Reservar
            </button>
        </div>
    );
}
