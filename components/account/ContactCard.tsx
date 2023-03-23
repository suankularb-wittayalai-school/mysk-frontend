// External libraries
import Image from "next/image";
import { FC, useState } from "react";

// SK Components
import {
  MaterialIcon,
  Card,
  CardHeader,
  Avatar,
  Button,
  CardContent,
} from "@suankularb-components/react";

// Images
import FacebookLogo from "@/public/images/social/facebook.svg";
import LineLogo from "@/public/images/social/line.svg";
import InstragramLogo from "@/public/images/social/instagram.svg";
import DiscordLogo from "@/public/images/social/discord.svg";

// Types
import { Contact } from "@/utils/types/contact";
import { useTranslation } from "next-i18next";
import { getLocaleString } from "@/utils/helpers/i18n";
import { useLocale } from "@/utils/hooks/i18n";
import { getContactURL } from "@/utils/helpers/contact";
import AddContactDialog from "./AddContactDialog";

/**
 * A contact Card.
 *
 * @param contact A Contact object.
 * @param editable
 */
const ContactCard: FC<{
  contact: Contact;
  onChange?: (value: Contact) => void;
  onRemove?: () => void;
}> = ({ contact, onChange, onRemove }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

  const editable = Boolean(onChange || onRemove);
  const [showAdd, setShowAdd] = useState<boolean>(false);

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
    Phone: t("contact.phone"),
    Email: t("contact.email"),
    Facebook: t("contact.facebook"),
    Line: t("contact.line"),
    Instagram: t("contact.instagram"),
    Website: t("contact.website"),
    Discord: t("contact.discord"),
    Other: t("contact.other"),
  };

  return (
    <>
      <Card
        appearance="outlined"
        direction="row"
        stateLayerEffect={!(onChange || onRemove)}
        href={
          !editable ? getContactURL(contact.type, contact.value) : undefined
        }
      >
        <div
          className="group grid h-[4.5rem] w-full [grid-template-areas:'center']"
          tabIndex={0}
        >
          <CardHeader
            avatar={<Avatar>{avatarMap[contact.type]}</Avatar>}
            title={getLocaleString(contact.name, locale)}
            subtitle={subtitleMap[contact.type]}
            className="transition-opacity [grid-area:center]
              group-focus-within:opacity-0 group-hover:opacity-0"
          />
          <CardContent
            className="!flex-row items-center justify-center opacity-0
              transition-opacity [grid-area:center]
              group-focus-within:opacity-100 group-hover:opacity-100"
          >
            <Button
              appearance="filled"
              icon={<MaterialIcon icon="edit" />}
              onClick={() => setShowAdd(true)}
            />
            <Button
              appearance="tonal"
              icon={<MaterialIcon icon="delete" />}
              dangerous
            />
            <Button
              appearance="tonal"
              icon={<MaterialIcon icon="open_in_new" />}
              href={getContactURL(contact.type, contact.value)}
            />
          </CardContent>
        </div>
      </Card>
      <AddContactDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={(contact) => {
          if (onChange) onChange(contact);
          setShowAdd(false);
        }}
      />
    </>
  );
};

export default ContactCard;
