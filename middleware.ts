// Imports
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getLocalePath from "@/utils/helpers/getLocalePath";
import logError from "@/utils/helpers/logError";
import { LangCode } from "@/utils/types/common";
import { User } from "@/utils/types/person";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import getHomeURLofRole from "./utils/helpers/person/getHomeURLofRole";

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
  const pageRole:
    | "public"
    | "admin"
    | "student"
    | "teacher"
    | "management"
    | "user" =
    route === "/"
      ? "public"
      : /^\/admin|(news\/(info|form)\/(create|(\d+\/edit)))/.test(route)
        ? "admin"
        : /^\/learn/.test(route)
          ? "student"
          : /^\/(teach|class\/\d{3}\/form\/\d+)/.test(route)
            ? "teacher"
            : /^\/manage/.test(route)
              ? "management"
              : "user";

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
  let destination: string | null = null;

  /**
   * The home destination is the page the user is redirected to if they are
   * on a page they are not allowed to be on.
   */
  const homeDestination = user?.role ? getHomeURLofRole(user.role) : "/";

  // Default Search page to Students tab
  if (route === "/search") destination = "/search/students";

  // Disallow public users from visiting private pages
  if (pageRole !== "public" && !user) destination = "/";
  // Disallow logged in users from visiting certain pages under certain
  // circumstances
  // prettier-ignore
  else if (
    !(
      (
        // Allow admins to visit admin pages
        (pageRole === "admin" && user?.is_admin) ||
        // Allow all users to visit user pages
        pageRole === "user" ||
        // Allow users with the correct roles
        pageRole === user?.role
      )
    )
  ) {
    // Set destinations for users in the wrong pages
    destination = homeDestination;
  }
  // Allow all users to visit user pages
  // Allow users with the correct roles
  else if (!(pageRole === "user" || pageRole === user?.role)) {
    if (pageRole !== "admin" || !user?.is_admin) {
      // Set destinations for users in the wrong pages
      destination = homeDestination;
    }
  }

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
    "/account/:path*",
    "/admin/:path*",
    "/learn",
    "/teach",
    "/classes/:path*",
    "/search/:path*",
    "/maintenance",
    "/manage/:path*",
    "/news",
    "/news/:id",
  ],
};
