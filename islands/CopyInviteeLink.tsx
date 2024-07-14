interface Props {
    userId: string;
}

export default function CopyInviteeLink({ userId }: Props) {
    async function handleClicked() {
        const currentUrl = window.location.host;
        const targetUrl = `${currentUrl}/itens?user=${userId}`;
        await navigator.clipboard.writeText(targetUrl);
    }
    return (
        <button
            onClick={handleClicked}
            class="btn btn-secondary cursor-pointer py-1 px-3 z-20"
        >
            Copiar link
        </button>
    );
}
