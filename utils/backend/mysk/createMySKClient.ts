import fetchMySKAPI from "@/utils/backend/mysk/fetchMySKAPI";
import { FetchReturn } from "@/utils/types/fetch";
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
) {
  // Get the access token from the request cookies
  const accessToken = req?.cookies["access_token"];
  let user: User | null = null;

  // If there is an access token, fetch the user data
  if (accessToken) {
    const { data } = await fetchMySKAPI<User>("/auth/user", accessToken);
    if (data) user = data;
  }

  return {
    fetch: async <Data extends {} | unknown = unknown>(
      path: Parameters<typeof fetchMySKAPI>["0"],
      options?: Parameters<typeof fetchMySKAPI>["2"],
    ): Promise<FetchReturn<Data> | null> =>
      fetchMySKAPI(path, accessToken, options),
    user,
  };
}
