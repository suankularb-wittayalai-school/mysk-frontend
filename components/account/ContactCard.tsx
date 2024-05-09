import ContactOverflow from "@/components/account/ContactOverflow";
import SnackbarContext from "@/contexts/SnackbarContext";
import DiscordLogo from "@/public/images/social/discord.svg";
import FacebookLogo from "@/public/images/social/facebook.svg";
import InstragramLogo from "@/public/images/social/instagram.svg";
import LineLogo from "@/public/images/social/line.svg";
import cn from "@/utils/helpers/cn";
import getContactIsLinkable from "@/utils/helpers/contact/getContactIsLinkable";
import getContactURL from "@/utils/helpers/contact/getContactURL";
import getFormattedLabel from "@/utils/helpers/contact/getFormattedLabel";
import getLocaleString from "@/utils/helpers/getLocaleString";
import isURL from "@/utils/helpers/isURL";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import {
  Avatar,
  Card,
  CardHeader,
  MaterialIcon,
  Snackbar,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import Image from "next/image";
import { sift } from "radash";
import { forwardRef, useContext } from "react";

/**
 * A contact Card.
 *
 * @param contact A Contact object.
 * @param onChange Triggers when this Contact is edited.
 * @param onRemove Triggers when this Contact is removed.
 */
const ContactCard: StylableFC<{
  contact: Contact;
  onChange?: (value: Contact) => void;
  onRemove?: () => void;
}> = ({ contact, onChange, onRemove, style, className }) => {
  const locale = useLocale();
  const { t: tx } = useTranslation("common");

  const plausible = usePlausible();
  const { setSnackbar } = useContext(SnackbarContext);

  const editable = Boolean(onChange || onRemove);

  const avatarMap = {
    phone: <MaterialIcon icon="phone" />,
    email: <MaterialIcon icon="email" />,
    facebook: <Image src={FacebookLogo} alt="" />,
    line: <Image src={LineLogo} alt="" />,
    instagram: <Image src={InstragramLogo} alt="" />,
    website: <MaterialIcon icon="language" />,
    discord: <Image src={DiscordLogo} alt="" />,
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

  return (
    <Card
      appearance="outlined"
      direction="row"
      stateLayerEffect={!editable}
      {...(!editable
        ? getContactIsLinkable(contact)
          ? // If the Contact is linkable, link to it
            {
              onClick: () => {
                plausible("Access Contact", {
                  props: { method: "Link", type: contact.type },
                });
              },
              href: getContactURL(contact),
              element: !["phone", "email"].includes(contact.type)
                ? // eslint-disable-next-line react/display-name
                  forwardRef((props, ref) => (
                    <a {...props} ref={ref} target="_blank" rel="noreferrer" />
                  ))
                : "a",
            }
          : // Otherwise, copy the value to clipboard
            {
              onClick: () => {
                plausible("Access Contact", {
                  props: { method: "Copy to Clipboard", type: contact.type },
                });
                navigator.clipboard.writeText(contact.value);
                setSnackbar(
                  <Snackbar>{tx("snackbar.copiedToClipboard")}</Snackbar>,
                );
              },
            }
        : {})}
      style={style}
      className={cn(`items-center`, className)}
    >
      <CardHeader
        avatar={<Avatar>{avatarMap[contact.type]}</Avatar>}
        title={
          editable && getContactIsLinkable(contact) ? (
            <a
              href={getContactURL(contact)}
              target={
                !["phone", "email"].includes(contact.type) ? "_blank" : "_self"
              }
              rel="noreferrer"
              className="break-all"
            >
              {getFormattedLabel(contact)}
            </a>
          ) : (
            <>
              {isURL(contact.value) && (
                <MaterialIcon
                  icon="link"
                  size={20}
                  className="-mb-1.5 mr-1 !inline-block !text-outline"
                />
              )}
              {getFormattedLabel(contact)}
            </>
          )
        }
        subtitle={sift([
          contact.name?.th && getLocaleString(contact.name, locale),
          subtitleMap[contact.type],
        ]).join(" • ")}
        className={cn(
          `[&_h3>a]:link !grid grow grid-cols-[2.5rem,minmax(0,1fr)]
          [&>:nth-child(2)>*]:!truncate [&>:nth-child(2)>span]:block`,
        )}
      />
      {editable && (
        <ContactOverflow
          contact={contact}
          onChange={onChange}
          onRemove={onRemove}
          className="pr-2"
        />
      )}
    </Card>
  );
};

export default ContactCard;
