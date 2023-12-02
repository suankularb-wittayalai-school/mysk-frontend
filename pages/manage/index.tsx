// Imports
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import permitted from "@/utils/helpers/permitted";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserPermissionKey } from "@/utils/types/person";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/**
 * Management’s counterpart to Learn, where the user can view statistics about
 * the school. This page is only accessible to users with the
 * `can_see_management` permission.
 *
 * Management users see this page as their Home. Other users with the permission
 * can access this page from their Account page.
 *
 * @todo Implement this page.
 */
const ManagePage: CustomPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  // Check if the user is logged in and has the `can_see_management` permission.
  // If not, return a 404.

  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return { notFound: true };

  const { data: user } = await getUserByEmail(supabase, session.user.email!);
  if (!permitted(user!, UserPermissionKey.can_see_management))
    return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "manage",
      ])),
    },
  };
};

export default ManagePage;
