// External libraries
import { GetServerSideProps, NextPage } from "next";
import { User, withPageAuth } from "@supabase/auth-helpers-nextjs";

// Backend
import { getClassNumberFromUser } from "@utils/backend/classroom/classroom";

const Learn: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = withPageAuth({
  async getServerSideProps({ locale }, supabase) {
    const { data: user } = await supabase.auth.getUser();
    const { data: classID } = await getClassNumberFromUser(user.user as User);
    return {
      redirect: {
        destination: `/${locale}/learn/${classID}`,
        permanent: false,
      },
    };
  },
});

export default Learn;
