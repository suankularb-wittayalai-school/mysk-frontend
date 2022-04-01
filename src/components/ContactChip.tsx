// Modules
import Image from "next/image";
import { useRouter } from "next/router";

// SK Components
import { Card, CardHeader, MaterialIcon } from "@suankularb-components/react";

// Types
import { Contact } from "@utils/types/contact";

const ContactChip = ({
  contact,
  className,
}: {
  contact: Contact;
  className?: string;
}): JSX.Element => {
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <a
      aria-labelledby={`contact-${contact.id}`}
      href={contact.url}
      target="_blank"
      rel="noreferrer"
    >
      <Card
        type="horizontal"
        appearance="tonal"
        hasAction
        className={className}
      >
        <CardHeader
          icon={
            <div className="relative aspect-square w-6 text-primary">
              {contact.via == "phone" ? (
                <MaterialIcon icon="call" />
              ) : contact.via == "email" ? (
                <MaterialIcon icon="mail" />
              ) : contact.via == "facebook" ? (
                <Image
                  src="/images/social/facebook.webp"
                  layout="fill"
                  alt="Facebook"
                />
              ) : contact.via == "line" ? (
                <Image
                  src="/images/social/line.webp"
                  layout="fill"
                  alt="LINE"
                />
              ) : contact.via == "instagram" ? (
                <Image
                  src="/images/social/instagram.webp"
                  layout="fill"
                  alt="Instagram"
                />
              ) : contact.via == "website" ? (
                <MaterialIcon icon="public" />
              ) : contact.via == "discord" ? (
                <Image
                  src="/images/social/discord.webp"
                  layout="fill"
                  alt="Discord"
                />
              ) : (
                <MaterialIcon icon="contacts" />
              )}
            </div>
          }
          title={
            <span id={`contact-${contact.id}`}>{contact.name[locale]}</span>
          }
          end={
            contact.includes ? (
              <div className="flex flex-row-reverse">
                {contact.includes.teachers && (
                  <MaterialIcon
                    icon="school"
                    className="-ml-2 text-secondary text-stroke text-stroke-0.25 text-stroke-surface-1"
                  />
                )}
                {contact.includes.parents && (
                  <MaterialIcon
                    icon="escalator_warning"
                    className="-ml-2 text-primary text-stroke text-stroke-0.25 text-stroke-surface-1"
                  />
                )}
                {contact.includes.students && (
                  <MaterialIcon
                    icon="groups"
                    className="-ml-2 text-primary text-stroke text-stroke-0.25 text-stroke-surface-1"
                  />
                )}
              </div>
            ) : undefined
          }
          className="bg-surface-1 !p-2"
        />
      </Card>
    </a>
  );
};

export default ContactChip;
