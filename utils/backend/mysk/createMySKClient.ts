import fetchMySKAPI from "@/utils/backend/mysk/fetchMySKAPI";
import { MySKClient } from "@/utils/types/fetch";
import { User } from "@/utils/types/person";
import { GetServerSidePropsContext } from "next";

/**
 * Creates a server-side MySK client.
 *
 * @param req The request object from `getServerSideProps`.
 *
 * @returns The MySK client.
 *
 * @example
 * ```ts
 * const mysk = await createMySKClient(req, res);
 * const { data, error } = await mysk.fetch("/health-check");
 * ```
 */
export default async function createMySKClient(
  req?: GetServerSidePropsContext["req"],
): Promise<MySKClient> {
  // Get the access token from the request cookies
  const accessToken = req?.cookies["access_token"];
  let user: User | null = null;

  // If there is an access token, fetch the user data
  if (accessToken) {
    const { data } = await fetchMySKAPI<User>("/auth/user", accessToken);
    if (data) user = { ...data, permissions: [] };
  }

  return {
    fetch: async (path, options) =>
      await fetchMySKAPI(path, accessToken, options),
    user,
    // Person data is not fetched here because it is more detailed and fetching
    // that every time a new client is created would be inefficient.
    // The client-side `useMySKClient` hook has Person data because it fetches
    // only once and stores it in the context.
    person: null,
  };
}
