// External libraries
import { GetServerSideProps, NextPage } from "next";

// Backend
import { getClassNumberFromUser } from "@utils/backend/classroom/classroom";

const Learn: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { data: classID } = await getClassNumberFromUser(req, res);
  return { redirect: { destination: `/learn/${classID}`, permanent: false } };
};

export default Learn;
