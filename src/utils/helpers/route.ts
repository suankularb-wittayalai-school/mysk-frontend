// External libraries
import { IncomingMessage } from "http";

import { GetServerSidePropsResult } from "next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { Role } from "@utils/types/person";

/**
 * Sends back an object for redirecting if the user role doesn’t match the
 * intended role for the page. Must be use in `GetServerSideProps` or
 * `GetStaticProps`.
 *
 * An example would be:
 *
 * ```ts
 * export const getServerSideProps: GetServerSideProps = async ({ req }) => {
 *   const redirect = protectPageFor("public", req);
 *   if (redirect) return redirect;
 *
 *   return (
 *     // ...
 *   )
 * }
 * ```
 *
 * @param pageRole The user must be in this role to visit this page
 * @param req Passed in from `context` in `GetServerSideProps` and `GetStaticProps`
 * @returns The same return as `GetServerSideProps` and `GetStaticProps` if redirect
 */
export async function protectPageFor(
  pageRole: "public" | "admin" | Role,
  req: IncomingMessage & { cookies: NextApiRequestCookies }
): Promise<GetServerSidePropsResult<{ [key: string]: any }> | void> {
  // Get the user from the cookie
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error) {
  if (pageRole == "public") return;

    return {
      props: {},
      redirect: {
        destination: "/account/login",
        permanent: false,
      },
    };
  }

  const userRole: Role | null = user?.user_metadata?.role;
  const userIsAdmin: boolean = user?.user_metadata?.isAdmin;

  // Set the destination to redirect to (if mismatch)
  let destination = "/";
  if (pageRole != "public" && user == null) destination = "/account/login";
  else if ((pageRole == "admin" && userIsAdmin) || pageRole == userRole) return;
  else if (userRole == "student") destination = "/s/home";
  else if (userRole == "teacher") destination = "/t/home";

  return { props: {}, redirect: { destination, permanent: false } };
}
