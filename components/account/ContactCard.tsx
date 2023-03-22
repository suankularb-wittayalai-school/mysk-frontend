// External libraries
import Image from "next/image";
import { FC } from "react";

// SK Components
import {
  MaterialIcon,
  Card,
  CardHeader,
  Avatar,
} from "@suankularb-components/react";

// Images
import FacebookLogo from "@/public/images/social/facebook.svg";
import LineLogo from "@/public/images/social/line.svg";
import InstragramLogo from "@/public/images/social/instagram.svg";
import DiscordLogo from "@/public/images/social/discord.svg";

// Types
import { Contact, ContactVia } from "@/utils/types/contact";
import { useTranslation } from "next-i18next";
import { getLocaleString } from "@/utils/helpers/i18n";
import { useLocale } from "@/utils/hooks/i18n";

/**
 * A contact Card.
 *
 * @param contact A Contact object.
 */
const ContactCard: FC<{ contact: Contact }> = ({ contact }) => {
  // Translation
  const locale = useLocale();
  const { t } = useTranslation("common");

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
    <Card
      appearance="outlined"
      direction="row"
      stateLayerEffect
      href={contact.value}
    >
      <CardHeader
        avatar={<Avatar>{avatarMap[contact.type]}</Avatar>}
        title={getLocaleString(contact.name, locale)}
        subtitle={subtitleMap[contact.type]}
      />
    </Card>
  );
};

export default ContactCard;
