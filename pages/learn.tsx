// External libraries
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC, useState } from "react";

// SK Components
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  Search,
  Section,
} from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";
import BrandIcon from "@/components/icons/BrandIcon";
import HoverList from "@/components/person/HoverList";
import Schedule from "@/components/schedule/Schedule";

// Backend
import {
  getClassIDFromNumber,
  getClassNumberFromUser,
} from "@/utils/backend/classroom/classroom";
import { getSchedule } from "@/utils/backend/schedule/schedule";
import { getSubjectList } from "@/utils/backend/subject/roomSubject";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { SubjectListItem, SubjectName } from "@/utils/types/subject";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";
import { getLocaleObj, getLocaleString } from "@/utils/helpers/i18n";
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const ScheduleSection: FC<{ schedule: ScheduleType }> = ({ schedule }) => {
  const { t } = useTranslation("learn");

  return (
    <Section>
      <Header>{t("schedule")}</Header>
      <Schedule schedule={schedule} role="student" />
    </Section>
  );
};

const SubjectListSection: FC<{ subjectList: SubjectListItem[] }> = ({
  subjectList,
}) => {
  const { t } = useTranslation("schedule");
  const locale = useLocale();

  const [query, setQuery] = useState<string>("");

  return (
    <Section>
      <Columns columns={3} className="!items-end">
        <Header className="md:col-span-2">{t("subjectList.title")}</Header>
        <Search
          alt={t("subjectList.search")}
          value={query}
          locale={locale}
          onChange={setQuery}
        />
      </Columns>
      <Columns columns={3}>
        {(query
          ? subjectList.filter(
              (listItem) =>
                (
                  getLocaleObj(listItem.subject.name, locale) as SubjectName
                ).name.includes(query) ||
                getLocaleString(listItem.subject.code, locale).includes(
                  query
                ) ||
                listItem.teachers.filter((teacher) =>
                  nameJoiner(locale, teacher.name).includes(query)
                ).length
            )
          : subjectList
        ).map((listItem) => (
          <Card key={listItem.id} appearance="outlined">
            <div className="flex flex-row">
              <CardHeader
                title={
                  (getLocaleObj(listItem.subject.name, locale) as SubjectName)
                    .name
                }
                subtitle={getLocaleString(listItem.subject.code, locale)}
                className="grow truncate break-all"
              />
              <div className="flex flex-row items-center px-4">
                <Button
                  appearance="text"
                  icon={<BrandIcon icon="gg-meet" />}
                  href={listItem.ggMeetLink}
                  disabled={!listItem.ggMeetLink}
                />
                <Button
                  appearance="text"
                  icon={<BrandIcon icon="gg-classroom" />}
                  href={listItem.ggcLink}
                  disabled={!listItem.ggcLink}
                />
              </div>
            </div>
            <CardContent>
              <Columns columns={2}>
                <div
                  className={
                    listItem.teachers.length === 1 ? "truncate" : undefined
                  }
                >
                  <h4 className="skc-title-medium">
                    {t("subjectList.card.teachers")}
                  </h4>
                  <span className="skc-body-medium break-all">
                    <HoverList
                      people={listItem.teachers}
                      useFullName={listItem.teachers.length === 1}
                    />
                  </span>
                </div>
                {listItem.ggcCode && (
                  <div>
                    <h4 className="skc-title-medium">Class code</h4>
                    <span className="skc-body-medium !font-mono">
                      {listItem.ggcCode}
                    </span>
                  </div>
                )}
              </Columns>
            </CardContent>
          </Card>
        ))}
      </Columns>
    </Section>
  );
};

const LearnPage: CustomPage<{
  schedule: ScheduleType;
  subjectList: SubjectListItem[];
}> = ({ schedule, subjectList }) => {
  const { t } = useTranslation("learn");

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <MySKPageHeader
        title={t("title")}
        icon={<MaterialIcon icon="school" />}
      />
      <ContentLayout>
        <ScheduleSection schedule={schedule} />
        <SubjectListSection subjectList={subjectList} />
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

  const { data: classNumber } = await getClassNumberFromUser(
    supabase,
    session!.user
  );
  const { data: classID } = await getClassIDFromNumber(supabase, classNumber!);
  const { data: schedule } = await getSchedule(supabase, "student", classID!);
  const { data: subjectList } = await getSubjectList(supabase, classID!);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "learn",
        "schedule",
      ])),
      schedule,
      subjectList,
    },
  };
};

LearnPage.pageRole = "student";

export default LearnPage;
