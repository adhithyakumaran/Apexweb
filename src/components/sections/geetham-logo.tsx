import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

export function GeethamLogo() {
  return (
    <div className="flex flex-col items-center justify-center leading-none">
      <span
        className={`${pacifico.className} text-[1.85rem] text-success drop-shadow-sm sm:text-[2.1rem]`}
      >
        Geetham
      </span>
      <span className="mt-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-success/70">
        Enterprises
      </span>
    </div>
  );
}
