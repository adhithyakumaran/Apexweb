import { getHubData } from "@/lib/development/data";
import { HomeContent } from "@/components/development/content";
export default async function HubHome() {
  return <HomeContent data={await getHubData()} />;
}
