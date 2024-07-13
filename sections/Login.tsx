import Button  from "../islands/Button.tsx";

interface Props {
  /**
  * @description The description of name.
  */
  placeholderText?: string;
  buttonText?: string;
}

export default function Section({ placeholderText = "Digite aqui", buttonText = "Entrar" }: Props) {
  return (
      <Button placeholderText={placeholderText} buttonText={buttonText}></Button>
  );
}