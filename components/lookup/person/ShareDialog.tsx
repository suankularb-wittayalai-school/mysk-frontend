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
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { getLocaleObj } from "@/utils/helpers/i18n";

const ShareDialog: DialogComponent<{
  person: Student | Teacher;
}> = ({ person, open, onClose }) => {
  const locale = useLocale();

  async function handleSaveVCard() {
    const emails = person.contacts.filter(
      (contact) => contact.type === "Email"
    );
    const phoneNumbers = person.contacts.filter(
      (contact) => contact.type === "Phone"
    );

    var vCard = new Blob(
      [
        `BEGIN:VCARD\nVERSION:3.0\nN:${
          getLocaleObj(person.name, locale).lastName
        };${getLocaleObj(person.name, locale).firstName};;;\nFN:${nameJoiner(
          locale,
          person.name
        )}\n${emails
          .map((email) => `EMAIL;type=INTERNET:${email.value}`)
          .join("\n")}\n${phoneNumbers
          .map((phoneNumber) => `TEL;type=CELL:${phoneNumber.value}`)
          .join("\n")}\nEND:VCARD`,
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

  function handlePrint() {
    onClose();
    setTimeout(() => window.print(), 200);
  }

  return (
    <Dialog open={open} onClose={onClose} width={312}>
      <DialogHeader desc={`Share ${nameJoiner(locale, person.name)}…`} />
      <DialogContent className="mx-6 flex flex-col gap-4">
        {/* Save to contacts */}
        <div className="flex flex-col gap-2">
          <Actions align="full">
            <Button
              appearance="outlined"
              icon={<MaterialIcon icon="contact_page" />}
              onClick={handleSaveVCard}
            >
              Save to contacts
            </Button>
          </Actions>
          <p className="skc-label-small text-on-surface-variant">
            Save a .vcf file to see this person as a contact on your device.
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
              Copy link
            </Button>
          </Actions>
          <p className="skc-label-small text-on-surface-variant">
            Get a link to this page.
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
              Print
            </Button>
          </Actions>
          <p className="skc-label-small text-on-surface-variant">
            Print out the details of this person.
          </p>
        </div>
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          Done
        </Button>
      </Actions>
    </Dialog>
  );
};

export default ShareDialog;
