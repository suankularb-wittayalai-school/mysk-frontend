// External libraries
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// SK Components
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  MaterialIcon,
} from "@suankularb-components/react";

// Types
import { Student, Teacher } from "@/utils/types/person";
import { DialogFC } from "@/utils/types/component";

// Helpers
import { useGetVCard } from "@/utils/helpers/contact";
import { getLocaleName } from "@/utils/helpers/string";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";


const ShareDialog: DialogFC<{
  person: Student | Teacher;
}> = ({ person, open, onClose }) => {
  const locale = useLocale();
  const { t } = useTranslation("lookup");

  const router = useRouter();

  const getVCard = useGetVCard();

  async function handleSaveVCard() {
    va.track("Share Person", {
      person: getLocaleName("en-US", person),
      method: "vCard",
    });
    var vCard = getVCard(person);
    window.location.href = URL.createObjectURL(vCard);
    onClose();
  }

  async function handleCopyLink() {
    va.track("Share Person", {
      person: getLocaleName("en-US", person),
      method: "Native Share",
    });

    const shareData: ShareData = {
      title: `${getLocaleName(locale, person)} - MySK`,
      url: window.location.href,
    };
    if (navigator.canShare && navigator.canShare(shareData))
      await navigator.share(shareData);
    else navigator.clipboard.writeText(window.location.href);
    onClose();
  }

  async function handlePrint() {
    va.track("Share Person", {
      person: getLocaleName("en-US", person),
      method: "Print",
    });

    onClose();
    await router.push(`/lookup/person/${person.role}/${person.id}`);
    setTimeout(() => window.print(), 200);
  }

  return (
    <Dialog open={open} onClose={onClose} width={312}>
      <DialogHeader
        desc={t("people.dialog.share.title", {
          name: getLocaleName(locale, person),
        })}
      />
      <DialogContent className="mx-6 flex flex-col gap-4">
        {/* Save to contacts */}
        <div className="flex flex-col gap-2">
          <Actions align="full">
            <Button
              appearance="outlined"
              icon={<MaterialIcon icon="contact_page" />}
              onClick={handleSaveVCard}
            >
              {t("people.dialog.share.saveVCard.label")}
            </Button>
          </Actions>
          <p className="skc-label-small text-on-surface-variant">
            {t("people.dialog.share.saveVCard.desc")}
          </p>
        </div>

        {/* Copy link */}
        <div className="flex flex-col gap-2">
          <Actions align="full">
            <Button
              appearance="outlined"
              icon={<MaterialIcon icon="link" />}
              onClick={handleCopyLink}
            >
              {t("people.dialog.share.copyLink.label")}
            </Button>
          </Actions>
          <p className="skc-label-small text-on-surface-variant">
            {t("people.dialog.share.copyLink.desc")}
          </p>
        </div>

        {/* Print */}
        <div className="flex flex-col gap-2">
          <Actions align="full">
            <Button
              appearance="outlined"
              icon={<MaterialIcon icon="print" />}
              onClick={handlePrint}
            >
              {t("people.dialog.share.print.label")}
            </Button>
          </Actions>
          <p className="skc-label-small text-on-surface-variant">
            {t("people.dialog.share.print.desc")}
          </p>
        </div>
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("people.dialog.share.action.close")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default ShareDialog;
