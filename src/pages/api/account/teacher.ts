// Modules
import { NextApiHandler } from "next";

// Backend
import { supabaseBackend } from "@utils/supabaseBackend";

const handler: NextApiHandler = async (req, res) => {
  // if method is post then create new teacher account
  if (req.method === "POST") {
    const { data: user, error } = await supabaseBackend.auth.api.createUser({
      email: req.body.email,
      password: req.body.password
        ? req.body.password
        : process.env.NEW_ACCOUNT_DEFAULT_PASS,
      user_metadata: {
        role: "teacher",
        teacher: req.body.id,
        isAdmin: req.body.isAdmin ? req.body.isAdmin : false,
      },
      email_confirm: true,
    });
    return res.json({ user, error });
  }
};

export default handler;
