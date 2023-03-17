// External libraries
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import { getClassNumberFromUser } from "@/utils/backend/classroom/classroom";

// Helpers
import { getLocalePath } from "@/utils/helpers/i18n";

// Types
import { LangCode } from "@/utils/types/common";

const LearnRedirect: NextPage = () => null;

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

  const { data: metadata, error: metadataError } = await getUserMetadata(
    supabase,
    session!.user.id
  );
  if (metadataError) console.error(metadataError);

  if (!metadata?.onboarded)
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

export default LearnRedirect;
