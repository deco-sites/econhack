import { useSection } from "deco/hooks/useSection.ts";
import Modal from "site/components/ui/Modal.tsx";
import { Section } from "deco/blocks/section.ts";
import Icon from "site/components/ui/Icon.tsx";
import { LetterIcon } from "site/components/ui/icons/Letter.tsx";
import { MagnifyingGlassIcon } from "site/components/ui/icons/MagnifyingGlass.tsx";

export interface Props {
  openList?: boolean;
  itemList: Section;
}

export default function Header(props: Props) {
  return (
    <>
      <header class="w-full h-16 absolute top-0 flex items-center justify-end px-8">
        <div class="flex gap-4">
          <a href="/convidados">
            <LetterIcon className="fill-base-200" />
          </a>
          <a href="/minha-lista">
            <MagnifyingGlassIcon className="fill-base-200" />
          </a>
        </div>
      </header>
      <button
        class="fixed bottom-3 right-3 btn btn-accent"
        hx-get={useSection<typeof Header>({ props: { openList: true } })}
        hx-target="closest section"
        hx-swap="outerHTML"
      >
        Sua lista
      </button>
      <Modal open={props.openList}>
        <div class="bg-white rounded p-4 relative max-h-[90vh] overflow-y-auto">
          <button
            class="absolute top-2 right-2"
            hx-get={useSection<typeof Header>({ props: { openList: false } })}
            hx-target="closest section"
            hx-swap="outerHTML"
          >
            <Icon id="XMark" width={24} height={24} strokeWidth={2} />
          </button>
          <h2 class="text-lg font-bold text-center mb-2">Sua lista</h2>
          <props.itemList.Component {...props.itemList.props} />
        </div>
      </Modal>
    </>
  );
}
