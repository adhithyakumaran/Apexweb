import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <section className="hub-loading" role="status" aria-live="polite">
      <LoaderCircle size={20} className="hub-spin" aria-hidden="true" />
      <div>
        <strong>Loading your workspace</strong>
        <p>Fetching releases, reports, and progress…</p>
      </div>
    </section>
  );
}
