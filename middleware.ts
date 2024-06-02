import { getStudentFromUserID } from "@/utils/backend/account/getLoggedInPerson";
import fetchMySKAPI from "@/utils/backend/mysk/fetchMySKAPI";
import getLocalePath from "@/utils/helpers/getLocalePath";
import logError from "@/utils/helpers/logError";
import permitted from "@/utils/helpers/permitted";
import getHomeURLofRole from "@/utils/helpers/person/getHomeURLofRole";
import { LangCode } from "@/utils/types/common";
import { MySKClient } from "@/utils/types/fetch";
import { Student, User, UserPermissionKey } from "@/utils/types/person";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
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
  if (process.env.NODE_ENV === "development")
    console.log(
      `\u001b[1m\x1b[35m →\u001b[0m Running middleware on ${route} …`,
    );

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

  // Get data about user
  const accessToken = req.cookies.get("access_token")?.value;
  let user: User | null = null;
  let student: Student | null = null;
  if (accessToken) {
    // Declare MySK client
    const mysk = {
      fetch: async (path, options) =>
        await fetchMySKAPI(path, accessToken, options),
      user: null,
      person: null,
    } as MySKClient;

    // Get user metadata
    const { data, error } = await fetchMySKAPI<User>("/auth/user", accessToken);
    if (error) logError("middleware (user)", error);
    user = data;

    // Get Student data (Students have more granular permissions)
    if (user?.role === "student") {
      const { data, error } = await getStudentFromUserID(
        supabase,
        mysk,
        user.id,
      );
      if (error) logError("middleware (student)", error);
      student = data;
    }
  }

  // Decide on destination based on user and page protection type
  const destination = (() => {
    // Default page redirects
    if (route === "/search") return "/search/students";
    if (route === "/manage/classrooms") return "/manage/classrooms/print";

    // Disallow public users from visiting private pages
    if (pageRole !== "public" && !user) return "/";

    // Disallow logged in users from visiting certain pages under certain
    // circumstances
    // prettier-ignore
    if (
      !(
        // Allow Students to visit their own Classroom pages
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
      return user?.role ? getHomeURLofRole(user.role) : "/";

    // Disallow Students from visiting pages of other Classrooms
    const ownClassroomURL = student?.classroom
      ? `/classes/${student.classroom.number}`
      : null;
    if (
      user?.role === "student" &&
      !user.is_admin &&
      route.startsWith("/classes/") &&
      (!ownClassroomURL || !route.startsWith(ownClassroomURL))
    )
      return "/classes";

    // Let permitted users continue
    return null;
  })();

  // Log middleware end
  if (process.env.NODE_ENV === "development")
    console.log(
      `\u001b[1m\x1b[35m →\x1b[0m\u001b[0m ${
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
    "/learn/:path*",
    "/teach/:path*",
    "/manage/:path*",
    "/classes/:path*",
    "/search/:path*",
    "/account/:path*",
    "/news",
    "/admin/:path*",
    "/maintenance",
  ],
};
