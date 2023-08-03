// Imports
import ContactDialog from "@/components/account/ContactDialog";
import SnackbarContext from "@/contexts/SnackbarContext";
import DiscordLogo from "@/public/images/social/discord.svg";
import FacebookLogo from "@/public/images/social/facebook.svg";
import InstragramLogo from "@/public/images/social/instagram.svg";
import LineLogo from "@/public/images/social/line.svg";
import { range } from "@/utils/helpers/array";
import { getContactIsLinkable, getContactURL } from "@/utils/helpers/contact";
import { getLocaleString } from "@/utils/helpers/string";
import { useLocale } from "@/utils/hooks/i18n";
import { Contact } from "@/utils/types/contact";
import {
  Avatar,
  Card,
  CardHeader,
  MaterialIcon,
  Menu,
  MenuItem,
  Snackbar,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC, forwardRef, useContext, useState } from "react";

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
    phone: <MaterialIcon icon="phone" />,
    email: <MaterialIcon icon="email" />,
    facebook: <Image src={FacebookLogo} width={40} height={40} alt="" />,
    line: <Image src={LineLogo} width={40} height={40} alt="" />,
    instagram: <Image src={InstragramLogo} width={40} height={40} alt="" />,
    website: <MaterialIcon icon="language" />,
    discord: <Image src={DiscordLogo} width={40} height={40} alt="" />,
    other: <MaterialIcon icon="forum" />,
  };

  const subtitleMap = {
    phone: tx("contact.phone"),
    email: tx("contact.email"),
    facebook: tx("contact.facebook"),
    line: tx("contact.line"),
    instagram: tx("contact.instagram"),
    website: tx("contact.website"),
    discord: tx("contact.discord"),
    other: tx("contact.other"),
  };

  const formattedLabel = contact.name?.th
    ? getLocaleString(contact.name, locale)
    : contact.type === "phone"
    ? range(Math.min(Math.ceil(contact.value.length / 3), 3))
        .map((setIdx) =>
          contact.value.slice(
            setIdx * 3,
            setIdx === 2 ? contact.value.length : setIdx * 3 + 3,
          ),
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
            ? // If the Contact is linkable, link to it
              {
                href: getContactURL(contact),
                // eslint-disable-next-line react/display-name
                element: forwardRef((props, ref) => (
                  <a {...props} ref={ref} target="_blank" rel="noreferrer" />
                )),
              }
            : // Otherwise, copy the value to clipboard
              {
                onClick: () => {
                  navigator.clipboard.writeText(contact.value);
                  setSnackbar(
                    <Snackbar>{tx("snackbar.copiedToClipboard")}</Snackbar>,
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
