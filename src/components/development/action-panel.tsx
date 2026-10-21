"use client";
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";
import { Plus, X } from "lucide-react";
const CloseContext = createContext<null | (() => void)>(null);
export function useCloseActionPanel() {
  return useContext(CloseContext);
}
export function ActionPanel({
  title,
  children,
  subtle = false,
  initialOpen = false,
}: {
  title: string;
  children: ReactNode;
  subtle?: boolean;
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button
        type="button"
        className={`hub-button ${subtle ? "secondary" : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? `Close ${title.toLowerCase()} form` : title}
      >
        {open ? (
          <X size={15} aria-hidden="true" />
        ) : (
          <Plus size={15} aria-hidden="true" />
        )}
        {open ? "Close" : title}
      </button>
      {open && (
        <div className="hub-action-panel" id={id}>
          <CloseContext.Provider value={close}>
            {children}
          </CloseContext.Provider>
        </div>
      )}
    </>
  );
}
