import {CookieOptions, createServerClient} from "@supabase/ssr";
import { cookies } from "next/headers";
import { getKobble } from "@kobbleio/next/server";

type CookieToSet = {
    name: string,
    value: string,
    options: CookieOptions
}

function createClient() {
    const cookieStore = cookies();
    const kobble = getKobble();

    const customFetch: typeof fetch = async (input, init = {}) => {
        const token = await kobble.getSupabaseToken();
        const headers = new Headers(init.headers);
        headers.set('Authorization', `Bearer ${token}`);

        return fetch(input, {
            ...init,
            headers
        })
    }

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        {
            cookies: {
                getAll: () => {
                    return cookieStore.getAll()
                },
                setAll: (cookiesToSet: CookieToSet[]): void => {
                    try {
                        cookiesToSet.forEach(({name, value, options}) =>
                            cookieStore.set(name, value, options))
                    } catch {
                        //
                }
            }
            },
        global: {
                fetch: customFetch
    },
        }
    )
}

export const supabaseClient = createClient();