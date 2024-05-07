import getLocaleString from "@/utils/helpers/getLocaleString";
import useForm from "@/utils/helpers/useForm";
import useLocale from "@/utils/helpers/useLocale";
import { MultiLangString, StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  FormGroup,
  FormItem,
  MaterialIcon,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { list } from "radash";
import { useState } from "react";

/**
 * A Dialog that displays the requirements of an Elective Subject and allows the
 * Student to confirm that they have met the requirements.
 *
 * @param open Whether the Dialog is open and shown.
 * @param requirements An array of Multi-lang Strings that represent the requirements.
 * @param onClose Triggers when the Dialog is closed.
 * @param onSubmit Triggers when the Student has confirmed that they have met the requirements.
 */
const RequirementsDialog: StylableFC<{
  open?: boolean;
  requirements: MultiLangString[];
  onClose: () => void;
  onSubmit: () => void;
}> = ({ open, requirements, onClose, onSubmit, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("elective", {
    keyPrefix: "dialog.requirements",
  });

  const { form, setForm } = useForm<"requirements">([
    {
      key: "requirements",
      defaultValue: list(0, requirements.length - 1, false),
    },
  ]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={280}
      style={style}
      className={className}
    >
      <DialogHeader
        className="!pb-6"
        icon={<MaterialIcon icon="front_hand" />}
        title={t("title")}
        desc={t("desc")}
      />
      <DialogContent>
        <FormGroup
          className="gap-2 !pl-5 !pr-6 [&>*:first-child]:!sr-only"
          label={t("form.requirements")}
        >
          {requirements.map((requirement, index) => (
            <FormItem
              key={index}
              label={getLocaleString(requirement, locale)}
              className="!items-center !text-on-surface-variant"
            >
              <Checkbox
                value={form.requirements[index]}
                // Toggle the check at the index.
                onChange={(value) =>
                  setForm({
                    requirements: (form.requirements as boolean[]).map(
                      (check, mapIndex) => (mapIndex === index ? value : check),
                    ),
                  })
                }
              />
            </FormItem>
          ))}
        </FormGroup>
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.cancel")}
        </Button>
        <Button
          appearance="text"
          onClick={onSubmit}
          // Disable the button if any of the requirements are not met.
          disabled={(form.requirements as boolean[]).some(
            (requirement) => !requirement,
          )}
        >
          {t("action.continue")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default RequirementsDialog;
