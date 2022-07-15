// Modules
import { NextApiHandler } from "next";

// Supabase
import { supabase } from "@utils/supabaseClient";

const handler: NextApiHandler = async (req, res) => {
  req.body = JSON.parse(req.body);
  supabase.auth.api.setAuthCookie(req, res);
};

export default handler;
