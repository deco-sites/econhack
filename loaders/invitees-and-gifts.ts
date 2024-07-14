import { Request } from "std/http/mod.ts";
import { Invitee } from "site/loaders/invitees.ts";
import { Item } from "site/loaders/itemList.ts";
import { AppContext } from "site/apps/site.ts";

export interface InviteeAndGift {
    user: Invitee;
    items: Item[];
}

export default async function loader(
    _props: unknown,
    _req: Request,
    _ctx: AppContext,
): Promise<InviteeAndGift[]> {
    const response = await fetch(
        "http://econhackapi.edurodrigues.dev/users-and-items",
    );
    const inviteesAndGifts: InviteeAndGift[] = await response.json();
    return inviteesAndGifts;
}
