import MultilangText from "@/components/common/MultilingualText";
import InformationCard from "@/components/lookup/people/InformationCard";
import getLocaleName from "@/utils/helpers/getLocaleName";
import { LangCode, StylableFC } from "@/utils/types/common";
import { Person } from "@/utils/types/person";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";

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

  const plausible = usePlausible();

  return (
    <Dialog open={open} onClose={onClose} style={style} className={className}>
      <DialogHeader title={t("title")} desc={t("desc")} />
      <DialogContent>
        <InformationCard title={t("content.fullName")} className="mx-6">
          <MultilangText
            text={
              Object.fromEntries(
                (["th", "en-US"] as LangCode[]).map((locale) => [
                  locale,
                  getLocaleName(locale, person, { prefix: true }),
                ]),
              ) as { [key in LangCode]: string }
            }
          />
        </InformationCard>
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.cancel")}
        </Button>
        <Button
          appearance="text"
          onClick={() => {
            onClose();
            plausible("Open Report Form", {
              props: { location: "Name Change Dialog" },
            });
          }}
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
