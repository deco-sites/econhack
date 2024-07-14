import { Invitee } from "site/loaders/invitees.ts";

interface Props {
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
        {invitees.map((invitee) => {
          return (
            <div class="h-14 p-4 border-b border-gray-200 flex">
              <span class="font-bold w-[20%] flex">{invitee.username}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

