"use client";

import { Sidebar } from "@/components/Sidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { PointerTrail } from "@/components/PointerTrail";
import { useState } from "react";

export default function Home() {
  const [chatKey, setChatKey] = useState(0);

  const handleNewChat = () => {
    setChatKey(prev => prev + 1);
  };

  return (
    <main className="flex h-screen overflow-hidden relative">
      <PointerTrail />
      <Sidebar onNewChat={handleNewChat} />
      <ChatInterface key={chatKey} />
    </main>
  );
}
