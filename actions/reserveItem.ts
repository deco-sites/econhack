import { AppContext } from "site/apps/site.ts";

export interface Props {
    itemId: string;
    username: string;
}

export default async function action(
    props: Props,
    _req: Request,
    ctx: AppContext,
) {
    const { itemId, username } = props;
    await fetch("http://econhackapi.edurodrigues.dev/reservation-by-user", {
        method: "POST",
        body: JSON.stringify({
            itemId,
            username,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
}
