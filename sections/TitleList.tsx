import Image from "apps/website/components/Image.tsx";
import { Color, ImageWidget } from "apps/admin/widgets.ts";

interface Props {
  /**
  * @description The description of name.
  */
  image?: ImageWidget;
  title?: string;
  colorTitle?: Color;
  description?: string;
  colorDescription?: Color;
}

export default function Section({ image = 'null', title = 'Titulo', colorTitle, description = 'Lorem ipsum', colorDescription }: Props) {
  return (
    <div class="flex w-[800px] m-auto pt-8">
      <div class="w-[120px] h-[120px]">
        <Image src={image} alt={title}></Image>
      </div>
      <div className="ml-3">
        <h3 class="font-bold  text-2xl" style={{color: colorTitle}}>{title}</h3>
        <p class="mt-2 ml-2 text-xs" style={{color: colorDescription}}>{description}</p>
      </div>
    </div>
  );
}