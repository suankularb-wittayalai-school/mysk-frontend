// External libraries
import { useUser } from "@supabase/auth-helpers-react";

import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { FC, useEffect, useState } from "react";

// SK Components
import { MaterialIcon, Tab, TabsContainer } from "@suankularb-components/react";

const ClassTabs: FC<{
  number: number;
  type: "class" | "lookup";
}> = ({ number, type }) => {
  const { t } = useTranslation("class");

  const router = useRouter();
  const parentURL = type === "lookup" ? `/lookup/class/${number}` : "/class";

  const [selected, setSelected] = useState<
    "overview" | "students" | "teachers" | "schedule"
  >();
  useEffect(() => {
    if (router.asPath === parentURL) setSelected("overview");
    else if (router.asPath === `${parentURL}/student`) setSelected("students");
    else if (router.asPath === `${parentURL}/teacher`) setSelected("teachers");
    else if (router.asPath === `${parentURL}/schedule`) setSelected("schedule");
  }, [router.asPath]);

  const user = useUser();

  return (
    <TabsContainer appearance="primary" alt="">
      {/* Overview Tab: Class Advisors and Contacts */}
      <Tab
        icon={<MaterialIcon icon="info" />}
        label={t("common.navigation.overview")}
        selected={selected === "overview"}
        href={parentURL}
        onClick={() => setSelected("overview")}
        element={Link}
      />

      {/* Students Tab: list of all Students in this Class */}
      <Tab
        icon={<MaterialIcon icon="groups" />}
        label={t("common.navigation.students")}
        selected={selected === "students"}
        href={`${parentURL}/student`}
        onClick={() => setSelected("students")}
        element={Link}
      />

      {/* Students Tab: list of all Teachers that teach this class (not
          including Class Advisors) */}
      <Tab
        icon={<MaterialIcon icon="group" />}
        label={t("common.navigation.teachers")}
        selected={selected === "teachers"}
        href={`${parentURL}/teacher`}
        onClick={() => setSelected("teachers")}
        element={Link}
      />

      {/* Schedule Tab: this Class’s Schedule */}
      {type === "lookup" || user?.role === "teacher" ? (
        <Tab
          icon={<MaterialIcon icon="dashboard" />}
          label={t("common.navigation.schedule")}
          selected={selected === "schedule"}
          href={`${parentURL}/schedule`}
          onClick={() => setSelected("schedule")}
          element={Link}
        />
      ) : (
        <></>
      )}
    </TabsContainer>
  );
};

export default ClassTabs;
