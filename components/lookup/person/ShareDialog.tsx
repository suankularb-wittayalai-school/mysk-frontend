// External libraries
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

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
import { DialogComponent } from "@/utils/types/common";
import { Student, Teacher } from "@/utils/types/person";

// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

const ShareDialog: DialogComponent<{
  person: Student | Teacher;
}> = ({ person, open, onClose }) => {
  const locale = useLocale();
  const { t } = useTranslation(["lookup", "common"]);

  const router = useRouter();

  async function handleSaveVCard() {
    const emails = person.contacts.filter(
      (contact) => contact.type === "Email"
    );
    const phoneNumbers = person.contacts.filter(
      (contact) => contact.type === "Phone"
    );

    var vCard = new Blob(
      [
        [
          // File header
          `BEGIN:VCARD`,
          `VERSION:3.0`,

          // Name
          `N:${nameJoiner(locale, person.name, undefined, {
            firstName: false,
          })};${nameJoiner(locale, person.name, undefined, {
            lastName: false,
          })};;${person.role === "teacher" ? "T." : ""};`,
          `FN:${nameJoiner(
            locale,
            person.name,
            person.role === "teacher" ? { th: "อ.", "en-US": "T." } : undefined
          )}`,

          // Birthday
          `BDAY:${person.birthdate.split("-").join("")}`,

          // Contacts
          emails
            .map((email) => `EMAIL;type=INTERNET:${email.value}`)
            .join("\n"),
          phoneNumbers
            .map((phoneNumber) => `TEL;type=CELL:${phoneNumber.value}`)
            .join("\n"),

          // Role within the school
          person.role === "teacher" &&
            [
              `item1.ORG:${t(
                "people.dialog.share.saveVCard.segment.org"
              )};${getLocaleString(person.subjectGroup.name, locale)}`,
              `item2.TITLE:${t("people.dialog.share.saveVCard.segment.title")}`,
              person.classAdvisorAt &&
                `NOTE:${t("people.dialog.share.saveVCard.segment.note", {
                  number: person.classAdvisorAt.number,
                })}`,
            ]
              .filter((segment) => segment)
              .join("\n"),

          // File footer
          `END:VCARD`,
        ]
          .filter((segment) => segment)
          .join("\n"),
      ],
      { type: "text/vcard;charset=utf-8" }
    );

    window.location.href = URL.createObjectURL(vCard);
    onClose();
  }

  async function handleCopyLink() {
    const shareData: ShareData = {
      title: `${nameJoiner(locale, person.name)} - MySK`,
      url: window.location.href,
    };
    if (navigator.canShare && navigator.canShare(shareData))
      await navigator.share(shareData);
    else navigator.clipboard.writeText(window.location.href);
    onClose();
  }

  async function handlePrint() {
    onClose();
    await router.push(`/lookup/person/${person.role}/${person.id}`);
    setTimeout(() => window.print(), 200);
  }

  return (
    <Dialog open={open} onClose={onClose} width={312}>
      <DialogHeader
        desc={t("people.dialog.share.title", {
          name: nameJoiner(locale, person.name),
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
