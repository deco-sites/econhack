import { useSection } from "deco/hooks/useSection.ts";
import Modal from "site/components/ui/Modal.tsx";
import { Section } from "deco/blocks/section.ts";
import Icon from "site/components/ui/Icon.tsx";

export interface Props {
  openList?: boolean;
  itemList: Section;
}

export default function Section(props: Props) {
  return (
    <header>
      <button
        class="fixed bottom-3 right-3 btn btn-accent"
        hx-get={useSection<typeof Section>({ props: { openList: true } })}
        hx-target="closest section"
        hx-swap="outerHTML"
      >
        Sua lista
      </button>
      <Modal open={props.openList}>
        <div class="bg-white rounded p-4 relative">
          <button
            class="absolute top-2 right-2"
            hx-get={useSection<typeof Section>({ props: { openList: false } })}
            hx-target="closest section"
            hx-swap="outerHTML"
          >
            <Icon id="XMark" width={24} height={24} strokeWidth={2} />
          </button>
          <h2 class="text-lg font-bold text-center mb-2">Sua lista</h2>
          <props.itemList.Component {...props.itemList.props} />
        </div>
      </Modal>
    </header>
  );
}
