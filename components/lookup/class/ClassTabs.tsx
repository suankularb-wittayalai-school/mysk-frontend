// External libraries
import { useUser } from "@supabase/auth-helpers-react";

import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { FC } from "react";

// SK Components
import { MaterialIcon, Tab, TabsContainer } from "@suankularb-components/react";

const ClassTabs: FC<{
  number: number;
  type: "class" | "lookup";
}> = ({ number, type }) => {
  const { t } = useTranslation("class");

  const router = useRouter();
  const parentURL = type === "lookup" ? `/lookup/class/${number}` : "/class";

  const user = useUser();

  return (
    <TabsContainer appearance="primary" alt="">
      <Tab
        icon={<MaterialIcon icon="info" />}
        label={t("common.navigation.overview")}
        selected={router.asPath === parentURL}
        href={parentURL}
        element={Link}
      />
      <Tab
        icon={<MaterialIcon icon="groups" />}
        label={t("common.navigation.students")}
        selected={router.asPath === `${parentURL}/students`}
        href={`${parentURL}/students`}
        element={Link}
      />
      <Tab
        icon={<MaterialIcon icon="group" />}
        label={t("common.navigation.teachers")}
        selected={router.asPath === `${parentURL}/teachers`}
        href={`${parentURL}/teachers`}
        element={Link}
      />
      {type === "lookup" || user?.role === "teacher" ? (
        <Tab
          icon={<MaterialIcon icon="dashboard" />}
          label={t("common.navigation.schedule")}
          selected={router.asPath === `${parentURL}/schedule`}
          href={`${parentURL}/schedule`}
          element={Link}
        />
      ) : (
        <></>
      )}
    </TabsContainer>
  );
};

export default ClassTabs;
