import MultilangText from "@/components/common/MultilingualText";
import ReportIssueButton from "@/components/common/ReportIssueButton";
import InformationCard from "@/components/lookup/people/InformationCard";
import { StylableFC } from "@/utils/types/common";
import { Person } from "@/utils/types/person";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

/**
 * A Dialog that lets the user change their name by leading them to the help
 * form.
 *
 * @param open Whether the Dialog is open and shown.
 * @param person The Person to display the name segments of.
 * @param onClose Triggers when the Dialog is closed.
 */
const NameChangeDialog: StylableFC<{
  open?: boolean;
  person: Pick<Person, "prefix" | "first_name" | "last_name" | "middle_name">;
  onClose: () => void;
}> = ({ open, person, onClose, style, className }) => {
  const { t } = useTranslation("account/about/nameChangeDialog");

  return (
    <Dialog
      open={open}
      width={392}
      onClose={onClose}
      style={style}
      className={className}
    >
      <DialogHeader title={t("title")} desc={t("desc")} />
      <DialogContent className="grid grid-cols-2 gap-2 px-4">
        <InformationCard title={t("grid.prefix")}>
          <MultilangText text={person.prefix} />
        </InformationCard>
        <InformationCard title={t("grid.firstName")}>
          <MultilangText text={person.first_name} />
        </InformationCard>
        <InformationCard title={t("grid.middleName")}>
          {person.middle_name?.th ? (
            <MultilangText text={person.middle_name} />
          ) : (
            <span className="text-on-surface-variant">{t("noMiddleName")}</span>
          )}
        </InformationCard>
        <InformationCard title={t("grid.lastName")}>
          <MultilangText text={person.last_name} />
        </InformationCard>
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.cancel")}
        </Button>
        <ReportIssueButton
          appearance="text"
          icon={undefined}
          location="Name Change Dialog"
          onSubmit={onClose}
        >
          {t("action.submit")}
        </ReportIssueButton>
      </Actions>
    </Dialog>
  );
};

export default NameChangeDialog;
