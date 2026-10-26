import VentureShell from "@/components/venture/shell/VentureShell";
import { reviewFlagsEnabled } from "@/lib/narrative/types";

export default function VentureLayout({ children }: { children: React.ReactNode }) {
  return <VentureShell reviewFlags={reviewFlagsEnabled()}>{children}</VentureShell>;
}
