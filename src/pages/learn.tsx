// External libraries
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// Backend
import { getClassNumberFromUser } from "@utils/backend/classroom/classroom";

// Helpers
import { getLocalePath } from "@utils/helpers/i18n";

// Types
import { LangCode } from "@utils/types/common";

const Learn: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: user, error } = await supabase
    .from("users")
    .select("onboarded")
    .match({ id: session!.user.id })
    .limit(1)
    .single();

  if (error) console.error(error);
  if (user!.onboarded)
    return {
      redirect: {
        destination: getLocalePath("/welcome", locale as LangCode),
        permanent: false,
      },
    };

  const { data: classID } = await getClassNumberFromUser(
    supabase,
    session!.user
  );

  return {
    redirect: {
      destination: getLocalePath(`/learn/${classID}`, locale as LangCode),
      permanent: false,
    },
  };
};

export default Learn;
