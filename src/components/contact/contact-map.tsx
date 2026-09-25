import { MapPin, Navigation } from "lucide-react";
import { officeAddress } from "@/config/contact";

export function ContactMap() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="grid lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <div className="border-b border-border/70 bg-surface/40 px-8 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/25 bg-brand-orange/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-orange">
            <MapPin className="size-3.5" />
            Chennai HQ
          </div>

          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Visit us in Chennai
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Drop by for a working session or book a demo ahead of your visit. We&apos;re in Tidel
            Park — one of the city&apos;s leading tech hubs.
          </p>

          <div className="mt-8 rounded-2xl border border-border/70 bg-background/80 p-5">
            <p className="text-sm font-semibold text-foreground">{officeAddress.name}</p>
            {officeAddress.lines.map((line) => (
              <p key={line} className="mt-1.5 text-sm text-muted-foreground">
                {line}
              </p>
            ))}
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            <Navigation className="size-4" />
            Get directions
          </a>
        </div>

        <div className="relative min-h-80 bg-muted lg:min-h-112">
          <iframe
            title="Apex Node Technologies office location in Chennai"
            src={officeAddress.mapEmbedUrl}
            className="absolute inset-0 h-full w-full border-0 grayscale-[20%] contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-foreground/25 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 rounded-2xl border border-white/20 bg-foreground/85 px-4 py-3 text-background shadow-xl backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">
              Apex Node
            </p>
            <p className="mt-1 text-sm font-medium">Tidel Park, Chennai</p>
          </div>
        </div>
      </div>
    </div>
  );
}
