import BrandIcon from "@/components/icons/BrandIcon";
import TeachersField from "@/components/person/TeachersField";
import SnackbarContext from "@/contexts/SnackbarContext";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { createClassroomSubject } from "@/utils/backend/subject/createClassroomSubject";
import { updateClassroomSubject } from "@/utils/backend/subject/updateClassroomSubject";
import useForm from "@/utils/helpers/useForm";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import {
  classRegex,
  ggMeetLinkRegex,
  ggcCodeRegex,
  ggcLinkRegex,
} from "@/utils/patterns";
import {
  FormControlProps,
  FormControlValues,
  StylableFC,
} from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import { ClassroomSubject } from "@/utils/types/subject";
import {
  Button,
  Columns,
  FullscreenDialog,
  Section,
  Snackbar,
  Text,
  TextField,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { usePlausible } from "next-plausible";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect } from "react";

/**
 * Teachers and Co-teachers.
 *
 * @param form Form Control Props for this Section.
 * @param setForm A setter for Form Control Props for this Section.
 *
 * @returns A Section.
 */
const PeopleSection: FC<{
  form: FormControlValues<"teachers" | "coTeachers">;
  setForm: (form: FormControlValues<"teachers" | "coTeachers">) => void;
}> = ({ form, setForm }) => {
  const { t } = useTranslation("home/classroomSubjectDialog");

  return (
    <Section
      element={(props) => (
        <section {...props} aria-labelledby="header-people" />
      )}
    >
      <Text
        type="title-large"
        element={(props) => <h2 id="header-people" {...props} />}
      >
        {t("people.title")}
      </Text>
      <Text type="body-medium" element="p" className="pb-3">
        {t("people.desc")}
      </Text>
      <div className="flex flex-col gap-6">
        <TeachersField
          label={t("people.teachers")}
          teachers={form.teachers}
          onChange={(teachers) => setForm({ ...form, teachers })}
        />
        <TeachersField
          label={t("people.coTeachers")}
          teachers={form.coTeachers}
          onChange={(coTeachers) => setForm({ ...form, coTeachers })}
        />
      </div>
    </Section>
  );
};

/**
 * Google Classroom code, Google Classroom link, and Google Meet link.
 *
 * @param formProps Form Control Props for this Section.
 *
 * @returns A Section.
 */
const GoogleSection: FC<{
  formProps: FormControlProps<"ggcCode" | "ggcLink" | "ggMeetLink">;
}> = ({ formProps }) => {
  const { t } = useTranslation("home/classroomSubjectDialog");

  return (
    <Section
      element={(props) => (
        <section {...props} aria-labelledby="header-google" />
      )}
    >
      <Text
        type="title-large"
        element={(props) => <h2 id="header-google" {...props} />}
      >
        <BrandIcon icon="google" className="inline-block" /> {t("google.title")}
      </Text>
      <Text type="body-medium" element="p" className="pb-3">
        <Trans
          i18nKey="home/classroomSubjectDialog:google.desc"
          components={{
            a: (
              <a
                href="https://support.google.com/edu/classroom/answer/6020273"
                target="_blank"
                rel="noreferrer"
                className="link"
              />
            ),
          }}
        />
      </Text>

      {/* Fields */}
      <Columns columns={2} className="!gap-y-9">
        {/* GGC code */}
        <TextField
          appearance="outlined"
          label={t("google.ggcCode")}
          helperMsg={
            <Trans
              i18nKey="home/classroomSubjectDialog:google.ggcCode_helper"
              components={{
                a: (
                  <a
                    href="https://support.google.com/edu/classroom/answer/6020282#zippy=%2Cinvite-students-with-a-class-code"
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  />
                ),
              }}
            />
          }
          {...formProps.ggcCode}
        />

        {/* GGC link */}
        <TextField
          appearance="outlined"
          label={t("google.ggcLink")}
          helperMsg={
            <Trans
              i18nKey="home/classroomSubjectDialog:google.ggcLink_helper"
              components={{
                a: (
                  <a
                    href="https://support.google.com/edu/classroom/answer/6020282#zippy=%2Cinvite-students-with-a-class-code"
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  />
                ),
              }}
            />
          }
          className="sm:col-span-2"
          {...formProps.ggcLink}
        />

        {/* Google Meet link */}
        <TextField
          appearance="outlined"
          label={t("google.ggMeetLink")}
          className="sm:col-span-2"
          {...formProps.ggMeetLink}
        />
      </Columns>
    </Section>
  );
};

/**
 * Allows the user to add or edit a Class to a Subject they teach (an
 * abstraction of editing a Room Subject).
 *
 * @param data Existing data for a Room Subject, for editing.
 * @param subjectID The Subject ID of the Subject Classes Dialog that triggered this Dialog.
 * @param open If the Full-screen Dialog is open and shown.
 * @param onClose Triggers when the Full-screen Dialog is closed.
 * @param onSubmit Triggers when the Room Subject is done being added/edited. This returns no data, but expects a reload.
 */
const ClassroomSubjectDialog: StylableFC<{
  data?: ClassroomSubject;
  subjectID: string;
  open?: boolean;
  onClose: () => void;
  onSubmit: () => void;
}> = ({ open, data, subjectID, onClose, onSubmit }) => {
  const { t } = useTranslation("home/classroomSubjectDialog");

  const plausible = usePlausible();
  const { setSnackbar } = useContext(SnackbarContext);

  const { form, setForm, resetForm, formOK, formProps } = useForm<
    "class" | "teachers" | "coTeachers" | "ggcCode" | "ggcLink" | "ggMeetLink"
  >([
    {
      key: "class",
      validate: (value: string) => classRegex.test(value),
      required: true,
    },
    {
      key: "teachers",
      defaultValue: [],
      validate: (value: Teacher[]) => value.length !== 0,
    },
    { key: "coTeachers", defaultValue: [] },
    { key: "ggcCode", validate: (value: string) => ggcCodeRegex.test(value) },
    { key: "ggcLink", validate: (value: string) => ggcLinkRegex.test(value) },
    {
      key: "ggMeetLink",
      validate: (value: string) => ggMeetLinkRegex.test(value),
    },
  ]);

  // Fetch the Teacher that is the user
  const supabase = useSupabaseClient();
  const mysk = useMySKClient();

  // Teachers Chip Field default if in add mode
  useEffect(() => {
    if (!open || data) return;
    resetForm();
    // If the Teacher is fetched, insert it into the Teachers Chip Field
    if (mysk.person) setForm({ ...form, teachers: [mysk.person] });
    return;
  }, [open, mysk.person]);

  // Populate form with data if in edit mode
  useEffect(() => {
    if (!data) return;
    setForm({
      class: String(data.classroom.number),
      teachers: data.teachers,
      coTeachers: data.co_teachers || [],
      ggcCode: data.ggc_code || "",
      ggcLink: data.ggc_link || "",
      ggMeetLink: data.gg_meet_link || "",
    });
  }, [data]);

  const [loading, toggleLoading] = useToggle();

  /**
   * Validate the form, create Room Subjects, and close the Full-screen Dialog.
   */
  async function handleSubmit() {
    withLoading(
      async () => {
        if (!formOK) {
          setSnackbar(<Snackbar>{t("common:snackbar.formInvalid")}</Snackbar>);
          return false;
        }

        let hasError = false;
        const classroomSubject: Parameters<typeof createClassroomSubject>["1"] =
          {
            classroom: { number: form.class },
            subject: { id: subjectID },
            teachers: form.teachers,
            co_teachers: form.coTeachers,
            ggc_code: form.ggcCode,
            ggc_link: form.ggcLink,
            gg_meet_link: form.ggMeetLink,
          };

        // Add mode
        if (!data) {
          const { error } = await createClassroomSubject(
            supabase,
            classroomSubject,
          );
          hasError = error !== null;
        }

        // Edit mode
        else {
          const { error } = await updateClassroomSubject(supabase, {
            id: data.id,
            ...classroomSubject,
          });
          hasError = error !== null;
        }

        if (hasError) {
          setSnackbar(<Snackbar>{t("common:snackbar.failure")}</Snackbar>);
          return false;
        }

        plausible("Save Classroom-Subject Connection");

        onSubmit();
        resetForm();

        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  return (
    <FullscreenDialog
      open={open}
      title={data ? t("title.edit") : t("title.add")}
      action={
        <Button
          appearance="text"
          onClick={handleSubmit}
          loading={loading || undefined}
        >
          {data ? t("action.save") : t("action.add")}
        </Button>
      }
      width={580}
      onClose={onClose}
      className="[&>*]:!gap-y-6"
    >
      <Columns columns={2} className="!gap-y-9 pb-5">
        <TextField
          appearance="outlined"
          label={t("class")}
          helperMsg={t("class_helper")}
          {...formProps.class}
        />
      </Columns>
      <PeopleSection
        form={form}
        setForm={(partialForm) => setForm({ ...form, ...partialForm })}
      />
      <GoogleSection formProps={formProps} />
    </FullscreenDialog>
  );
};

export default ClassroomSubjectDialog;
