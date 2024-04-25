import UserContext from "@/contexts/UserContext";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
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

  useEffect(() => {
    // Fetch the user data if not yet fetched.
    if (user || person) return;
    (async () => {
      const { data: apiUser } = await fetchMySKProxy<User>("/auth/user");
      if (!apiUser) return;

      // Permissions aren’t implemented in MySK API yet (per @smartwhatt), so we
      // have to use the Supabase implementation.
      const { data: user } = await getUserByEmail(supabase, apiUser.email!);
      if (user) setUser(user);

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
    })();
  }, []);

  return mysk;
}
