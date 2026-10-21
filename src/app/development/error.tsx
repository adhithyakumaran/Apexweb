"use client";
export default function HubError({ reset }: { reset: () => void }) {
  return (
    <section className="hub-gate">
      <h1>Couldn’t load the workspace</h1>
      <p>
        The data service may be unavailable or the database migration may still
        be pending. Your changes have not been discarded.
      </p>
      <button className="hub-button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
