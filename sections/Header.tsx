import { useSection } from "deco/hooks/useSection.ts";
import Modal from "site/components/ui/Modal.tsx";
import { Section } from "deco/blocks/section.ts";

export interface Props {
  openList?: boolean;
  itemList: Section;
}

export default function Section(props: Props) {
  return (
    <header>
      <button
        hx-get={useSection<typeof Section>({ props: { openList: true } })}
        hx-target="closest section"
        hx-swap="outerHTML"
      >
        OPEN
      </button>
      <Modal open={props.openList}>
        <h3>Sua lista</h3>
        <props.itemList.Component {...props.itemList.props} />
      </Modal>
    </header>
  );
}
