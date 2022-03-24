// Modules
import Image from "next/image";
import { useRouter } from "next/router";

// SK Components
import { MaterialIcon } from "@suankularb-components/react";

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
      className={`has-action flex flex-row items-center gap-2 rounded bg-surface-1 p-2 ${
        className || ""
      }`}
    >
      <div className="relative aspect-square w-6 text-primary">
        {contact.via == "line" ? (
          <Image src="/images/social/line.webp" layout="fill" alt="LINE" />
        ) : contact.via == "facebook" ? (
          <Image
            src="/images/social/facebook.webp"
            layout="fill"
            alt="Facebook"
          />
        ) : contact.via == "discord" ? (
          <Image
            src="/images/social/discord.webp"
            layout="fill"
            alt="Discord"
          />
        ) : (
          <MaterialIcon icon="mail" />
        )}
      </div>
      <span id={`contact-${contact.id}`} className="grow">
        {contact.name[locale]}
      </span>
      {contact.includes && (
        <div className="flex flex-row-reverse">
          {contact.includes.teachers && (
            <MaterialIcon icon="school" className="-ml-2.5 text-secondary" />
          )}
          {contact.includes.parents && (
            <MaterialIcon
              icon="escalator_warning"
              className="-ml-2.5 text-primary"
            />
          )}
          {contact.includes.students && (
            <MaterialIcon icon="groups" className="-ml-2.5 text-primary" />
          )}
        </div>
      )}
    </a>
  );
};

export default ContactChip;
