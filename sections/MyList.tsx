import { Item } from "site/loaders/itemList.ts";

export interface Props {
  itemList: Item[];
}

export default function ItemList(props: Props) {
  return (
    <ul class="gap-3 mt-8 mx-auto grid grid-cols-4 w-max">
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
          <button
            class="btn btn-primary mt-3"
            hx-post={useSection<typeof Section>({
              props: { ...props, idx },
            })}
            hx-trigger="click"
            hx-target="closest section"
            hx-swap="outerHTML"
            disabled={product.inList}
          >
            <span class="hidden loading loading-spinner loading-xs [.htmx-request_&]:inline " />
          </button>
          {product.reservedBy && (
            <button
              class="absolute top-0 right-0 p-1 bg-white rounded-full shadow-black"
              hx-post={useSection<typeof Section>({
                props: { ...props, idx },
              })}
              hx-trigger="click"
              hx-target="closest section"
              hx-swap="outerHTML"
            >
              <Icon id="Trash" width={20} height={20} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
