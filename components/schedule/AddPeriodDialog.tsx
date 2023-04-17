// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

// SK Components
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  FormGroup,
  FormItem,
  Radio,
  Snackbar,
  TextField,
} from "@suankularb-components/react";

// Contexts
import ScheduleContext from "@/contexts/ScheduleContext";
import SnackbarContext from "@/contexts/SnackbarContext";

// Backend
import { createScheduleItem } from "@/utils/backend/schedule/schedule";

// Helpers
import { getLocaleObj } from "@/utils/helpers/i18n";
import { withLoading } from "@/utils/helpers/loading";
import {
  getSubjectName,
  periodDurationToWidth,
} from "@/utils/helpers/schedule";

// Hooks
import { useForm } from "@/utils/hooks/form";
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { SubmittableDialogComponent } from "@/utils/types/common";
import { SubjectWNameAndCode } from "@/utils/types/subject";

// Miscellaneous
import { classRegex, roomRegex } from "@/utils/patterns";

const AddPeriodDialog: SubmittableDialogComponent<
  () => void,
  { subject: SubjectWNameAndCode }
> = ({ open, subject, onClose, onSubmit }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation(["schedule", "common"]);

  // Router
  const router = useRouter();

  // Supabase
  const supabase = useSupabaseClient();

  // Snackbar
  const { setSnackbar } = useContext(SnackbarContext);

  // Context
  const { teacherID, additionSite } = useContext(ScheduleContext);

  // Form control
  const { form, setForm, resetForm, formOK, formProps } = useForm<
    "class" | "room" | "duration"
  >([
    {
      key: "class",
      required: true,
      validate: (value: string) => classRegex.test(value),
    },
    { key: "room", validate: (value: string) => roomRegex.test(value) },
    { key: "duration", defaultValue: 1 },
  ]);

  // Form submission
  const [loading, toggleLoading] = useToggle();
  async function handleSubmit() {
    if (!formOK) {
      setSnackbar(
        <Snackbar>{t("snackbar.formInvalid", { ns: "common" })}</Snackbar>
      );
      return;
    }

    await withLoading(
      async () => {
        const { error } = await createScheduleItem(
          supabase,
          {
            ...form,
            subject: subject.id,
            ...additionSite!,
          },
          teacherID!
        );

        if (error) {
          setSnackbar(
            <Snackbar>{t("snackbar.failure", { ns: "common" })}</Snackbar>
          );
          return false;
        }

        await router.replace(router.asPath);
        onSubmit();
        resetForm();

        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }

  return (
    <Dialog
      open={open}
      width={360}
      onClose={onClose}
      className="[&_.skc-text-field\_\_label]:!bg-surface-3"
    >
      <DialogHeader
        title={t("dialog.editPeriod.title.add")}
        desc={t("dialog.editPeriod.addDesc", {
          subject: getLocaleObj(subject.name, locale).name,
          day: t(`datetime.day.${additionSite?.day}`, { ns: "common" }),
          startTime: additionSite?.startTime,
        })}
      />
      <DialogContent>
        <div className="flex flex-col gap-y-6 px-6">
          <div
            className="grid grid-cols-[6rem,1fr] gap-4"
            style={{
              gridTemplateColumns: `${periodDurationToWidth(
                form.duration
              )}px 1fr`,
            }}
          >
            {/* Preview period */}
            <div
              className="flex flex-col rounded-sm bg-secondary
                px-4 py-2 text-on-secondary dark:bg-secondary-container
                dark:text-on-secondary-container"
            >
              <span className="skc-title-medium truncate">
                {t("class", {
                  ns: "common",
                  number: (form.class as string).padEnd(3, "_"),
                })}
              </span>
              <span className="skc-body-small">
                {getSubjectName(form.duration, subject.name, locale)}
              </span>
            </div>

            {/* Class */}
            <TextField
              appearance="outlined"
              label={t("dialog.editPeriod.form.class")}
              {...formProps.class}
            />
          </div>

          {/* Room code */}
          <TextField
            appearance="outlined"
            label={t("dialog.editPeriod.form.room")}
            helperMsg={t("dialog.editPeriod.form.room_helper")}
            {...formProps.room}
          />

          {/* Period duration */}
          <FormGroup label={t("dialog.editPeriod.form.duration.label")}>
            <FormItem label={t("dialog.editPeriod.form.duration.single")}>
              <Radio
                value={form.duration === 1}
                onChange={(value) => value && setForm({ ...form, duration: 1 })}
              />
            </FormItem>
            <FormItem label={t("dialog.editPeriod.form.duration.double")}>
              <Radio
                disabled={additionSite?.startTime === 10}
                value={form.duration === 2}
                onChange={(value) => value && setForm({ ...form, duration: 2 })}
              />
            </FormItem>
          </FormGroup>
        </div>
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("dialog.editPeriod.action.cancel")}
        </Button>
        <Button
          appearance="text"
          loading={loading || undefined}
          onClick={handleSubmit}
        >
          {t("dialog.editPeriod.action.save")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default AddPeriodDialog;
