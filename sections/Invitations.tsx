import { Invitee } from "site/loaders/invitees.ts";
import { AppContext } from "site/apps/site.ts";
import CopyInviteeLink from "site/islands/CopyInviteeLink.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { useSection } from "deco/hooks/useSection.ts";

export interface Props {
  invitees: Invitee[];
}

export function loader(props: Props, req: Request, _ctx: AppContext) {
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
        <form>
          <input type="text" placeholder="Adicionar" />
        </form>
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
                    class="w-6 h-6 flex items-center justify-center"
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
      </div>
    </div>
  );
}
