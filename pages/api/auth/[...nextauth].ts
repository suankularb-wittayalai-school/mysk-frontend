import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import { supabase } from "@/utils/supabase-backend";
import { OAuth2Client } from "google-auth-library";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next/types";

const googleAuthClient = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
);

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "googleonetap",
      name: "google-one-tap",
      credentials: {
        credential: {
          type: "text",
        },
      },

      async authorize(credentials, req) {
        const token = credentials!.credential;
        const ticket = await googleAuthClient.verifyIdToken({
          idToken: token,
          audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
          throw new Error("Cannot extract payload from signin token");
        }

        const {
          email,
          // sub,
          name,
          picture: image,
        } = payload;
        if (!email) {
          throw new Error("Email not available");
        }

        // check email for domain
        if (!email.endsWith("student.sk.ac.th" && "sk.ac.th")) {
          throw new Error("Email not allowed");
        }

        // get user from db
        let { data: user, error } = await getUserByEmail(supabase, email);

        // get the user

        if (error) {
          throw new Error(error.message);
        }

        return { id: user!.id, email, name, image };
      },
    }),
  ],
};

/**
 * This is the main authentication function.
 *
 * @param req
 * @param res
 *
 * @returns
 */
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptions);
}
// export default NextAuth(authOptions)
