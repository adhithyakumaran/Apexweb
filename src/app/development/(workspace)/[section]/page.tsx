import { notFound } from "next/navigation";
import { getHubData } from "@/lib/development/data";
import {
  BuildList,
  DocumentList,
  ProgressList,
  TestingList,
  TaskList,
} from "@/components/development/content";
const descriptions: Record<string, [string, string]> = {
  documents: ["Documents", "The shared knowledge behind every build."],
  builds: ["Builds", "Download a release. Know what changed. Start testing."],
  progress: [
    "Weekly progress",
    "Small updates. A clear picture of where we’re headed.",
  ],
  testing: ["Testing", "Your findings are the start of the next improvement."],
  tasks: ["Tasks", "From the first finding to a verified fix."],
};
export default async function Section({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  const { section } = await params;
  if (!Object.hasOwn(descriptions, section)) notFound();
  const data = await getHubData();
  const { filter = "all" } = await searchParams;
  return (
    <>
      <div className="hub-page-heading">
        <span className="hub-eyebrow">
          TESTBUDDY HUB / {section.toUpperCase()}
        </span>
        <h1>{descriptions[section][0]}</h1>
        <p className="hub-lead">{descriptions[section][1]}</p>
      </div>
      {section === "documents" && <DocumentList data={data} />}
      {section === "builds" && <BuildList data={data} />}
      {section === "progress" && <ProgressList data={data} />}
      {section === "testing" && <TestingList data={data} />}
      {section === "tasks" && (
        <TaskList
          data={data}
          filter={["all", "active"].includes(filter) ? filter : "all"}
        />
      )}
    </>
  );
}
