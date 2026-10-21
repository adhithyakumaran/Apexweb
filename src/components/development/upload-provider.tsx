"use client";
import { createContext, useContext, type ReactNode } from "react";
type UploadConfiguration = { url: string; key: string } | null;
const UploadContext = createContext<UploadConfiguration>(null);
export function UploadProvider({
  configuration,
  children,
}: {
  configuration: UploadConfiguration;
  children: ReactNode;
}) {
  return (
    <UploadContext.Provider value={configuration}>
      {children}
    </UploadContext.Provider>
  );
}
export function useUploadConfiguration() {
  return useContext(UploadContext);
}
