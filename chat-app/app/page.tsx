import Sidebar from "@/app/_components/Sidebar";
import React from "react";
import Chat from "@/app/_components/Chat";

interface HomeProps {
    searchParams: {
        chatId?: string
    }
}

const Home: React.FC<HomeProps> = ({searchParams}) => {
    const chatId = searchParams.chatId;
  return (
    <div className="flex h-screen bg-[#121212] text-[#eaeaea]">
      <Sidebar />
      <div className="flex-1 p-4">
          {
              chatId ? (
                  <Chat chatId={chatId} />
              ) : (
                  <p>Select a chat to start messaging</p>
              )
          }
      </div>
    </div>
  );
}

export default Home;