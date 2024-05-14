import ClassroomsField from "@/components/classes/ClassroomsField";
import RoomsField from "@/components/room/RoomsField";
import ScheduleContext from "@/contexts/ScheduleContext";
import SnackbarContext from "@/contexts/SnackbarContext";
import createScheduleItem from "@/utils/backend/schedule/createScheduleItem";
import cn from "@/utils/helpers/cn";
import getLocaleString from "@/utils/helpers/getLocaleString";
import { formatSubjectPeriodName } from "@/utils/helpers/schedule/formatSubjectPeriodName";
import periodDurationToWidth from "@/utils/helpers/schedule/periodDurationToWidth";
import useForm from "@/utils/helpers/useForm";
import useLocale from "@/utils/helpers/useLocale";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { roomRegex } from "@/utils/patterns";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { Subject } from "@/utils/types/subject";
import {
  Actions,
  Button,
  DURATION,
  Dialog,
  DialogContent,
  DialogHeader,
  EASING,
  FormGroup,
  FormItem,
  Radio,
  Snackbar,
  transition,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import { useContext, useEffect } from "react";

/**
 * A Dialog for adding a Period to the user’s Schedule.
 *
 * @param subject The Subject to create a Schedule Period for.
 * @param open Whether the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 * @param onSubmit Triggers when the Schedule Period is created.
 */
const AddPeriodDialog: StylableFC<{
  subject: Pick<Subject, "id" | "name" | "short_name" | "code">;
  open?: boolean;
  onClose: () => void;
  onSubmit: () => void;
}> = ({ subject, open, onClose, onSubmit }) => {
  const locale = useLocale();
  const { t } = useTranslation("schedule", { keyPrefix: "dialog.editPeriod" });
  const { t: tx } = useTranslation("common");

  const plausible = usePlausible();
  const { additionSite, onEdit } = useContext(ScheduleContext);
  const { setSnackbar } = useContext(SnackbarContext);

  const supabase = useSupabaseClient();

  // Form control
  const { form, setForm, resetForm, formOK } = useForm<
    "classrooms" | "rooms" | "duration" | "is_co_teacher"
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
    { key: "is_co_teacher", defaultValue: false },
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
          ...(form.is_co_teacher
            ? { teachers: [], co_teachers: [{ id: teacherID! }] }
            : { teachers: [{ id: teacherID! }], co_teachers: [] }),
        });

        if (error) {
          setSnackbar(
            <Snackbar>{t("snackbar.failure", { ns: "common" })}</Snackbar>,
          );
          return false;
        }

        plausible("Add Period");

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
      className="[&_.skc-chip-field\_\_label]:!bg-surface-container-high"
    >
      <DialogHeader
        title={t("title.add")}
        desc={t("addDesc", {
          subject: getLocaleString(subject.name, locale),
          day: tx(`datetime.day.${additionSite?.day}`),
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
              duration: DURATION.medium4,
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
                transition={transition(DURATION.short4, EASING.standard)}
                className="skc-text skc-text--body-small"
              >
                {formatSubjectPeriodName(form.duration, subject, locale)}
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
          <FormGroup label={t("form.duration.label")}>
            <FormItem label={t("form.duration.single")}>
              <Radio
                value={form.duration === 1}
                onChange={(value) => value && setForm({ ...form, duration: 1 })}
              />
            </FormItem>
            <FormItem label={t("form.duration.double")}>
              <Radio
                disabled={additionSite?.startTime === 10}
                value={form.duration === 2}
                onChange={(value) => value && setForm({ ...form, duration: 2 })}
              />
            </FormItem>
          </FormGroup>

          {/* Co-teacher */}
          {/* <Card appearance="filled" className="-mx-2">
            <CardContent>
              <FormItem label={t("form.isCoTeacher")}>
                <Checkbox
                  value={form.is_co_teacher}
                  onChange={(is_co_teacher) =>
                    setForm({ ...form, is_co_teacher })
                  }
                />
              </FormItem>
            </CardContent>
          </Card> */}
        </div>
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.cancel")}
        </Button>
        <Button
          appearance="text"
          loading={loading || undefined}
          onClick={handleSubmit}
        >
          {t("action.save")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default AddPeriodDialog;
