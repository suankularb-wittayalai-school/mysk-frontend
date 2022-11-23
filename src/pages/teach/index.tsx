// External libraries
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC } from "react";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardSupportingText,
  Header,
  LayoutGridCols,
  LinkButton,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import BlockingPane from "@components/BlockingPane";
import SubjectCard from "@components/SubjectCard";
import LogOutDialog from "@components/dialogs/LogOut";
import AddSubjectDialog from "@components/dialogs/AddSubject";
import Schedule from "@components/schedule/Schedule";

// Backend
import { getUserMetadata } from "@utils/backend/account";
import { getSchedule } from "@utils/backend/schedule/schedule";
import { getTeachingSubjects } from "@utils/backend/subject/subject";

// Types
import { LangCode } from "@utils/types/common";
import { Schedule as ScheduleType } from "@utils/types/schedule";
import { SubjectWNameAndCode } from "@utils/types/subject";
import { ClassWNumber } from "@utils/types/class";

// Helpers
import { getLocalePath } from "@utils/helpers/i18n";
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

const ScheduleSection: FC<{
  schedule: ScheduleType;
  disabled?: boolean;
}> = ({ schedule, disabled }): JSX.Element => {
  const { t } = useTranslation("teach");

  return (
    <Section className="relative !max-w-[81.5rem] items-center">
      <BlockingPane
        icon={<MaterialIcon icon="block" allowCustomSize />}
        text={t("schedule.blocked")}
        show={disabled}
      />
      <div className="w-full max-w-[70.5rem]">
        <Header
          icon={<MaterialIcon icon="dashboard" allowCustomSize />}
          text={t("schedule.title")}
        />
      </div>
      <Schedule schedule={schedule} role="teacher" />
      <Actions className="w-full max-w-[70.5rem]">
        <LinkButton
          label={t("schedule.action.edit")}
          type="outlined"
          icon={<MaterialIcon icon="edit" />}
          url="/teach/schedule"
          LinkElement={Link}
          disabled={disabled}
        />
      </Actions>
    </Section>
  );
};

const SubjectsYouTeachSection: FC<{
  subjects: (SubjectWNameAndCode & { classes: ClassWNumber[] })[];
  toggleShowAdd: () => void;
}> = ({ subjects, toggleShowAdd }): JSX.Element => {
  const { t } = useTranslation("teach");

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="library_books" allowCustomSize />}
        text={t("subjects.title")}
      />

      {subjects.length == 0 ? (
        // Guide the user on how to add subjects
        <div>
          <Card type="stacked" appearance="tonal">
            <CardHeader
              icon={<MaterialIcon icon="block" className="text-secondary" />}
              title={<h3>{t("subjects.noSubjects.title")}</h3>}
              label={t("subjects.noSubjects.subtitle")}
            />
            <CardSupportingText>
              {t("subjects.noSubjects.supportingText")}
            </CardSupportingText>
            <CardActions>
              <Button
                label={t("subjects.action.add")}
                type="filled"
                onClick={toggleShowAdd}
                className="w-full !text-center sm:w-fit"
              />
            </CardActions>
          </Card>
        </div>
      ) : (
        // List of subjects the user teaches
        <>
          <LayoutGridCols cols={3}>
            <ul className="contents">
              {subjects.map((subject) => (
                <li key={subject.id} className="contents">
                  <SubjectCard subject={subject} />
                </li>
              ))}
            </ul>
          </LayoutGridCols>
          <Actions>
            <Button
              label={t("subjects.action.add")}
              type="outlined"
              icon={<MaterialIcon icon="add" />}
              onClick={toggleShowAdd}
            />
          </Actions>
        </>
      )}
    </Section>
  );
};

const Teach: NextPage<{
  schedule: ScheduleType;
  subjects: (SubjectWNameAndCode & {
    classes: ClassWNumber[];
  })[];
}> = ({ schedule, subjects }) => {
  const { t } = useTranslation("teach");
  const router = useRouter();

  // Dialog controls
  const [showLogOut, toggleShowLogOut] = useToggle();
  const [showAdd, toggleShowAdd] = useToggle();

  return (
    <>
      <Head>
        <title>{createTitleStr(t("title"), t)}</title>
      </Head>
      <RegularLayout
        Title={
          <Title
            name={{ title: t("title") }}
            pageIcon={<MaterialIcon icon="school" />}
            backGoesTo={toggleShowLogOut}
            LinkElement={Link}
          />
        }
      >
        <ScheduleSection schedule={schedule} disabled={subjects.length == 0} />
        <SubjectsYouTeachSection
          subjects={subjects}
          toggleShowAdd={toggleShowAdd}
        />
      </RegularLayout>

      {/* Dialogs */}
      <LogOutDialog show={showLogOut} onClose={toggleShowLogOut} />
      <AddSubjectDialog
        show={showAdd}
        onClose={toggleShowAdd}
        onSubmit={() => {
          toggleShowAdd();
          router.replace(router.asPath);
        }}
      />
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

  const { data: metadata, error: metadataError } = await getUserMetadata(
    supabase,
    session!.user.id
  );
  if (metadataError) console.error(metadataError);

  if (!metadata?.onboarded)
    return {
      redirect: {
        destination: getLocalePath("/welcome", locale as LangCode),
        permanent: false,
      },
    };

  const { data: schedule } = await getSchedule(
    supabase,
    "teacher",
    metadata.teacher!
  );

  const { data: subjects } = await getTeachingSubjects(
    supabase,
    metadata.teacher!
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "teach",
        "schedule",
      ])),
      schedule,
      subjects,
    },
  };
};

export default Teach;
