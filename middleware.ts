// Imports
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getLocalePath from "@/utils/helpers/getLocalePath";
import logError from "@/utils/helpers/logError";
import { LangCode } from "@/utils/types/common";
import { User, UserRole } from "@/utils/types/person";
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

  // Ignore all page requests if under maintenance
  if (process.env.CLOSED_FOR_MAINTENANCE === "true")
    return NextResponse.redirect(
      new URL(getLocalePath("/maintenance", locale), req.url),
    );
  else if (route === "/maintenance")
    return NextResponse.redirect(new URL(getLocalePath("/", locale), req.url));

  // Get current page protection type
  const pageRole: UserRole | "public" | "admin" | "user" =
    route === "/"
      ? "public"
      : /^\/admin|(news\/(info|form)\/(create|(\d+\/edit)))/.test(route)
      ? "admin"
      : /^\/learn/.test(route)
      ? "student"
      : /^\/(teach|class\/\d{3}\/form\/\d+)/.test(route)
      ? "teacher"
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

  // Disallow public users from visiting private pages
  if (pageRole !== "public" && !user) destination = "/";

  // Disallow logged in users from visiting onboarding pages except for the ones not onboarded
  if (user && !user?.onboarded && !route.startsWith("/account/welcome"))
    destination = "/account/welcome";
  // Disallow students from vising the Your Subject page of the onboarding
  // process
  else if (route === "/account/welcome/your-subjects" && user?.role === "student")
    destination = "/account/welcome/your-information";
  // Disallow logged in users from visiting certain pages under certain
  // circumstances
  // prettier-ignore
  else if (
    !(
      (
        // Allow new users to visit onboarding pages
        (route.startsWith("/account/welcome") && !user?.onboarded) ||
        // Allow admins to visit admin pages
        (pageRole === "admin" && user?.is_admin) ||
        // Allow all users to visit user pages
        pageRole === "user" ||
        // Allow users with the correct roles
        pageRole === user?.role
      )
    )
  ) {
    // Set destinations for students and teachers in the wrong pages
    if (user?.role === "student") destination = "/learn";
    else if (user?.role === "teacher") destination = "/teach";
  }
  // Allow all users to visit user pages
  // Allow users with the correct roles
  else if (!(pageRole === "user" || pageRole === user?.role)) {
    if (pageRole !== "admin" || !user?.is_admin) {
      // Set destinations for students and teachers in the wrong pages
      if (user?.role === "student") destination = "/learn";
      else if (user?.role === "teacher") destination = "/teach";
    }
  }

  // Redirect if decided so, continue if not
  if (destination)
    return NextResponse.redirect(
      new URL(getLocalePath(destination, locale), req.url),
    );
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/account",
    "/account/:path*",
    "/about",
    "/admin/:path*",
    "/learn",
    "/learn/:id",
    "/teach",
    "/class/:path*",
    "/lookup/:path*",
    "/maintenance",
    "/news",
    "/news/:id",
  ],
};
