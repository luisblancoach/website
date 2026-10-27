import VentureShell from "@/components/venture/shell/VentureShell";
import { clientsNav } from "@/lib/narrative/clients";
import { communityNav } from "@/lib/narrative/community";
import { forAudience } from "@/lib/narrative/public";
import { reviewFlagsEnabled } from "@/lib/narrative/types";

export default function VentureLayout({ children }: { children: React.ReactNode }) {
  const nav = forAudience({ "/clients": clientsNav, "/community": communityNav });
  return <VentureShell reviewFlags={reviewFlagsEnabled()} nav={nav}>{children}</VentureShell>;
}
