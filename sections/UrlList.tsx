import { useSection } from "deco/hooks/useSection.ts";

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

export async function loader(_props: unknown, req: Request, _ctx: unknown) {
  if (req.headers.get("content-type") !== "application/x-www-form-urlencoded") {
    return {};
  }

  const form = await req.formData();
  const urls = form.get("urls");

  const productList = await Promise.all(
    urls?.toString().split("\n").map(async (str) => {
      const url = new URL(str.trim());

      const res = await fetch(
        url.origin + `/api/catalog_system/pub/products/search${url.pathname}`,
      ).then((r) => r.json() as Promise<Product[]>);

      if (!res?.length) {
        return;
      }

      const [product] = res;

      return {
        name: product.productName,
        price: product.items[0].sellers[0].commertialOffer.Price,
        image: product.items[0].images[0].imageUrl,
        url: url.href,
      };
    }) ?? [],
  );

  console.log({ productList });

  return {};
}

export default function UrlList() {
  return (
    <form
      class="flex flex-col"
      hx-post={useSection({})}
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
  );
}
