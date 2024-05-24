import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  FormGroup,
  FormItem,
  Radio,
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { forwardRef, useState } from "react";

enum ReportingCategory {
  /** For issues with the school-issue Google Workspace account. */
  workspace = "workspace",
  /** For issues with MySK. */
  mysk = "mysk",
}

/**
 * URLs for the Google Forms for reporting issues.
 */
const FORM_URLS = {
  workspace: "https://bit.ly/skmail-help",
  mysk: "https://bit.ly/mysk-help-me-please",
} as Record<ReportingCategory, string>;

/**
 * A Dialog explaining how to report an issue. Lets the user select a category
 * and opens the appropriate Google Form.
 *
 * @param open Whether the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 * @param onSubmit Triggers when the form link is opened.
 */
const ReportIssueDialog: StylableFC<{
  open?: boolean;
  onClose: () => void;
  onSubmit: (category: ReportingCategory) => void;
}> = ({ onSubmit, ...props }) => {
  const { onClose } = props;

  const locale = useLocale();
  const { t } = useTranslation("common", { keyPrefix: "dialog.reportIssue" });

  const [selectedCategory, setSelectedCategory] =
    useState<ReportingCategory | null>(null);

  return (
    <Dialog width={312} {...props}>
      <DialogHeader title={t("title")} desc={t("desc")} />
      <DialogContent className="space-y-6 [&_*]:!text-on-surface-variant">
        <FormGroup
          className={cn(`gap-2 !pl-5 !pr-6 *:!items-center 
            [&>*:first-child]:!sr-only`)}
          label={t("form.category.label")}
        >
          {Object.values(ReportingCategory).map((category) => (
            <FormItem key={category} label={t(`form.category.${category}`)}>
              <Radio
                value={selectedCategory === category}
                onChange={() => setSelectedCategory(category)}
              />
            </FormItem>
          ))}
        </FormGroup>
        <div className="space-y-3 px-6">
          <Text type="body-medium" element="p">
            {t("note.contact")}
          </Text>
          {locale === "en-US" && (
            <Text type="body-medium" element="p">
              {t("note.english")}
            </Text>
          )}
        </div>
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.cancel")}
        </Button>
        <Button
          appearance="text"
          disabled={!selectedCategory}
          href={selectedCategory ? FORM_URLS[selectedCategory] : undefined}
          onClick={() => {
            onSubmit(selectedCategory!);
            setSelectedCategory(null);
          }}
          element={
            selectedCategory
              ? // eslint-disable-next-line react/display-name
                forwardRef((props, ref) => (
                  <a ref={ref} {...props} target="_blank" />
                ))
              : "button"
          }
        >
          {t("action.continue")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default ReportIssueDialog;
