/** Vercel / GitHub developer workspace palette for CMS. */
export const adminTheme = {
  bg: "#000000",
  sidebar: "#000000",
  surface: "#0a0a0a",
  elevated: "#111111",
  border: "#333333",
  borderSubtle: "#1f1f1f",
  text: "#ededed",
  textSecondary: "#a1a1a1",
  textMuted: "#666666",
  accent: "#0070f3",
  accentHover: "#0060df",
  success: "#50e3c2",
  warning: "#f5a623",
  danger: "#e00",
} as const;

export const adminClasses = {
  page: "min-h-screen bg-black text-[#ededed]",
  sidebar: "bg-black border-[#333]",
  border: "border border-[#333]",
  card: "rounded-md border border-[#333] bg-black",
  muted: "text-[#a1a1a1]",
  heading: "text-[#ededed]",
  input:
    "h-8 w-full rounded border border-[#333] bg-black px-2.5 text-[13px] text-[#ededed] outline-none transition-colors placeholder:text-[#666] focus:border-[#666] focus:ring-1 focus:ring-[#333]",
  navActive: "bg-[#1a1a1a] text-white",
  navIdle: "text-[#a1a1a1] hover:bg-[#111] hover:text-white",
  primaryBtn:
    "inline-flex h-8 items-center justify-center gap-1.5 rounded border border-[#ededed] bg-[#ededed] px-3 text-[13px] font-medium text-black transition-colors hover:bg-white",
  secondaryBtn:
    "inline-flex h-8 items-center justify-center gap-1.5 rounded border border-[#333] bg-black px-3 text-[13px] font-medium text-[#ededed] transition-colors hover:border-[#666] hover:bg-[#111]",
  tableHead:
    "border-b border-[#333] text-[11px] font-medium uppercase tracking-wide text-[#666]",
  tableRow: "border-b border-[#333] transition-colors hover:bg-[#0a0a0a] last:border-b-0",
  /** Vercel-style aligned data grid columns */
  dataGrid:
    "grid w-full grid-cols-[minmax(0,1fr)_6.5rem_8.5rem_minmax(8rem,11rem)_4.5rem_6.5rem] items-center gap-x-4",
  dataGridWide:
    "grid w-full grid-cols-[minmax(0,1fr)_6.5rem_8.5rem_minmax(10rem,14rem)_5rem_7rem] items-center gap-x-4",
} as const;
