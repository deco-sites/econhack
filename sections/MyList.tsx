import { Item } from "site/loaders/itemList.ts";
import Image from "apps/website/components/Image.tsx";
import { useSection } from "deco/hooks/useSection.ts";
import Icon from "site/components/ui/Icon.tsx";
import { SectionProps } from "deco/mod.ts";

export interface Props {
  itemList: Item[];
}

export async function loader(props: Props, req: Request, ctx: unknown) {
  console.log({ req });

  if (req.method === "POST") {
    const form = await req.formData();
    console.log(form.keys());
  }

  return props;
}

export default function Section(props: SectionProps<typeof loader>) {
  return (
    <ul class="gap-3 mx-auto grid grid-cols-4 w-max">
      {props.itemList?.map((product, idx) => (
        <li class="relative flex flex-col w-48 p-3 border border-gray-200 rounded">
          {product.image
            ? (
              <a href={product.url} target="_blank">
                <Image
                  src={product.image ?? ""}
                  width={248}
                  height={248}
                  class="mx-auto mb-3"
                />
              </a>
            )
            : null}
          <span class="text-ellipsis whitespace-nowrap text-left overflow-hidden text-xs">
            {product.name}
          </span>
          <p class="font-bold text-sm">
            {product.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
          <form
            hx-post={useSection<typeof Section>({
              props,
            })}
            hx-trigger="click"
            hx-target="closest section"
            hx-swap="outerHTML"
          >
            <input type="hidden" name="index" value={idx} />
            <button class="absolute top-0 right-0 p-1 bg-white rounded-full shadow-black">
              <span>
                <Icon id="Trash" width={20} height={20} />
              </span>
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
