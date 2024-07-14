import { Invitee } from "site/loaders/invitees.ts";
import { AppContext } from "site/apps/site.ts";
import CopyInviteeLink from "site/islands/CopyInviteeLink.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { useSection } from "deco/hooks/useSection.ts";

export interface Props {
  invitees: Invitee[];
}

export async function loader(props: Props, req: Request, ctx: AppContext) {
  console.log(req.method);
  if (req.method === "POST") {
    const username = await req.formData().then((f) =>
      f.get("username")?.toString()
    );

    console.log({ username });

    if (!username) return props;

    const newUser = await ctx.invoke.site.actions.createInvitee({ username });
    console.log({ newUser });
    props.invitees.push(newUser);
    return props;
  }

  if (req.method === "DELETE") {
    // TODO: Implement delete invitee
    return props;
  }

  return props;
}

export default function Section(props: Props) {
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
                <span class="font-bold w-[20%] flex">
                  {invitee.username}
                </span>
                <div class="flex items-center gap-3">
                  <CopyInviteeLink
                    userId={invitee.id}
                  />
                  <button
                    hx-target="closest section"
                    hx-swap="outerHTML"
                    hx-delete={useSection<Props>({
                      props,
                      href: "?id=" + invitee.id,
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
          class="flex gap-3 mx-auto justify-center mt-3"
        >
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
            <span class="inline [.htmx-request_&]:hidden">Convidar</span>
            <span class="w-4 h-4 loading loading-spinner hidden [.htmx-request_&]:inline">
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
