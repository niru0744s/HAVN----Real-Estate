import { useAuth } from "@clerk/expo";
import { useMemo } from "react";
import { createClerkSupabaseCLient } from "../lib/supabase";

export function useSupabase(){
    const {getToken} = useAuth();

    const client = useMemo(
        () => createClerkSupabaseCLient(()=>getToken()),
        [getToken],
    );

    return client;
};