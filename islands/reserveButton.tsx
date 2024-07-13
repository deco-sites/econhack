interface ReserveButtonProps {
    disabled?: boolean;
    itemId: string;
}

export default function ReserveButton(
    { disabled, itemId }: ReserveButtonProps,
) {
    async function handleClicked() {
        const routeParams = window.location.href.split("?")[1];
        const usernameParam = routeParams.split("=")[1];

        await fetch(
            "http://localhost:3000/reservation-by-user",
            {
                method: "POST",
                body: JSON.stringify({
                    username: usernameParam,
                    itemId,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
    return (
        <button
            class={`bg-black text-white px-2 py-1 rounded ${
                !disabled ? "cursor-pointer" : "opacity-70"
            }`}
            disabled={disabled}
            onClick={handleClicked}
        >
            Reservar
        </button>
    );
}
