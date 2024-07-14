import Icon from "site/components/ui/Icon.tsx";

interface Props {
  userId: string;
}

export default function CopyInviteeLink({ userId }: Props) {
  async function handleClicked() {
    const currentUrl = window.location.host;
    const targetUrl = `${currentUrl}/itens?user=${userId}`;
    await navigator.clipboard.writeText(targetUrl);
    globalThis.alert("Link copiado para a área de transferência!");
  }

  return (
    <button
      onClick={handleClicked}
    >
      <Icon id="Copy" width={24} height={24} />
    </button>
  );
}
