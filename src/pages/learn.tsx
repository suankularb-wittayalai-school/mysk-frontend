// External libraries
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";

// Backend
import { getClassNumberFromUser } from "@utils/backend/classroom/classroom";

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
  const { data: user } = await supabase.auth.getUser();
  const { data: classID } = await getClassNumberFromUser(
    supabase,
    user.user as User
  );
  return {
    redirect: {
      destination: `${locale == "th" ? "" : "/en-US"}/learn/${classID}`,
      permanent: false,
    },
  };
};

export default Learn;
