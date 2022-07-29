// External libraries
import { useRouter } from "next/router";
import { useEffect } from "react";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { Role } from "@utils/types/person";

/**
 * Redirect if the user role doesn’t match the intended role for the page.
 * @param pageRole The user must be in this role to visit this page
 */
export function useProtectPageFor(pageRole: "public" | "admin" | Role): void {
  const router = useRouter();

  useEffect(() => {
    const user = supabase.auth.user();

    const userRole: Role | null = user?.user_metadata?.role;
    const userIsAdmin: boolean = user?.user_metadata?.isAdmin;

    let destination = "/account/login";
    if (pageRole != "public" && !user) destination = "/account/login";
    else if ((pageRole == "admin" && userIsAdmin) || pageRole == userRole)
      return;
    else if (userRole == "student") destination = "/s/home";
    else if (userRole == "teacher") destination = "/t/home";

    router.push(destination);
  }, []);
}
