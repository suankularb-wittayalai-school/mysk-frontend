// External libraries
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC, useContext, useState } from "react";

// SK Components
import {
  MaterialIcon,
  Card,
  CardHeader,
  Avatar,
  Menu,
  MenuItem,
  Snackbar,
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
import { getContactIsLinkable, getContactURL } from "@/utils/helpers/contact";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { Contact } from "@/utils/types/contact";
import { range } from "@/utils/helpers/array";
import SnackbarContext from "@/contexts/SnackbarContext";

/**
 * A contact Card.
 *
 * @param contact A Contact object.
 * @param onChange Triggers when this Contact is edited.
 * @param onRemove Triggers when this Contact is removed.
 * 
 * @returns A Card.
 */
const ContactCard: FC<{
  contact: Contact;
  onChange?: (value: Contact) => void;
  onRemove?: () => void;
}> = ({ contact, onChange, onRemove }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("account");
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);

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
    Phone: tx("contact.phone"),
    Email: tx("contact.email"),
    Facebook: tx("contact.facebook"),
    Line: tx("contact.line"),
    Instagram: tx("contact.instagram"),
    Website: tx("contact.website"),
    Discord: tx("contact.discord"),
    Other: tx("contact.other"),
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
        {...(!editable
          ? getContactIsLinkable(contact)
            ?
            // If the Contact is linkable, link to it
            {
                href: getContactURL(contact),
                element: (props) => (
                  <a {...props} target="_blank" rel="noreferrer" />
                ),
              }
            : 
            // Otherwise, copy the value to clipboard
            {
                onClick: () => {
                  navigator.clipboard.writeText(contact.value);
                  setSnackbar(
                    <Snackbar>{tx("snackbar.copiedToClipboard")}</Snackbar>
                  );
                },
              }
          : {})}
      >
        <CardHeader
          avatar={<Avatar>{avatarMap[contact.type]}</Avatar>}
          title={
            editable ? (
              <a
                href={getContactURL(contact)}
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
                  href={getContactURL(contact)}
                  element={(props) => (
                    <a {...props} target="_blank" rel="noreferrer" />
                  )}
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
