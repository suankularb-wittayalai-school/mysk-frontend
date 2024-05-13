import prefixLocale from "@/utils/helpers/prefixLocale";
import { CustomPage } from "@/utils/types/common";
import { GetStaticProps } from "next";

const ManageClassroomsPage: CustomPage = () => null;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  redirect: {
    destination: prefixLocale("/manage/classrooms/print", locale),
    permanent: false,
  },
});

export default ManageClassroomsPage;
