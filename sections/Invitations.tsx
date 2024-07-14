import { AppContext } from "site/apps/site.ts";

interface Props {
  /**
  * @description The description of name.
  */
  users: Array<User>;
}

interface User {
  id: string;
  email: string;
  username: number;
}

export async function loader(props: Props, req: Request, ctx: unknown) {

  if (req.method === "GET") {

    const users = await fetch(
      `http://econhackapi.edurodrigues.dev/user`,
    )

    props.users = await users.json()

    return props
  }
}


export default function Section({ users } : Props) {
  return (
    <div class="bg-primary min-h-screen flex flex-col justify-end transition-colors">
      <h3 class="text-3xl font-extrabold uppercase text-center text-white mb-8">Convidados</h3>
      <div class="w-max pt-6 px-6 pb-8 rounded-t-xl mx-auto min-w-[60vw] min-h-[70vh] bg-white">
        <form>
          <input type="text" placeholder='Adicionar' />
        </form>
        {users.map((e)=>{
          return (
          <div class="h-14 p-4 border-b border-gray-200 flex">
            <span class="font-bold w-[20%] flex">{e.username}</span>
          </div>)
        })}
      </div>
  </div>)
}