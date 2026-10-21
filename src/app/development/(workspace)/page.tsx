import { getHubData } from "@/lib/development/data";
import { ReleasesContent } from "@/components/development/content";
export default async function Releases() {
  return <ReleasesContent data={await getHubData()} />;
}
