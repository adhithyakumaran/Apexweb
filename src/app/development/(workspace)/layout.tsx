import { getAccess } from "@/lib/development/supabase";
export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await getAccess();
  if (access.state === "configuration")
    return (
      <section className="hub-gate">
        <span className="hub-eyebrow">TESTBUDDY HUB</span>
        <h1>Connect your workspace</h1>
        <p>
          Add the Supabase project URL and public API key in the application
          environment, then apply the URL-access database setup script.
        </p>
        <p>No sign-in or passcode is required.</p>
      </section>
    );
  return (
    <>
      <div className="hub-account">
        <span>Shared workspace · Upload, download, and manage development</span>
      </div>
      {children}
    </>
  );
}
