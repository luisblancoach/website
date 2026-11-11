import type { Metadata } from "next";
import PrismChat from "@/components/PrismChat";

export const metadata: Metadata = {
  title: "Ask Queen Raida",
  description: "Chat with Queen Raida, RaidGuild's AI CTO, about the Guild's public knowledge.",
  robots: { index: false, follow: false },
};

export default function ChatPage() {
  return <PrismChat />;
}
