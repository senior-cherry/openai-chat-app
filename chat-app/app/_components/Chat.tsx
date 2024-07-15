import React from "react";
import { getAuth } from "@kobbleio/next/server";
import {supabaseClient} from "@/app/supabase/client";

interface ChatProps {
    chatId: string;
}

const Chat: React.FC<ChatProps> = async ({chatId}) => {
    const {session} = await getAuth();
    const userId = session?.user.id;
    const {data: messages} = await supabaseClient
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', {ascending: true})
        .filter('user_id', 'eq', userId)

    return (
        <div className="flex flex-col h-full p-4 bg-[#1e1e1e] text-[#eaeaea]">
            <div className="flex-1 overflow-y-auto">
                {
                    messages?.map((message) => (
                        <div key={message.id} className={`p-2 my-2 rounded ${
                            message.role === 'user' 
                                ? 'bg-blue-500 text-white self-end'
                                : 'bg-gray-500 text-black self-start'
                        }`}>
                            {message.content}
                        </div>
                    ))
                }
            </div>
            <form action={handleSendMessage} className="flex items-center mt-4">
                <input type="hidden" name="chatId" value={chatId}/>
                <input type="text" name="newMessage" placeholder="Type your message..."
                       className="flex-1 p-2 text-black rounded-l bg-[#f5f5f5] placeholder-gray-500 focus:outline-none" />
                <button type="submit" className="ml-2 text-sm bg-[#3e3e3e] hover:bg-[#575757] p-2 rounded-r text-white">Send</button>
            </form>
        </div>
    )
}

export default Chat;