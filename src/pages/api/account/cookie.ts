// Modules
import { NextApiHandler } from "next";

// Supabase
import { supabase } from "@utils/supabaseClient";

const handler: NextApiHandler = async (req, res) => {
  supabase.auth.api.setAuthCookie(req, res);
};

export default handler;
