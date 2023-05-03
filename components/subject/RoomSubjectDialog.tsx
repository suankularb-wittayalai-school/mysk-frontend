// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { useTranslation } from "next-i18next";
import { FC, useContext, useEffect } from "react";

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
  const { t } = useTranslation("teach");

  return (
    <Section sectionAttr={{ "aria-labelledby": "header-people" }}>
      <h2 id="header-people" className="skc-title-large">
        People
      </h2>
      <p className="skc-body-medium pb-3">
        Add other teachers and co-teachers that also teach this subject to this
        class. They will also see this class in their list.
      </p>
      <div className="flex flex-col gap-6">
        <TeachersField
          label="Teachers"
          teachers={form.teachers}
          onChange={(teachers) => setForm({ ...form, teachers })}
        />
        <TeachersField
          label="Co-teachers"
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
  const { t } = useTranslation("teach");

  return (
    <Section sectionAttr={{ "aria-labelledby": "header-google" }}>
      <h2 id="header-google" className="skc-title-large">
        <BrandIcon icon="google" className="inline-block" /> Google services
      </h2>
      <p className="skc-body-medium pb-3">
        <a
          href="https://support.google.com/edu/classroom/answer/6020273"
          target="_blank"
          rel="noreferrer"
          className="link"
        >
          Create a class
        </a>{" "}
        on Google Classroom first. Then, enter information related to that class
        to let students find your class via MySK.
      </p>

      {/* Fields */}
      <Columns columns={2} className="!gap-y-9">
        {/* GGC code */}
        <TextField
          appearance="outlined"
          label="Google Classroom code"
          helperMsg={
            <>
              Learn{" "}
              <a
                href="https://support.google.com/edu/classroom/answer/6020282#zippy=%2Cinvite-students-with-a-class-code"
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                how to get the code
              </a>
              .
            </>
          }
          {...formProps.ggcCode}
        />

        {/* GGC link */}
        <TextField
          appearance="outlined"
          label="Google Classroom link"
          helperMsg={
            <>
              Learn{" "}
              <a
                href="https://support.google.com/edu/classroom/answer/6020282#zippy=%2Cinvite-students-with-an-invite-link"
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                how to get the link
              </a>
              .
            </>
          }
          className="sm:col-span-2"
          {...formProps.ggcLink}
        />

        {/* Google Meet link */}
        <TextField
          appearance="outlined"
          label="Google Meet link"
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
  const { t } = useTranslation(["teach", "common"]);

  const { setSnackbar } = useContext(SnackbarContext);

  const { form, setForm, resetForm, formOK, formProps } = useForm<
    "class" | "teachers" | "coTeachers" | "ggcCode" | "ggcLink" | "ggMeetLink"
  >([
    { key: "class", validate: (value: string) => classRegex.test(value) },
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

  useEffect(() => {
    if (!data) {
      resetForm();
      return;
    }
    setForm({
      class: String(data.classroom.number),
      teachers: data.teachers,
      coTeachers: data.coTeachers || [],
      ggcCode: data.ggcCode || "",
      ggcLink: data.ggcLink || "",
      ggMeetLink: data.ggMeetLink || "",
    });
  }, [data]);

  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();

  /**
   * Validate the form, create Room Subjects, and close the Full-screen Dialog.
   */
  async function handleSubmit() {
    withLoading(
      async () => {
        if (!formOK) {
          setSnackbar(
            <Snackbar>{t("snackbar.formInvalid", { ns: "common" })}</Snackbar>
          );
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
          setSnackbar(
            <Snackbar>{t("snackbar.failure", { ns: "common" })}</Snackbar>
          );
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
      title={data ? "Edit class of subject" : "Add a class to subject"}
      action={
        <Button
          appearance="text"
          onClick={handleSubmit}
          loading={loading || undefined}
        >
          {data ? "Save" : "Add"}
        </Button>
      }
      width={580}
      onClose={onClose}
      className="[&>*]:!gap-y-6"
    >
      <Columns columns={2} className="!gap-y-9 pb-5">
        <TextField
          appearance="outlined"
          label="Class"
          helperMsg="The class you’re teaching this subject to."
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
