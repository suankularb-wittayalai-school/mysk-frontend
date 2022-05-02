// Modules
import { NextApiHandler } from "next";

// Backend
import { supabaseBackend } from "@utils/supabaseBackend";

const handler: NextApiHandler = async (req, res) => {
  // if method is post then create new student account
  if (req.method === "POST") {
    const { data: user, error } = await supabaseBackend.auth.api.createUser({
      email: req.body.email,
      password: req.body.password,
      user_metadata: {
        role: "student",
        student: req.body.id,
      },
      email_confirm: true,
    });
    return res.json({ user, error });
  }

  // if method is delete then delete student account
  if (req.method === "DELETE") {
    const { data: user, error: deletingError } =
      await supabaseBackend.auth.api.deleteUser(req.body.id);

    return res.json({ user, deletingError });
  }
};

export default handler;
