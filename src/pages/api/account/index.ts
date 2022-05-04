// Modules
import { NextApiHandler } from "next";

// Backend
import { supabaseBackend } from "@utils/supabaseBackend";

const handler: NextApiHandler = async (req, res) => {
  // if method is delete then delete the account
  if (req.method === "DELETE") {
    const { data: user, error: deletingError } =
      await supabaseBackend.auth.api.deleteUser(req.body.id);

    return res.json({ user, deletingError });
  }
};

export default handler;
