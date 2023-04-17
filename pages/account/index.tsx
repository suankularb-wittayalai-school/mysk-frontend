// External libraries
import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import type { FC } from "react";

// SK Components
import {
  Actions,
  Button,
  ContentLayout,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Internal components
import DynamicAvatar from "@/components/common/DynamicAvatar";
import MySKPageHeader from "@/components/common/MySKPageHeader";

// Backend
import { getPersonFromUser } from "@/utils/backend/person/person";
import { getSubjectGroups } from "@/utils/backend/subject/subjectGroup";

// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";
import { nameJoiner } from "@/utils/helpers/name";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student, Teacher } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";

/**
 * The most basic information about a Person, their name and their role inside
 * the school.
 *
 * @param person The Person to display information of.
 *
 * @returns A section.
 */
const BasicInfoSection: FC<{ person: Student | Teacher }> = ({ person }) => {
  const locale = useLocale();
  const { t } = useTranslation("account");

  return (
    <section className="mx-4 flex flex-col gap-4 sm:mx-0">
      <div className="flex flex-col gap-3 md:flex-row md:gap-6">
        {/* Profile picture */}
        <DynamicAvatar
          profile={person.profile}
          className="!h-[4.5rem] !w-[4.5rem] basis-[4.5rem]"
        />

        {/* Text */}
        <div className="grow">
          {/* Name */}
          <h2 className="skc-display-small">
            {nameJoiner(locale, person.name)}
          </h2>
          {/* Role within the school */}
          <p className="skc-headline-small">
            {
              // For a teacher: Class Advisor at and Subject Group
              person.role === "teacher"
                ? [
                    t("basicInfo.classAdvisorAt", {
                      classAdvisorAt: person.classAdvisorAt?.number,
                    }),
                    getLocaleString(person.subjectGroup.name, locale),
                  ]
                    .filter((segment) => segment)
                    .join(" • ")
                : // For a student: Class and Class No.
                  t("basicInfo.classAndNo", {
                    class: person.class.number,
                    classNo: person.classNo,
                  })
            }
          </p>
        </div>
      </div>
      <Actions align="left">
        {/* Chat (future feature) */}
        {/* <Button
          appearance="tonal"
          icon={<MaterialIcon icon="chat" />}
          href="/account/chat"
          element={Link}
        >
          {t("action.chat")}
        </Button> */}

        {/* Log out */}
        <Button
          appearance="tonal"
          icon={<MaterialIcon icon="logout" />}
          dangerous
          href="/account/logout"
          element={Link}
        >
          {t("action.logOut")}
        </Button>

        {/* Change password */}
        <Button appearance="outlined" icon={<MaterialIcon icon="password" />}>
          {t("action.changePassword")}
        </Button>
      </Actions>
    </section>
  );
};

/**
 * A page where a user can view and edit their information.
 *
 * @param person The Person to display information of.
 * @param subjectGroups A list of all Subject Groups; used in the edit form.
 *
 * @returns A Page.
 */
const AccountPage: CustomPage<{
  person: Student | Teacher;
  subjectGroups: SubjectGroup[];
}> = ({ person, subjectGroups }) => {
  // Translation
  const { t } = useTranslation(["account", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("title")}
        icon={<MaterialIcon icon="account_circle" />}
      />
      <ContentLayout>
        <BasicInfoSection {...{ person }} />
        <Section>
          <p>TODO</p>
        </Section>
      </ContentLayout>
    </>
  );
};

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

  const { data: person } = await getPersonFromUser(
    supabase,
    session!.user as User,
    { contacts: true, classAdvisorAt: true }
  );

  const { data: subjectGroups } = await getSubjectGroups();

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "welcome",
        "account",
      ])),
      person,
      subjectGroups,
    },
  };
};

export default AccountPage;
