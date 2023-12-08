// Imports
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getLocalePath from "@/utils/helpers/getLocalePath";
import logError from "@/utils/helpers/logError";
import permitted from "@/utils/helpers/permitted";
import getHomeURLofRole from "@/utils/helpers/person/getHomeURLofRole";
import { LangCode } from "@/utils/types/common";
import { User, UserPermissionKey } from "@/utils/types/person";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * The middleware is run before a request is completed.
 *
 * @param req The incoming request.
 *
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/middleware Next.js documentation}
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Get original destination
  const route = req.nextUrl.pathname;
  const locale = req.nextUrl.locale as LangCode;

  // Log middleware start
  console.log(`\u001b[1m\x1b[35m ⇥\u001b[0m Running middleware on ${route} …`);

  // Ignore all page requests if under maintenance
  if (process.env.CLOSED_FOR_MAINTENANCE === "true")
    return NextResponse.redirect(
      new URL(getLocalePath("/maintenance", locale), req.url),
    );
  else if (route === "/maintenance")
    return NextResponse.redirect(new URL(getLocalePath("/", locale), req.url));

  // Get current page protection type
  const pageRole = (() => {
    if (route === "/") return "public";
    else if (route.startsWith("/admin")) return "admin";
    else if (route.startsWith("/learn")) return "student";
    else if (route.startsWith("/teach")) return "teacher";
    else if (route.startsWith("/manage")) return "management";
    else return "user";
  })();

  // Declare Supabase client
  const supabase = createMiddlewareClient({ req, res });

  // Get user metadata
  const jwt = await getToken({ req });
  let user: User | null = null;
  if (jwt?.email) {
    const { data, error } = await getUserByEmail(supabase, jwt?.email);
    if (error) logError("middleware (user)", error);
    user = data;
  }

  // Decide on destination based on user and page protection type
  const destination = (() => {
    // Default Search page to Students tab
    if (route === "/search") return "/search/students";

    // Disallow public users from visiting private pages
    if (pageRole !== "public" && !user) return "/";

    // Disallow logged in users from visiting certain pages under certain
    // circumstances
    // prettier-ignore
    if (
      !(
        (
          // Allow admins to visit admin pages
          (pageRole === "admin" && user?.is_admin) ||
          // Allow those with `can_see_management` permission to visit management
          // pages
          (pageRole === "management" &&
            permitted(user, UserPermissionKey.can_see_management)) ||
          // Allow all users to visit user pages
          pageRole === "user" ||
          // Allow users with the correct roles
          pageRole === user?.role
        )
      )
    ) 
      return user?.role ? getHomeURLofRole(user.role) : "/";

    // Let permitted users continue
    return null;
  })();

  // Log middleware end
  console.log(
    `\u001b[1m\x1b[35m ↦\x1b[0m\u001b[0m ${
      destination ? `Redirected to ${destination}` : "Continued"
    }`,
  );

  // Redirect if decided so, continue if not
  if (destination)
    return NextResponse.redirect(
      new URL(getLocalePath(destination, locale), req.url),
    );
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/learn",
    "/teach",
    "/manage/:path*",
    "/classes/:path*",
    "/search/:path*",
    "/account/:path*",
    "/news",
    "/news/:id",
    "/admin/:path*",
    "/maintenance",
  ],
};
