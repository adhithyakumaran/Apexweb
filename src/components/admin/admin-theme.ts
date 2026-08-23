/** Enterprise dark CMS palette (reference-inspired). Logo keeps brand orange chevron. */
export const adminTheme = {
  sidebar: "#121316",
  background: "#1A1B1E",
  card: "#2C2D33",
  cardHover: "#32333a",
  border: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.1)",
  text: "#FFFFFF",
  muted: "#9CA3AF",
  active: "#3B82F6",
  activeHover: "#2563EB",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  input: "#1e1f24",
} as const;

export const adminClasses = {
  page: "min-h-screen bg-[#1A1B1E] text-white",
  sidebar: "bg-[#121316] border-white/[0.06]",
  card: "rounded-xl border border-white/[0.06] bg-[#2C2D33]",
  cardHeader: "border-b border-white/[0.06]",
  muted: "text-[#9CA3AF]",
  heading: "text-white",
  input:
    "h-10 w-full rounded-lg border border-white/[0.08] bg-[#1e1f24] px-3 text-sm text-white outline-none transition-colors placeholder:text-[#6b7280] focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/20",
  navActive: "bg-[#3B82F6] text-white shadow-sm",
  navIdle: "text-[#9CA3AF] hover:bg-white/[0.04] hover:text-white",
  primaryBtn:
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2563EB]",
  tableHead: "border-b border-white/[0.06] bg-[#25262c] text-[0.68rem] uppercase tracking-[0.14em] text-[#9CA3AF]",
  tableRow: "divide-white/[0.06] hover:bg-white/[0.03]",
} as const;
