import { AppContext } from "site/apps/site.ts";
import CopyInviteeLink from "site/islands/CopyInviteeLink.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { useSection } from "deco/hooks/useSection.ts";
import { InviteeAndGift } from "site/loaders/invitees-and-gifts.ts";
import Modal from "site/components/ui/Modal.tsx";
import Header from "site/sections/Header.tsx";
import Image from "apps/website/components/Image.tsx";
import { GiftIcon } from "site/components/ui/icons/Gift.tsx";

export interface Props {
  invitees: InviteeAndGift[];
  openList?: string;
}

export async function loader(props: Props, req: Request, ctx: AppContext) {
  if (req.method === "POST") {
    const username = await req.formData().then((f) =>
      f.get("username")?.toString()
    );

    if (!username) return props;

    await ctx.invoke.site.actions.createInvitee({ username });
    props.invitees = await ctx.invoke.site.loaders["invitees-and-gifts"]();

    return props;
  }

  if (req.method === "PATCH") {
    const file = await req.formData().then((f) => f.get("lista")) as
      | File
      | null;

    if (!file) return props;

    const text = await file.text();
    const invitees = text.split("\n").filter((c) => c.length).splice(1).map(
      (line) => {
        const [username, email] = line.split(";");
        return { username, email };
      },
    );

    for (const invitee of invitees) {
      await ctx.invoke.site.actions.createInvitee(invitee);
    }

    props.invitees = await ctx.invoke.site.loaders.invitees();
    return props;
  }

  if (req.method === "DELETE") {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return props;

    await ctx.invoke.site.actions.removeInvitee({
      id: new URL(req.url).searchParams.get("id")!,
    });

    props.invitees = props.invitees.filter((invitee) => invitee.user.id !== id);
    return props;
  }

  return props;
}

export default function InvitationsSection(props: Props) {
  return (
    <div class="bg-primary min-h-screen flex flex-col justify-end transition-colors">
      <h3 class="text-3xl font-extrabold uppercase text-center text-white mb-8">
        Convidados
      </h3>
      <div class="w-max pt-6 px-6 pb-8 rounded-t-xl mx-auto min-w-[60vw] min-h-[70vh] bg-white">
        <div class="flex flex-col">
          {props.invitees.map((invitee) => {
            return (
              <div class="h-14 border-b border-gray-200 flex items-center justify-between">
                <div class="flex gap-4">
                  <span class="font-bold flex">
                    {invitee.user.username}
                  </span>

                  {invitee.items.length > 0 && (
                    <button
                      class="cursor-pointer"
                      hx-swap="outerHTML"
                      hx-target="closest section"
                      hx-get={useSection<Props>({
                        props: { openList: invitee.user.id },
                      })}
                    >
                      <GiftIcon />
                    </button>
                  )}
                  <Modal open={props.openList === invitee.user.id}>
                    <div class="bg-white rounded p-4 relative max-h-[90vh] overflow-y-auto">
                      <button
                        class="absolute top-2 right-2"
                        hx-get={useSection<typeof Header>({
                          props: { openList: false },
                        })}
                        hx-target="closest section"
                        hx-swap="outerHTML"
                      >
                        <Icon
                          id="XMark"
                          width={24}
                          height={24}
                          strokeWidth={2}
                        />
                      </button>
                      <ul>
                        {invitee.items.map((item) => (
                          <li>
                            {item.image
                              ? (
                                <a href={item.url} target="_blank">
                                  <Image
                                    src={item.image ?? ""}
                                    width={248}
                                    height={248}
                                    class="mx-auto mb-3"
                                  />
                                </a>
                              )
                              : null}
                            <span class="text-ellipsis whitespace-nowrap text-left overflow-hidden text-xs">
                              {item.name}
                            </span>
                            <p>{item.message}</p>

                            <p class="font-bold text-sm">
                              {item.price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Modal>
                </div>
                <div class="flex items-center gap-3">
                  <CopyInviteeLink
                    userId={invitee.user.id}
                  />
                  <button
                    hx-target="closest section"
                    hx-swap="outerHTML"
                    hx-delete={useSection<Props>({
                      props,
                      href: "?id=" + invitee.user.id,
                    })}
                    class="w-6 h-6 flex items-center justify-center [.htmx-request_&]:disabled"
                  >
                    <Icon
                      id="Trash"
                      width={24}
                      height={24}
                      class="inline [.htmx-request_&]:hidden"
                    />
                    <span class="w-4 h-4 loading loading-spinner hidden [.htmx-request_&]:inline">
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <h3 class="font-extrabold text-center mt-8">
          Faltando alguém?
        </h3>
        <form
          hx-post={useSection({ props })}
          hx-target="closest section"
          hx-swap="outerHTML"
          class="flex flex-col items-center mt-3"
        >
          <p>Crie um convite para:</p>
          <div class="flex gap-3 mx-auto justify-center">
            <input
              type="text"
              placeholder="Nome"
              name="username"
              class="input input-bordered"
            />
            <button
              type="submit"
              class="btn btn-primary w-24 [.htmx-request_&]:disabled"
            >
              <span class="inline [.htmx-request_&]:hidden">
                Convidar
              </span>
              <span class="w-4 h-4 loading loading-spinner hidden [.htmx-request_&]:inline">
              </span>
            </button>
          </div>
        </form>
        <form
          class="flex flex-col items-center mt-3"
          hx-patch={useSection({ props })}
          hx-target="closest section"
          hx-swap="outerHTML"
          hx-trigger="submit"
          hx-encoding="multipart/form-data"
        >
          <p>Ou suba uma lista de convidados:</p>
          <div class="flex gap-3 mx-auto justify-center">
            <input type="file" class="input" name="lista" />
            <button class="btn btn-primary w-24">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
