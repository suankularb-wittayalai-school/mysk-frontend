// External libraries
import { GetServerSideProps, NextPage } from "next";

// Backend
import { getClassNumberFromReq } from "@utils/backend/classroom/classroom";

const Learn: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { data: classID } = await getClassNumberFromReq(req, res);
  return { redirect: { destination: `/learn/${classID}`, permanent: false } };
};

export default Learn;
