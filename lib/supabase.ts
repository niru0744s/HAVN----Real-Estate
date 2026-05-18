import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;
export const supabase = createClient(supabaseUrl,supabaseAnonKey);

export function createClerkSupabaseCLient(getToken:()=>Promise<string|null>){
    return createClient(supabaseUrl,supabaseAnonKey, {
        global: {
            fetch: async (url, options = {}) => {
                const clerkToken = await getToken();
                console.log("--> fetch interceptor: clerkToken is:", clerkToken ? "PRESENT" : "NULL");
                const headers = new Headers(options?.headers);
                if (clerkToken) {
                    headers.set('Authorization', `Bearer ${clerkToken}`);
                }
                return fetch(url, {
                    ...options,
                    headers,
                });
            },
        },
    });
}