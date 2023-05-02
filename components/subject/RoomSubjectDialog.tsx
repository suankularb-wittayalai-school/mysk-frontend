// External libraries
import { useTranslation } from "next-i18next";
import { FC, useContext, useState } from "react";

// SK Components
import {
  Button,
  ChipField,
  ChipSet,
  Columns,
  FullscreenDialog,
  InputChip,
  Section,
  Snackbar,
  TextField,
} from "@suankularb-components/react";

// Internal components
import BrandIcon from "@/components/icons/BrandIcon";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Helpers
import { withLoading } from "@/utils/helpers/loading";
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useForm } from "@/utils/hooks/form";
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import {
  FormControlProps,
  FormControlValues,
  SubmittableDialogComponent,
} from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";

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
  const locale = useLocale();

  // Form control
  const [teacherField, setTeacherField] = useState<string>("");
  const [coTeacherField, setCoTeacherField] = useState<string>("");

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
        <ChipField
          label="Teachers"
          value={teacherField}
          onChange={setTeacherField}
          onNewEntry={() => {}}
          onDeleteLast={() => {}}
          placeholder="Enter first name"
        >
          <ChipSet>
            {form.teachers.map((teacher: Teacher) => (
              <InputChip key={teacher.id}>
                {nameJoiner(locale, teacher.name)}
              </InputChip>
            ))}
          </ChipSet>
        </ChipField>
        <ChipField
          label="Co-teachers"
          value={coTeacherField}
          onChange={setCoTeacherField}
          placeholder="Enter first name"
        >
          <ChipSet>
            {form.coTeachers.map((teacher: Teacher) => (
              <InputChip key={teacher.id}>
                {nameJoiner(locale, teacher.name)}
              </InputChip>
            ))}
          </ChipSet>
        </ChipField>
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
  formProps: FormControlProps<"ggcCode" | "ggcLink" | "ggMeet">;
}> = ({ formProps }) => {
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
          {...formProps.ggMeet}
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
 * 
 * @returns A Full-screen Dialog.
 */
const RoomSubjectDialog: SubmittableDialogComponent = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation(["teach", "common"]);

  const { setSnackbar } = useContext(SnackbarContext);

  const { form, setForm, formOK, formProps } = useForm<
    "class" | "teachers" | "coTeachers" | "ggcCode" | "ggcLink" | "ggMeet"
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
    { key: "ggMeet", validate: (value: string) => ggMeetLinkRegex.test(value) },
  ]);

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

        // TODO
        
        // (Simulated wait)
        await new Promise((resolve) => setTimeout(resolve, 200));

        onSubmit();
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }

  return (
    <FullscreenDialog
      open={open}
      title="Add a class to subject"
      action={
        <Button
          appearance="text"
          onClick={handleSubmit}
          loading={loading || undefined}
        >
          Add
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
