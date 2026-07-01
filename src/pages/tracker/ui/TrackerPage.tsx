import type { ComponentProps } from "react";
import { TrackerDashboard } from "@features/tracker-management";

type TrackerPageProps = ComponentProps<typeof TrackerDashboard>;

export function TrackerPage(props: TrackerPageProps) {
  return <TrackerDashboard {...props} />;
}
