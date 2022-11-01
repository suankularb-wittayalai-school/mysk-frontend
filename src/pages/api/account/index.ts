// External libraries
import { NextApiHandler } from "next";

// Backend
import { supabase } from "@utils/supabase-backend";

const handler: NextApiHandler = async (req, res) => {
  // if method is delete then delete the account
  if (req.method === "DELETE") {
    const { data: user, error: deletingError } =
      await supabase.auth.admin.deleteUser(req.body.id);

    return res.json({ user, deletingError });
  }
};

export default handler;
