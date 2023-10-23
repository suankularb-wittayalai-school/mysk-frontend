// Imports
import ClassroomsField from "@/components/classes/ClassroomsField";
import RoomsField from "@/components/room/RoomsField";
import ScheduleContext from "@/contexts/ScheduleContext";
import SnackbarContext from "@/contexts/SnackbarContext";
import createScheduleItem from "@/utils/backend/schedule/createScheduleItem";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import { getSubjectName } from "@/utils/helpers/getSubjectName";
import periodDurationToWidth from "@/utils/helpers/schedule/periodDurationToWidth";
import useForm from "@/utils/helpers/useForm";
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { roomRegex } from "@/utils/patterns";
import { Classroom } from "@/utils/types/classroom";
import { DialogFC } from "@/utils/types/component";
import { Subject } from "@/utils/types/subject";
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
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext } from "react";

const AddPeriodDialog: DialogFC<{
  subject: Pick<Subject, "id" | "name" | "short_name" | "code">;
  onSubmit: () => void;
}> = ({ open, subject, onClose, onSubmit }) => {
  const router = useRouter();
  const locale = useLocale();
  const { t } = useTranslation("schedule");
  const { t: tx } = useTranslation("common");

  const { duration, easing } = useAnimationConfig();
  const { teacherID, additionSite } = useContext(ScheduleContext);
  const { setSnackbar } = useContext(SnackbarContext);

  const supabase = useSupabaseClient();

  // Form control
  const { form, setForm, resetForm, formOK } = useForm<
    "classrooms" | "rooms" | "duration"
  >([
    {
      key: "classrooms",
      required: true,
      defaultValue: [],
      validate: (value) => value.length,
    },
    {
      key: "rooms",
      defaultValue: [],
      validate: (value: string[]) =>
        value.every((room) => roomRegex.test(room)),
    },
    { key: "duration", defaultValue: 1 },
  ]);

  // Form submission
  const [loading, toggleLoading] = useToggle();
  async function handleSubmit() {
    if (!formOK) {
      setSnackbar(
        <Snackbar>{t("snackbar.formInvalid", { ns: "common" })}</Snackbar>,
      );
      return;
    }

    await withLoading(
      async () => {
        const { error } = await createScheduleItem(supabase, {
          ...form,
          day: additionSite!.day,
          start_time: additionSite!.startTime,
          subject: { id: subject.id },
          teachers: [{ id: teacherID! }],
          co_teachers: [],
        });

        if (error) {
          setSnackbar(
            <Snackbar>{t("snackbar.failure", { ns: "common" })}</Snackbar>,
          );
          return false;
        }

        await router.replace(router.asPath);
        onSubmit();
        resetForm();

        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  return (
    <Dialog
      open={open}
      width={360}
      onClose={onClose}
      className="[&_.skc-chip-field\_\_label]:!bg-surface-3"
    >
      <DialogHeader
        title={t("dialog.editPeriod.title.add")}
        desc={t("dialog.editPeriod.addDesc", {
          subject: getLocaleString(subject.name, locale),
          day: t(`datetime.day.${additionSite?.day}`, { ns: "common" }),
          startTime: additionSite?.startTime,
        })}
      />
      <DialogContent>
        <div className="flex flex-col gap-y-6 px-6">
          {/* Preview period */}
          <motion.div
            layout
            transition={{
              type: "spring",
              bounce: 0.325,
              duration: duration.medium4,
            }}
            style={{
              width: periodDurationToWidth(form.duration),
              borderRadius: 8,
            }}
            className={cn(`flex h-14 flex-col overflow-hidden rounded-sm
              bg-secondary px-4 py-2 text-on-secondary
              dark:bg-secondary-container dark:text-on-secondary-container`)}
          >
            <motion.span
              key={form.duration}
              layout="position"
              className="skc-text skc-text--title-medium truncate"
            >
              {tx("class", {
                number: form.classrooms.length
                  ? (form.classrooms as Pick<Classroom, "id" | "number">[]).map(
                      ({ number }) => number,
                    )
                  : "___",
              })}
            </motion.span>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={form.duration}
                layout="position"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={transition(duration.short4, easing.standard)}
                className="skc-text skc-text--body-small"
              >
                {getSubjectName(form.duration, subject, locale)}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Class */}
          <ClassroomsField
            classrooms={form.classrooms}
            onChange={(classrooms) => setForm({ ...form, classrooms })}
          />

          {/* Room code */}
          <RoomsField
            rooms={form.rooms}
            onChange={(rooms) => setForm({ ...form, rooms })}
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
