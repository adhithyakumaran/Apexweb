import { getHubData } from "@/lib/development/data";
import { WorkspaceContent } from "@/components/development/content";
export default async function Workspace() {
  return <WorkspaceContent data={await getHubData()} />;
}
