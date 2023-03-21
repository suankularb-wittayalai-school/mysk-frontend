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
import { ContactVia } from "@/utils/types/contact";
import { useTranslation } from "next-i18next";

/**
 * A contact Card.
 *
 * @param type The medium in which you can contact this person, i.e. Facebook, e-mail, etc.
 * @param label The text label on this contact.
 * @param href The link to this contact.
 */
const ContactCard: FC<{
  type: ContactVia;
  label: string;
  href: string;
}> = ({ type, label, href }) => {
  // Translation
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
    <Card appearance="outlined" direction="row" stateLayerEffect href={href}>
      <CardHeader
        avatar={<Avatar>{avatarMap[type]}</Avatar>}
        title={label}
        subtitle={subtitleMap[type]}
      />
    </Card>
  );
};

export default ContactCard;
