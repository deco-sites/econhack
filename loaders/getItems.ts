import { AppContext } from "site/apps/site.ts";

export interface DatabaseItem {
    id: string;
    name: string;
    price: number;
    image: string;
    url: string;
    reservedBy: string | null;
}

export default async function getItems(
    _props: unknown,
    _req: Request,
    ctx: AppContext,
): Promise<DatabaseItem[]> {
    const response = await fetch("http://localhost:3000/items");
    const databaseItems: DatabaseItem[] = await response.json();

    return databaseItems;
}
