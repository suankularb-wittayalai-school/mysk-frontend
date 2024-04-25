import UserContext from "@/contexts/UserContext";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import fetchMySKProxy from "@/utils/backend/mysk/fetchMySKProxy";
import { MySKClient } from "@/utils/types/fetch";
import { User } from "@/utils/types/person";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useContext, useEffect } from "react";

/**
 * A hook to use the MySK client.
 *
 * @returns The MySK client.
 *
 * @example
 * ```ts
 * const mysk = useMySKClient();
 * const { data, error } = await mysk.fetch("/health-check");
 * ```
 */
export default function useMySKClient(): MySKClient {
  const { user, setUser, person, setPerson } = useContext(UserContext);

  const mysk = { fetch: fetchMySKProxy, user, person };
  const supabase = useSupabaseClient();

  // Fetch the user data if not yet fetched.
  useEffect(() => {
    if (user) return;
    (async () => {
      const { data } = await fetchMySKProxy<User>("/auth/user");
      if (data) setUser(data);
    })();
  }, []);

  // Once the user data is fetched, fetch the person (Student/Teacher) data,
  // which is more detailed.
  useEffect(() => {
    if (person || !user) return;
    // We can’t use this client directly because a hook can’t be used in another
    // hook, so we create a new client here.
    (async () => {
      const { data } = await getLoggedInPerson(supabase, mysk, {
        // We get everything!
        detailed: true,
        includeContacts: true,
        includeCertificates: true,
      });
      if (data) setPerson(data);
    })();
  }, [user]);

  return mysk;
}
