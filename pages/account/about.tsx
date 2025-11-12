import ProfileLayout from "@/components/account/ProfileLayout";
import AboutHeader from "@/components/account/about/AboutHeader";
import NameChangeDialog from "@/components/account/about/NameChangeDialog";
import PersonFields, {
  PersonFieldsKey,
} from "@/components/account/about/PersonFields";
import SnackbarContext from "@/contexts/SnackbarContext";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import { updatePerson } from "@/utils/backend/person/updatePerson";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import cn from "@/utils/helpers/cn";
import useForm from "@/utils/helpers/useForm";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { pantsSizeRegex } from "@/utils/patterns";
import { CustomPage } from "@/utils/types/common";
import { Student, Teacher, UserRole } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";
import {
  Actions,
  Button,
  Divider,
  Snackbar,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useContext, useState } from "react";

/**
 * The About You page lets the user view and edit their personal information
 * like their name, birthday, and allergies.
 *
 * @param user The Person to display the information of. Should be of the currently logged in user.
 * @param subjectGroups The list of all Subject Groups.
 */
const AboutYouPage: CustomPage<{
  user: Student | Teacher;
  subjectGroups: SubjectGroup[];
}> = ({ user, subjectGroups }) => {
  const { t } = useTranslation("account/about");

  const { setSnackbar } = useContext(SnackbarContext);
  const refreshProps = useRefreshProps();
  const supabase = useSupabaseClient();

  const [nameChangeOpen, setNameChangeOpen] = useState(false);

  const [loading, toggleLoading] = useToggle();

  // Form control
  const { form, setForm, openFormSnackbar, formOK, formProps } =
    useForm<PersonFieldsKey>([
      {
        key: "prefixTH",
        required: true,
        defaultValue: user.prefix.th,
      },
      {
        key: "firstNameTH",
        required: true,
        defaultValue: user.first_name.th,
      },
      { key: "middleNameTH", defaultValue: user.middle_name?.th },
      {
        key: "lastNameTH",
        required: true,
        defaultValue: user.last_name.th,
      },
      { key: "nicknameTH", defaultValue: user.nickname?.th },
      {
        key: "prefixEN",
        required: true,
        defaultValue: user.prefix["en-US"],
      },
      {
        key: "firstNameEN",
        required: true,
        defaultValue: user.first_name["en-US"],
      },
      { key: "middleNameEN", defaultValue: user.middle_name?.["en-US"] },
      {
        key: "lastNameEN",
        required: true,
        defaultValue: user.last_name["en-US"],
      },
      { key: "nicknameEN", defaultValue: user.nickname?.["en-US"] },
      {
        key: "subjectGroup",
        defaultValue:
          user.role === UserRole.teacher && subjectGroups.length > 0
            ? user.subject_group.id || subjectGroups[0].id
            : undefined,
      },
      {
        key: "classAdvisorAt",
        defaultValue:
          user.role === UserRole.teacher && user.class_advisor_at
            ? String(user.class_advisor_at.number)
            : undefined,
      },
      { key: "birthdate", required: true, defaultValue: user.birthdate },
      { key: "allergies", defaultValue: user.allergies },
      {
        key: "healthProblem",
        defaultValue:
          user.role === UserRole.student ? user.health_problem : undefined,
      },
      { key: "shirtSize", defaultValue: user.shirt_size },
      {
        key: "pantsSize",
        defaultValue: user.pants_size,
        validate: (value: string) => pantsSizeRegex.test(value),
      },
    ]);

  /**
   * Saves the user’s information on the database.
   */
  async function handleSave() {
    openFormSnackbar();
    if (!formOK) return;
    withLoading(
      async () => {
        const { error } = await updatePerson(supabase, form, user);

        if (error) {
          setSnackbar(<Snackbar>{t("common:snackbar.failure")}</Snackbar>);
          return false;
        }

        await refreshProps();
        setSnackbar(<Snackbar>{t("common:snackbar.changesSaved")}</Snackbar>);
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  return (
    <>
      <Head>
        <title>{t("common:tabName", { tabName: t("title") })}</title>
      </Head>
      <ProfileLayout title={t("title")}>
        <AboutHeader
          person={user}
          onSave={handleSave}
          loading={loading}
          className="absolute inset-0 bottom-auto top-0 z-[70]"
        />
        <div
          // The About Header component has different heights for different
          // screen sizes, represented here by the `--header-height` CSS
          // variable.
          // Using this variable, we can add the appropriate padding to the top
          // of the form and the appropriately position the fade-out mask.
          className={cn(
            `h-full space-y-6 overflow-y-auto pb-9 pt-[calc(var(--header-height)+2rem)] [--header-height:7.125rem] [mask-image:linear-gradient(to_bottom,transparent_var(--header-height),black_calc(var(--header-height)+2rem))] sm:px-0 md:[--header-height:4rem]`,
          )}
        >
          {/* {user.role === UserRole.student && (
            <CertficateAnnouncementBanner className="!hidden sm:!block" />
          )} */}

          <PersonFields
            form={form}
            setForm={setForm}
            formProps={formProps}
            subjectGroups={subjectGroups}
            role={user.role}
          />

          {user.role === UserRole.student && (
            <>
              <Divider className="my-6" />
              <Actions align="center" className="!grid !grid-cols-1 sm:!flex">
                <Button
                  appearance="tonal"
                  onClick={() => setNameChangeOpen(true)}
                >
                  {t("action.changeName")}
                </Button>
              </Actions>
            </>
          )}
        </div>
      </ProfileLayout>
      <NameChangeDialog
        open={nameChangeOpen}
        person={user}
        onClose={() => setNameChangeOpen(false)}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const mysk = await createMySKClient(req);
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const { data: user } = await getLoggedInPerson(supabase, mysk, {
    detailed: true,
  });

  const { data: subjectGroups } = await getSubjectGroups(supabase);

  return { props: { user, subjectGroups } };
};

export default AboutYouPage;
