import VentureShell from "@/components/venture/shell/VentureShell";

export default function VentureLayout({ children }: { children: React.ReactNode }) {
  return <VentureShell>{children}</VentureShell>;
}
