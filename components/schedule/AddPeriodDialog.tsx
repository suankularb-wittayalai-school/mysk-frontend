// External libraries
import { useTranslation } from "next-i18next";

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
  TextField,
} from "@suankularb-components/react";

// Types
import { SubmittableDialogComponent } from "@/utils/types/common";
import { useForm } from "@/utils/hooks/form";
import { classRegex, roomRegex } from "@/utils/patterns";
import { SubjectWNameAndCode } from "@/utils/types/subject";
import { getLocaleObj } from "@/utils/helpers/i18n";
import { useLocale } from "@/utils/hooks/i18n";
import { useContext } from "react";
import ScheduleContext from "@/contexts/ScheduleContext";

const AddPeriodDialog: SubmittableDialogComponent<
  () => void,
  { subject: SubjectWNameAndCode }
> = ({ open, subject, onClose, onSubmit }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation(["schedule", "common"]);

  // Context
  const { additionSite } = useContext(ScheduleContext);

  // Form control
  const { form, setForm, formProps } = useForm<"class" | "room" | "duration">([
    {
      key: "class",
      required: true,
      validate: (value: string) => classRegex.test(value),
    },
    {
      key: "room",
      required: true,
      validate: (value: string) => roomRegex.test(value),
    },
    { key: "duration", defaultValue: 1 },
  ]);

  return (
    <Dialog open={open} width={360} onClose={onClose}>
      <DialogHeader
        title={t("dialog.editPeriod.title.add")}
        desc={t("dialog.editPeriod.addDesc", {
          subject: getLocaleObj(subject.name, locale).name,
          day: t(`datetime.day.${additionSite?.day}`, { ns: "common" }),
          startTime: additionSite?.startTime,
        })}
      />
      <DialogContent className="flex flex-col gap-y-6 px-6">
        <TextField
          appearance="outlined"
          label={t("dialog.editPeriod.form.class")}
          {...formProps.class}
        />
        <TextField
          appearance="outlined"
          label={t("dialog.editPeriod.form.room")}
          helperMsg={t("dialog.editPeriod.form.room_helper")}
          {...formProps.room}
        />
        <FormGroup label={t("dialog.editPeriod.form.duration.label")}>
          <FormItem label={t("dialog.editPeriod.form.duration.single")}>
            <Radio
              value={form.duration === 1}
              onChange={(value) => value && setForm({ ...form, duration: 1 })}
            />
          </FormItem>
          <FormItem label={t("dialog.editPeriod.form.duration.double")}>
            <Radio
              value={form.duration === 2}
              onChange={(value) => value && setForm({ ...form, duration: 2 })}
            />
          </FormItem>
        </FormGroup>
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("dialog.editPeriod.action.cancel")}
        </Button>
        <Button appearance="text" onClick={onSubmit}>
          {t("dialog.editPeriod.action.save")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default AddPeriodDialog;
