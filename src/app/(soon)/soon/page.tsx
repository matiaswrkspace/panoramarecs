import SoonScene from "@/components/soon/SoonScene";
import SoonVideo from "@/components/soon/SoonVideo";
import { soonMode } from "@/site.config";

export default function Page() {
  return soonMode === "video" ? <SoonVideo /> : <SoonScene />;
}
