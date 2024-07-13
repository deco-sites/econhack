interface Props {
  /**
  * @description The description of name.
  */
  placeholderText?: string;
  buttonText?: string;
}

export default function Section({ placeholderText = "Digite aqui", buttonText = "Entrar" }: Props) {
  return (
    <div class="w-[100vw] h-[100vh] m-auto flex flex-col m-a justify-center content-center">
      <input placeholder={placeholderText} class="mb-4 w-[500px] h-[40px]"></input>
      <button class="cursor-pointer">{buttonText}</button> 
    </div>
  )
}