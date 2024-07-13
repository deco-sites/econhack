import { h } from "preact";

interface buttonTextInterface {
    placeholderText: string;
    buttonText: string;
}

interface SubmitEvent extends Event {
    target: HTMLFormElement;
  }

export default function Button ({ placeholderText, buttonText }: buttonTextInterface) {

    const login = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        document.cookie = `username=${formData.get('user')}; path=/;`;
        window.location.reload();
    } 

    return (
        <>
        <form class="w-[500px] h-[500px] top-1/2 left-1/2 bg-red transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center absolute" onSubmit={(e) => login(e)}>
            <input id="user" name="user" autoFocus placeholder={placeholderText} class="outline-none p-5 mb-4 rounded w-[500px h-[40px] text-black border-black border-[1px] border-solid"></input>
            <button class="cursor-pointer bg-black text-[#fff] p-2 rounded">{buttonText}</button>
        </form>
        </>
    )
}