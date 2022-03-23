// Modules
import { NextPage } from "next";
import Link from "next/link";
import { useTranslation } from "next-i18next";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Title,
} from "@suankularb-components/react";

// Page
const Class: NextPage = () => {
  const { t } = useTranslation("class");

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: t("title") }}
          pageIcon={<MaterialIcon icon="groups" />}
          backGoesTo="/"
          LinkElement={Link}
        />
      }
    >
      <p>TODO</p>
    </RegularLayout>
  );
};

export default Class;
