// Imports
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import logError from "@/utils/helpers/logError";
import { User } from "@/utils/types/person";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useUser() {
  const { data, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  const supabase = useSupabaseClient();

  useEffect(() => {
    const email = data?.user?.email;
    if (email) {
      (async () => {
        const { data, error } = await getUserByEmail(supabase, email);
        if (error) logError("useUser", error);
        setUser(data);
      })();
    }
  }, [data]);

  return { user, status };
}
