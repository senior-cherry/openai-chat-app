'use server';

import OpenAI from "openai";
import { getAuth } from "@kobbleio/next/server";
import {v4 as uuidv4} from "uuid";
import {supabaseClient} from "@/app/supabase/client";
import {revalidatePath} from "next/cache";

interface Message {
    id: string;
    chat_id: string;
    user_id?: string;
    content: string;
    role: 'user' | 'assistant';
    created_at: string;
}

export const handleNewMessage = async (formData: FormData) => {
    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
    });

    const newMessage = formData.get("newMessage");
    const chatId = formData.get("chatId");

    if (!newMessage || typeof newMessage !== 'string') return;
    if (!chatId || typeof chatId !== 'string') return;
    if (newMessage.trim() === "") return;

    const userMessage: Message = {
        id: uuidv4(),
        chat_id: chatId,
        content: newMessage,
        role: 'user',
        created_at: new Date().toISOString()
    }

    const { session } = await getAuth();
    const userId = session?.user.id;

    const { error: userMessageError } = await supabaseClient
        .from("messages")
        .insert([userMessage]);

    if (userMessageError) {
        console.error("Error sending user message", userMessageError);
        return;
    }

    revalidatePath("/");

    const {data: existingMessages, error: fetchMessagesError} = await supabaseClient
        .from("messages")
        .select("role, content")
        .eq("chat_id", chatId)
        .order("created_at", {ascending: true})
        .filter("user_id", "eq", userId);

    if (fetchMessagesError) {
        console.error("Error fetching user message", fetchMessagesError);
        return;
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "You are a helpful assistant"},
                ...existingMessages,
                {role: "user", content: newMessage},
            ] as {role: "system" | "user" | "assistant"; content: string}[]
        })

        const botMessage: Message = {
            id: uuidv4(),
            chat_id: chatId,
            content: response.choices[0].message.content || "No response from bot",
            role: "assistant",
            created_at: new Date().toISOString()
        }

        const {error: botMessageError} = await supabaseClient
            .from("messages")
            .insert([botMessage]);

        if (botMessageError) {
            console.error("Error saving bot message", fetchMessagesError)
            return;
        }

        revalidatePath("/");
    } catch (err) {
        console.error("Error getting OpenAI response", err)
    }
}

