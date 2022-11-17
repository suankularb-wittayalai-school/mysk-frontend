// External libraries
import { motion } from "framer-motion";

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
  Search,
  Section,
  Title,
} from "@suankularb-components/react";

// Components
import BlockingPane from "@components/BlockingPane";
import SubjectCard from "@components/SubjectCard";
import LogOutDialog from "@components/dialogs/LogOut";
import AddSubjectDialog from "@components/dialogs/AddSubject";
import Schedule from "@components/schedule/Schedule";

// Animations
import { animationTransition } from "@utils/animations/config";

// Backend
import { getSchedule } from "@utils/backend/schedule/schedule";
import { getTeachingSubjects } from "@utils/backend/subject/subject";

// Types
import { LangCode } from "@utils/types/common";
import { Schedule as ScheduleType } from "@utils/types/schedule";
import { SubjectWNameAndCode } from "@utils/types/subject";
import { ClassWNumber } from "@utils/types/class";

// Helpers
import { createTitleStr } from "@utils/helpers/title";

// Hooks
import { useToggle } from "@utils/hooks/toggle";
import { Database } from "@utils/types/supabase";
import { getLocalePath } from "@utils/helpers/i18n";

const ScheduleSection = ({
  schedule,
  disabled,
}: {
  schedule: ScheduleType;
  disabled?: boolean;
}): JSX.Element => {
  const { t } = useTranslation("teach");

  return (
    <Section className="relative">
      <BlockingPane
        icon={<MaterialIcon icon="block" allowCustomSize />}
        text={t("schedule.blocked")}
        show={disabled}
      />
      <Header
        icon={<MaterialIcon icon="dashboard" allowCustomSize />}
        text={t("schedule.title")}
      />
      <Schedule schedule={schedule} role="teacher" />
      <Actions>
        <LinkButton
          label={t("schedule.action.enterEditMode")}
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

const SubjectsYouTeachSection = ({
  subjects,
  toggleShowAdd,
}: {
  subjects: (SubjectWNameAndCode & { classes: ClassWNumber[] })[];
  toggleShowAdd: () => void;
}): JSX.Element => {
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

  const { data: user, error } = await supabase
    .from("users")
    .select("teacher(id), onboarded")
    .match({ id: session?.user.id })
    .limit(1)
    .single();

  if (error) console.error(error);
  if (!user!.onboarded)
    return {
      redirect: {
        destination: getLocalePath("/welcome", locale as LangCode),
        permanent: false,
      },
    };

  const teacherID = (
    user!.teacher as Database["public"]["Tables"]["teacher"]["Row"]
  ).id;

  const { data: schedule } = await getSchedule(supabase, "teacher", teacherID);

  const { data: subjects } = await getTeachingSubjects(supabase, teacherID);

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
