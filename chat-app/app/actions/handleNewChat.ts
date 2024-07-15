'use server';

import { v4 as uuidv4 } from 'uuid';
import {supabaseClient} from "@/app/supabase/client";
import {revalidatePath} from "next/cache";

export const handleNewChat = async (formData: FormData): Promise<void> => {
    const chatName = formData.get('chatName') as string | null
    if (chatName) {
        const newChat = {id: uuidv4(), name: chatName}

        const {error} = await supabaseClient
            .from('chats')
            .insert([newChat])

        if (error) {
            console.error("Error creating new chat");
        }

        revalidatePath('/');
    }
}