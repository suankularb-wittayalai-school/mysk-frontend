// External libraries
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import { Trans, useTranslation } from "next-i18next";
import { FC, useContext, useEffect, useMemo } from "react";

// SK Components
import {
  Button,
  Columns,
  FullscreenDialog,
  Section,
  Snackbar,
  TextField,
} from "@suankularb-components/react";

// Internal components
import BrandIcon from "@/components/icons/BrandIcon";
import TeachersField from "@/components/person/TeachersField";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Backend
import {
  createRoomSubject,
  editRoomSubject,
} from "@/utils/backend/subject/roomSubject";

// Helpers
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useForm } from "@/utils/hooks/form";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import {
  FormControlProps,
  FormControlValues,
  SubmittableDialogComponent,
} from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import { SubjectListItem, SubjectWNameAndCode } from "@/utils/types/subject";

// Miscellaneous
import {
  classRegex,
  ggMeetLinkRegex,
  ggcCodeRegex,
  ggcLinkRegex,
} from "@/utils/patterns";
import { getPersonFromUser } from "@/utils/backend/person/person";

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
    <Section sectionAttr={{ "aria-labelledby": "header-people" }}>
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
    <Section sectionAttr={{ "aria-labelledby": "header-google" }}>
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
const RoomSubjectDialog: SubmittableDialogComponent<
  () => void,
  { data?: SubjectListItem; subject: SubjectWNameAndCode }
> = ({ open, onClose, onSubmit, data, subject }) => {
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
  const user = useUser();
  const supabase = useSupabaseClient();
  const userTeacher = useMemo(async () => {
    if (!user || data) return;
    const { data: teacher, error } = await getPersonFromUser(supabase, user);
    if (error) return null;
    return teacher as Teacher;
  }, [user?.id]);

  // Teachers Chip Field default if in add mode
  useEffect(() => {
    if (!open || data) return;
    resetForm();
    // If the Teacher is fetched, insert it into the Teachers Chip Field
    (async () => {
      if (await userTeacher)
        setForm({ ...form, teachers: [await userTeacher] });
    })();
    return;
  }, [open, userTeacher]);

  // Populate form with data if in edit mode
  useEffect(() => {
    if (!data) return;
    setForm({
      class: String(data.classroom.number),
      teachers: data.teachers,
      coTeachers: data.coTeachers || [],
      ggcCode: data.ggcCode || "",
      ggcLink: data.ggcLink || "",
      ggMeetLink: data.ggMeetLink || "",
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

        // Add mode
        if (!data) {
          const { error } = await createRoomSubject(supabase, {
            ...form,
            id: 0,
            subject,
            classroom: { id: 0, number: Number(form.class) },
          });
          hasError = error !== null;
        }

        // Edit mode
        else {
          const { error } = await editRoomSubject(supabase, {
            ...form,
            id: data.id,
            subject,
            classroom: { id: 0, number: Number(form.class) },
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
      { hasEndToggle: true }
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

export default RoomSubjectDialog;
