import { useUserStore } from "@/store/userStore";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { useSupabase } from "./useSupabase";

export const useUserSync = () => {
    const { user } = useUser();
    const setIsAdmin = useUserStore((state) => state.
        setIsAdmin);

    const authSupabase = useSupabase();

    useEffect(() => {
        if (!user) return;
        syncUser();
    }, [user]);

    const syncUser = async () => {
        const user_session = await authSupabase.auth.getSession();
        console.log("Supabase auth session:", user_session.data.session ? "✓ authenticated" : "✗ no session");

        const {data, error} = await authSupabase.from("Users")
        .select("clerk_id,is_admin")
        .eq("clerk_id", user!.id)
        .maybeSingle();

        if(error) {
            console.error("Error fetching user from Supabase:", error);
            setIsAdmin(false);
            return;
        }

        if(data){
            setIsAdmin(data.is_admin ?? false);
            return;
        }

        console.log("Attempting insert with clerk_id:", user!.id);
        const {data: newUser, error: insertError} = await authSupabase
        .from("Users")
        .insert({
            clerk_id: user!.id,
            email: user!.emailAddresses[0].emailAddress,
            first_name: user!.firstName,
            last_name: user!.lastName,
            avatar_url: user!.imageUrl,
        })
        .select("is_admin")
        .single();

        if(insertError) {
            console.error("Error inserting user to Supabase:", insertError);
            setIsAdmin(false);
            return;
        }

        setIsAdmin(newUser?.is_admin ?? false);
    };
};