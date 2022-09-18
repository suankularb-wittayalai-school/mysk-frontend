// External libraries
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import {
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import ProfilePicture from "@components/ProfilePicture";

// Backend
import { getUserFromReq } from "@utils/backend/person/person";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";
import { nameJoiner } from "@utils/helpers/name";
import { createTitleStr } from "@utils/helpers/title";

// Types
import { LangCode } from "@utils/types/common";
import { Student, Teacher } from "@utils/types/person";

const BasicInfoSection = ({
  user,
}: {
  user: Student | Teacher;
}): JSX.Element => {
  const { t } = useTranslation("account");
  const locale = useRouter().locale as LangCode;

  return (
    <Section>
      <div className="grid grid-cols-[1fr_3fr] items-stretch gap-4 sm:gap-6 md:grid-cols-[1fr_5fr]">
        {/* Profile picture section */}
        <div>
          {/* Profile picture */}
          <div className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
            <ProfilePicture src={user.profile} />
          </div>
        </div>

        {/* Content section */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-grow flex-col gap-2">
            <div className="flex flex-col">
              {/* Name */}
              <h2 className="max-lines-1 break-all font-display text-4xl font-bold">
                {nameJoiner(locale, user.name)}
              </h2>

              {/* Class and number */}
              <p className="font-display text-xl">
                {user.role == "teacher" ? (
                  <>
                    {t("basicInfo.subjectGroup", {
                      subjectGroup: getLocaleString(user.subjectGroup.name, locale),
                    })}
                    {user.classAdvisorAt && (
                      <>
                        <br />
                        {t("basicInfo.classAdvisorAt", {
                          classAdvisorAt: user.classAdvisorAt.number,
                        })}
                      </>
                    )}
                  </>
                ) : (
                  t("basicInfo.classAndNo", {
                    class: user.class.number,
                    classNo: user.classNo,
                  })
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

const AccountDetails: NextPage<{ user: Student | Teacher }> = ({ user }) => {
  const { t } = useTranslation("account");

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{
              title: t("title"),
            }}
            pageIcon={<MaterialIcon icon="account_circle" />}
            backGoesTo={user.role == "teacher" ? "/teach" : "/learn"}
            LinkElement={Link}
          />
        }
      >
        <BasicInfoSection user={user} />
      </RegularLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const { data: user } = await getUserFromReq(req);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
      ])),
      user,
    },
  };
};

export default AccountDetails;
