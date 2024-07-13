import { Suspense } from "preact/compat";
import { useId } from "site/sdk/useId.ts";
import { useSignal } from "@preact/signals";
import { ComponentChildren } from "preact";
import { useEffect } from "preact/hooks";
import Icon from "site/components/ui/Icon.tsx";

export const Aside = (
  { title, onClose, children }: {
    title: string;
    onClose?: () => void;
    children: ComponentChildren;
  },
) => (
  <div class="bg-base-100 grid grid-rows-[auto_1fr] h-full divide-y max-w-[100vw]">
    <div class="flex justify-between items-center">
      <h1 class="px-4 py-3">
        <span class="font-medium text-2xl">{title}</span>
      </h1>
      {onClose && (
        <button aria-label="X" class="btn btn-ghost" onClick={onClose}>
          <Icon id="XMark" size={24} strokeWidth={2} />
        </button>
      )}
    </div>
    <Suspense
      fallback={
        <div class="w-screen flex items-center justify-center">
          <span class="loading loading-ring" />
        </div>
      }
    >
      {children}
    </Suspense>
  </div>
);

interface Props {
  onClose?: () => void;
  open?: boolean;
  class?: string;
  loading?: "eager" | "lazy";
  children: ComponentChildren;
  aside: ComponentChildren;
}

function Drawer(props: Props) {
  const {
    children,
    aside,
    open,
    onClose,
    class: _class = "",
    loading = "lazy",
  } = props;
  const lazy = useSignal(loading === "lazy" && !open);
  const id = useId();

  useEffect(() => {
    const handler = (e: KeyboardEvent) =>
      (e.key === "Escape" || e.keyCode === 27) && open && onClose?.();

    addEventListener("keydown", handler);

    return () => {
      removeEventListener("keydown", handler);
    };
  }, [open]);

  useEffect(() => {
    lazy.value = false;
  }, []);

  return (
    <div class={`drawer ${_class}`}>
      <input
        id={id}
        checked={open}
        type="checkbox"
        class="drawer-toggle"
        onChange={(e) => e.currentTarget.checked === false && onClose?.()}
        aria-label={open ? "open drawer" : "closed drawer"}
      />

      <div class="drawer-content">
        {children}
      </div>

      <aside class="drawer-side h-full z-50 overflow-hidden">
        <label for={id} class="drawer-overlay" />
        {!lazy.value && aside}
      </aside>
    </div>
  );
}

export default Drawer;
