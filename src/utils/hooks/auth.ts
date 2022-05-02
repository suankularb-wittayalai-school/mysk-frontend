import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Types
import { Session } from '@supabase/supabase-js';
import { supabase } from '@utils/supabaseClient';


export function useSession() {
    const [session, setSession] = useState<null | Session>(null);
    const router = useRouter();

    useEffect(() => {
        if (!supabase.auth.session()) {
            router.push("/");
        }

        setSession(supabase.auth.session());

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);
    return session
}
