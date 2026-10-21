import type { ReactNode } from "react";

export function HubTheme({ children }: { children: ReactNode }) {
  return (
    <div className="hub" data-theme="light">
      {children}
    </div>
  );
}
