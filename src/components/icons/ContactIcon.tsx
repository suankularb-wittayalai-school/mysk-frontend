// Modules
import Image from "next/image";

// Components
import { MaterialIcon } from "@suankularb-components/react";

// Types
import { ContactVia } from "@utils/types/contact";

const ContactIcon = ({
  icon,
  width,
}: {
  icon: ContactVia;
  width?: number;
}): JSX.Element => (
  <div
    className="relative aspect-square text-primary"
    style={{ width, height: width, fontSize: width || 24 }}
  >
    {icon == "Phone" ? (
      <MaterialIcon icon="call" allowCustomSize />
    ) : icon == "Email" ? (
      <MaterialIcon icon="mail" allowCustomSize />
    ) : icon == "Facebook" ? (
      <Image src="/images/social/facebook.webp" layout="fill" alt="Facebook" />
    ) : icon == "Line" ? (
      <Image src="/images/social/line.webp" layout="fill" alt="LINE" />
    ) : icon == "Instagram" ? (
      <Image
        src="/images/social/instagram.webp"
        layout="fill"
        alt="Instagram"
      />
    ) : icon == "Website" ? (
      <MaterialIcon icon="public" allowCustomSize />
    ) : icon == "Discord" ? (
      <Image src="/images/social/discord.webp" layout="fill" alt="Discord" />
    ) : (
      <MaterialIcon icon="contacts" allowCustomSize />
    )}
  </div>
);

export default ContactIcon;
