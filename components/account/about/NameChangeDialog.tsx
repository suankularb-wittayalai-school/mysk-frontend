import MultilangText from "@/components/common/MultilingualText";
import InformationCard from "@/components/lookup/people/InformationCard";
import getLocaleName from "@/utils/helpers/getLocaleName";
import { StylableFC } from "@/utils/types/common";
import { Person } from "@/utils/types/person";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Dialog that lets the user change their name by leading them to the help
 * form.
 *
 * @param open Whether the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 */
const NameChangeDialog: StylableFC<{
  open?: boolean;
  person: Pick<Person, "first_name" | "last_name" | "middle_name">;
  onClose: () => void;
}> = ({ open, person, onClose, style, className }) => {
  const { t } = useTranslation("account", {
    keyPrefix: "profile.dialog.nameChange",
  });

  return (
    <Dialog open={open} onClose={onClose} style={style} className={className}>
      <DialogHeader title={t("title")} desc={t("desc")} />
      <DialogContent>
        <InformationCard title={t("content.fullName")} className="mx-6">
          <MultilangText
            text={{
              th: getLocaleName("th", person),
              "en-US": getLocaleName("en-US", person),
            }}
          />
        </InformationCard>
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.cancel")}
        </Button>
        <Button
          appearance="text"
          onClick={onClose}
          href={process.env.NEXT_PUBLIC_HELP_FORM_URL}
          element={(props) => <a {...props} target="_blank" rel="noreferrer" />}
        >
          {t("action.contactUs")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default NameChangeDialog;
