// Imports
import BrandIcon from "@/components/icons/BrandIcon";
import TeachersField from "@/components/person/TeachersField";
import SnackbarContext from "@/contexts/SnackbarContext";
import { createClassroomSubject } from "@/utils/backend/subject/createClassroomSubject";
import { updateClassroomSubject } from "@/utils/backend/subject/updateClassroomSubject";
import useForm from "@/utils/helpers/useForm";
import useLoggedInPerson from "@/utils/helpers/useLoggedInPerson";
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
} from "@/utils/types/common";
import { DialogFC } from "@/utils/types/component";
import { Teacher } from "@/utils/types/person";
import { ClassroomSubject } from "@/utils/types/subject";
import {
  Button,
  Columns,
  FullscreenDialog,
  Section,
  Snackbar,
  TextField,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Trans, useTranslation } from "next-i18next";
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
  const { t } = useTranslation("teach", {
    keyPrefix: "dialog.roomSubject.people",
  });

  return (
    <Section
      element={(props) => (
        <section {...props} aria-labelledby="header-people" />
      )}
    >
      <h2 id="header-people" className="skc-title-large">
        {t("title")}
      </h2>
      <p className="skc-body-medium pb-3">{t("desc")}</p>
      <div className="flex flex-col gap-6">
        <TeachersField
          label={t("teachers")}
          teachers={form.teachers}
          onChange={(teachers) => setForm({ ...form, teachers })}
        />
        <TeachersField
          label={t("coTeachers")}
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
  const { t } = useTranslation("teach", {
    keyPrefix: "dialog.roomSubject.google",
  });

  return (
    <Section
      element={(props) => (
        <section {...props} aria-labelledby="header-google" />
      )}
    >
      <h2 id="header-google" className="skc-title-large">
        <BrandIcon icon="google" className="inline-block" /> {t("title")}
      </h2>
      <p className="skc-body-medium pb-3">
        <Trans
          i18nKey="dialog.roomSubject.google.desc"
          ns="teach"
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
      </p>

      {/* Fields */}
      <Columns columns={2} className="!gap-y-9">
        {/* GGC code */}
        <TextField
          appearance="outlined"
          label={t("ggcCode")}
          helperMsg={
            <Trans
              i18nKey="dialog.roomSubject.google.ggcCode_helper"
              ns="teach"
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
          label={t("ggcLink")}
          helperMsg={
            <Trans
              i18nKey="dialog.roomSubject.google.ggcLink_helper"
              ns="teach"
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
          label={t("ggMeetLink")}
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
 * @param open If the Full-screen Dialog is open and shown.
 * @param onClose Triggers when the Full-screen Dialog is closed.
 * @param onSubmit Triggers when the Room Subject is done being added/edited. This returns no data, but expects a reload.
 * @param data Existing data for a Room Subject, for editing.
 * @param subject The Subject of the Subject Classes Dialog that triggered this Dialog.
 *
 * @returns A Full-screen Dialog.
 */
// const ClassroomSubjectDialog: SubmittableDialogComponent<
//   () => void,
//   { data?: SubjectListItem; subject: SubjectWNameAndCode }
// > = ({ open, onClose, onSubmit, data, subject }) => {
const ClassroomSubjectDialog: DialogFC<{
  data?: ClassroomSubject;
  subjectID: string;
  onSubmit: () => void;
}> = ({ open, data, subjectID, onClose, onSubmit }) => {
  const { t } = useTranslation("teach", { keyPrefix: "dialog.roomSubject" });
  const { t: tx } = useTranslation("common");

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
  const { person: user } = useLoggedInPerson();

  // Teachers Chip Field default if in add mode
  useEffect(() => {
    if (!open || data) return;
    resetForm();
    // If the Teacher is fetched, insert it into the Teachers Chip Field
    if (user) setForm({ ...form, teachers: [user] });
    return;
  }, [open, user]);

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
          setSnackbar(<Snackbar>{tx("snackbar.formInvalid")}</Snackbar>);
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
          setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
          return false;
        }

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
