import {createKobbleClient} from "@kobbleio/javascript";

export const kobbleClient = createKobbleClient({
    domain: process.env.NEXT_PUBLIC_KOBBLE_DOMAIN as string,
    clientId: process.env.NEXT_PUBLIC_KOBBLE_CLIENT_ID as string,
    redirectUri: process.env.NEXT_PUBLIC_KOBBLE_REDIRECT_URI as string,
})