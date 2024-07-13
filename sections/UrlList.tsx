import { useSection } from "deco/hooks/useSection.ts";
import { SectionProps } from "deco/types.ts";
import Image from "apps/website/components/Image.tsx";
import Modal from "site/components/ui/Modal.tsx";

type Product = {
  productName: string;
  items: {
    images: {
      imageUrl: string;
    }[];
    sellers: {
      commertialOffer: {
        Price: number;
      };
    }[];
  }[];
};

export interface Props {
  productList?: {
    name: string;
    price: number;
    image: string;
    url: string;
  }[];
  unrecognized: string[];
}

export async function loader(props: Props, req: Request, _ctx: unknown) {
  if (req.headers.get("content-type") !== "application/x-www-form-urlencoded") {
    return props;
  }

  props.unrecognized = props.unrecognized ?? [];

  const form = await req.formData();
  const urls = form.get("urls");

  if (!urls) return props;

  const productList = await Promise.all(
    urls.toString().split("\n").map(async (str) => {
      const url = new URL(str.trim());

      const res = await fetch(
        url.origin + `/api/catalog_system/pub/products/search${url.pathname}`,
      ).then((r) => r.json() as Promise<Product[]>).catch(() => {
        props.unrecognized.push(url.href);
        return [];
      });

      if (!res.length) return;

      const [product] = res;

      return {
        name: product.productName,
        price: product.items[0].sellers[0].commertialOffer.Price,
        image: product.items[0].images[0].imageUrl,
        url: url.href,
      };
    }) ?? [],
  );

  return { ...props, productList: productList.filter(Boolean) } as Props;
}

export default function UrlList(props: SectionProps<typeof loader>) {
  return (
    <div>
      <form
        class="flex flex-col"
        hx-post={useSection({ props })}
        hx-trigger="submit"
        hx-target="closest section"
        hx-swap="outerHTML"
      >
        <textarea
          class="textarea textarea-bordered"
          name="urls"
          rows={10}
          cols={50}
        />
        <button type="submit" class="btn btn-primary mt-2">Submit</button>
      </form>
      {props.productList?.length
        ? (
          <ul>
            {props.productList.map((product) => (
              <li class="flex items-center space-x-2">
                <Image
                  src={product.image}
                  width={248}
                  height={248}
                />
                <div>
                  <a href={product.url} class="font-bold" target="_blank">
                    {product.name}
                  </a>
                  <div>
                    {product.price.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )
        : null}
      {props.unrecognized?.length
        ? (
          <Modal open={true} class="bg-base">
            <form>
              <h2>Nao foi possivel extrair os dados</h2>
              <a href={props.unrecognized[0]} target="_blank" class="underline">
                {new URL(props.unrecognized[0]).host}...
              </a>
              <div class="flex gap-2">
                <input name="image" type="text" placeholder="Imagem" />
                <input name="name" type="text" placeholder="Nome" />
                <input name="price" type="text" placeholder="Preço" />
              </div>
              <button type="submit">Salvar</button>
              <button type="button">Pular</button>
            </form>
          </Modal>
        )
        : null}
    </div>
  );
}
