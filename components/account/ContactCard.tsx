// External libraries
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC, useState } from "react";

// SK Components
import {
  MaterialIcon,
  Card,
  CardHeader,
  Avatar,
  Menu,
  MenuItem,
} from "@suankularb-components/react";

// Contacts
import ContactDialog from "@/components/account/ContactDialog";

// Images
import FacebookLogo from "@/public/images/social/facebook.svg";
import LineLogo from "@/public/images/social/line.svg";
import InstragramLogo from "@/public/images/social/instagram.svg";
import DiscordLogo from "@/public/images/social/discord.svg";

// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";
import { getContactURL } from "@/utils/helpers/contact";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { Contact } from "@/utils/types/contact";
import { range } from "@/utils/helpers/array";

/**
 * A contact Card.
 *
 * @param contact A Contact object.
 * @param onChange Triggers when this Contact is edited.
 * @param onRemove Triggers when this Contact is removed.
 */
const ContactCard: FC<{
  contact: Contact;
  onChange?: (value: Contact) => void;
  onRemove?: () => void;
}> = ({ contact, onChange, onRemove }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation(["account", "common"]);

  const editable = Boolean(onChange || onRemove);
  const [showEdit, setShowEdit] = useState<boolean>(false);

  const avatarMap = {
    Phone: <MaterialIcon icon="phone" />,
    Email: <MaterialIcon icon="email" />,
    Facebook: <Image src={FacebookLogo} width={40} height={40} alt="" />,
    Line: <Image src={LineLogo} width={40} height={40} alt="" />,
    Instagram: <Image src={InstragramLogo} width={40} height={40} alt="" />,
    Website: <MaterialIcon icon="language" />,
    Discord: <Image src={DiscordLogo} width={40} height={40} alt="" />,
    Other: <MaterialIcon icon="forum" />,
  };

  const subtitleMap = {
    Phone: t("contact.phone", { ns: "common" }),
    Email: t("contact.email", { ns: "common" }),
    Facebook: t("contact.facebook", { ns: "common" }),
    Line: t("contact.line", { ns: "common" }),
    Instagram: t("contact.instagram", { ns: "common" }),
    Website: t("contact.website", { ns: "common" }),
    Discord: t("contact.discord", { ns: "common" }),
    Other: t("contact.other", { ns: "common" }),
  };

  const formattedLabel = contact.name
    ? getLocaleString(contact.name, locale)
    : contact.type === "Phone"
    ? range(Math.min(Math.ceil(contact.value.length / 3), 3))
        .map((setIdx) =>
          contact.value.slice(
            setIdx * 3,
            setIdx === 2 ? contact.value.length : setIdx * 3 + 3
          )
        )
        .join(" ")
    : contact.value;

  return (
    <>
      <Card
        appearance="outlined"
        stateLayerEffect={!editable}
        href={
          !editable ? getContactURL(contact.type, contact.value) : undefined
        }
        className="!overflow-visible"
      >
        <CardHeader
          avatar={<Avatar>{avatarMap[contact.type]}</Avatar>}
          title={
            editable ? (
              <a
                href={getContactURL(contact.type, contact.value)}
                target="_blank"
                rel="noreferrer"
                className="break-all"
              >
                {formattedLabel}
              </a>
            ) : (
              formattedLabel
            )
          }
          subtitle={subtitleMap[contact.type]}
          overflow={
            editable ? (
              <Menu>
                <MenuItem
                  icon={<MaterialIcon icon="edit" />}
                  onClick={() => setShowEdit(true)}
                >
                  {t("profile.contacts.action.edit")}
                </MenuItem>
                <MenuItem
                  icon={<MaterialIcon icon="delete" />}
                  onClick={onRemove}
                >
                  {t("profile.contacts.action.delete")}
                </MenuItem>
                <MenuItem
                  icon={<MaterialIcon icon="open_in_new" />}
                  href={getContactURL(contact.type, contact.value)}
                >
                  {t("profile.contacts.action.link")}
                </MenuItem>
              </Menu>
            ) : undefined
          }
          className={editable ? "[&_h3>a]:link" : undefined}
        />
      </Card>
      <ContactDialog
        open={showEdit}
        contact={contact}
        onClose={() => setShowEdit(false)}
        onSubmit={(contact) => {
          if (onChange) onChange(contact);
          setShowEdit(false);
        }}
      />
    </>
  );
};

export default ContactCard;
