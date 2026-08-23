import { MapPin } from "lucide-react";
import { officeAddress } from "@/config/contact";

export function ContactMap() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="border-b border-border px-8 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:py-12">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-orange">
            Our office
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Visit us in Chennai
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We&apos;re based in Chennai and partner with teams across India and worldwide.
            Drop by for a working session or book a demo ahead of your visit.
          </p>

          <div className="mt-8 flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-foreground" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-semibold text-foreground">{officeAddress.name}</p>
              {officeAddress.lines.map((line) => (
                <p key={line} className="mt-1 text-sm text-muted-foreground">
                  {line}
                </p>
              ))}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-brand-orange hover:underline"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="relative min-h-75 bg-muted lg:min-h-105">
          <iframe
            title="Apex Node Technologies office location in Chennai"
            src={officeAddress.mapEmbedUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
