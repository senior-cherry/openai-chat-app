'use server';

import OpenAI from "openai";

export const handleSendMessage = async (formData: FormData) => {
    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
    })
}