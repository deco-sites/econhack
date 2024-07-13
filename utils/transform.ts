import { Item } from "site/loaders/itemList.ts";
import { LegacyProduct, Product } from "apps/vtex/utils/types.ts";

export const toItem = <P extends LegacyProduct | Product>(
  product: P,
  sku: P["items"][number],
): Item => {
  return {
    id: product.productId,
    name: product.productName,
    price: sku.sellers[0].commertialOffer.Price,
    image: sku.imageUrl ?? sku.images[0].imageUrl,
    url: product.link,
  };
};
