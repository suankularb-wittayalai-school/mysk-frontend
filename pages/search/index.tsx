import prefixLocale from "@/utils/helpers/prefixLocale";
import { CustomPage } from "@/utils/types/common";
import { GetStaticProps } from "next";

const SearchPage: CustomPage = () => null;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  redirect: {
    destination: prefixLocale("/search/students", locale),
    permanent: false,
  },
});

export default SearchPage;
