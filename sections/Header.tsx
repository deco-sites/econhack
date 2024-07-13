import { useSection } from "deco/hooks/useSection.ts";
import Modal from "site/components/ui/Modal.tsx";
import { Item } from "site/loaders/itemList.ts";
import { SectionProps } from "deco/types.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { Section } from "deco/blocks/section.ts";

export interface Props {
  openList?: boolean;
  ItemList: Section;
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
        <ItemList itemList={props.itemList} />
      </Modal>
    </header>
  );
}
