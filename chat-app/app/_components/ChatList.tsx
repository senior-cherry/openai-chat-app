'use client';

import React, {useCallback} from "react";
import {usePathname, useSearchParams, useRouter} from "next/navigation";

interface ChatListProps {
    chats: { id: string, name: string}[];
}

const ChatList: React.FC<ChatListProps> = ({chats}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        }, [searchParams]
    )

    const handleChatClick = (id: string) => {
        router.push(`${pathname}?${createQueryString('chatId', id)}`);
    }

    return (
        <ul className="flex-1 overflow-auto">
            {
                chats.map((chat) => (
                    <li key={chat.id} onClick={() => handleChatClick(chat.id)} className="p-4 hover:bg-[#3e3e3e] cursor-pointer">
                        {chat.name}
                    </li>
                ))
            }
        </ul>
    );
}

export default ChatList;