// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";

// Types
import { CustomPage } from "@/utils/types/common";

const LogOutPage: CustomPage = () => {
  // Log the user out
  const supabase = useSupabaseClient();
  useEffect(() => {
    supabase.auth.signOut();
  }, []);

  return null;
};

export default LogOutPage;
