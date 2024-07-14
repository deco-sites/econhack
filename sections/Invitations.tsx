import { Invitee } from "site/loaders/invitees.ts";
import CopyInviteeLink from "site/islands/CopyInviteeLink.tsx";

export interface Props {
  invitees: Invitee[];
}

export default function Section({ invitees }: Props) {
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
          {invitees.map((invitee) => {
            return (
              <div class="h-14 border-b border-gray-200 flex items-center justify-between">
                <span class="font-bold w-[20%] flex">
                  {invitee.username}
                </span>
                <CopyInviteeLink
                  userId={invitee.id}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
