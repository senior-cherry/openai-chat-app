import Sidebar from "@/app/_components/Sidebar";

export default function Home() {
  return (
    <div className="flex h-screen bg-[#121212] text-[#eaeaea]">
      <Sidebar />
      <div className="flex-1 p-4">
        <p>Select a chat to start messaging</p>
      </div>
    </div>
  );
}
