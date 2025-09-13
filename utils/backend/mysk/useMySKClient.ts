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
  const { user, setUser, person, setPerson, loading, setLoading } =
    useContext(UserContext);

  const mysk = { fetch: fetchMySKProxy, user, person };
  const supabase = useSupabaseClient();

  useEffect(() => {
    // Fetch the user data if not yet fetched.
    if (!document.cookie.includes("access_token") || loading || user || person)
      return;
    (async () => {
      setLoading(true);
      const { data: user } = await fetchMySKProxy<User>("/auth/user");
      if (!user) return;
      setUser(user);

      // Once the user data is fetched, fetch the person (Student/Teacher) data,
      // which is more detailed.
      const { data: person } = await getLoggedInPerson(
        supabase,
        { ...mysk, user },
        // We get everything!
        {
          detailed: true,
          includeContacts: true,
          includeCertificates: true,
        },
      );
      if (person) setPerson(person);
      setLoading(false);
    })();
  }, []);

  return mysk;
}