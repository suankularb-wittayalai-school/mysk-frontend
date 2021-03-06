// Modules
import Image from "next/image";
import { useRouter } from "next/router";

// SK Components
import { Card, CardHeader, MaterialIcon } from "@suankularb-components/react";

// Components
import ContactIcon from "@components/icons/ContactIcon";

// Types
import { Contact } from "@utils/types/contact";
import { getContactURL } from "@utils/helpers/contact";

const ContactChip = ({
  contact,
  className,
}: {
  contact: Contact;
  className?: string;
}): JSX.Element => {
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <a
      href={getContactURL(contact.type, contact.value)}
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
          icon={<ContactIcon icon={contact.type} width={24} />}
          title={
            <span id={`contact-${contact.id}`}>{contact.name[locale]}</span>
          }
          end={
            contact.includes ? (
              <div className="flex flex-row-reverse">
                {contact.includes.teachers && (
                  <MaterialIcon
                    icon="school"
                    className="text-stroke text-stroke-0.25 text-stroke-surface-1 -ml-2 text-secondary"
                  />
                )}
                {contact.includes.parents && (
                  <MaterialIcon
                    icon="escalator_warning"
                    className="text-stroke text-stroke-0.25 text-stroke-surface-1 -ml-2 text-primary"
                  />
                )}
                {contact.includes.students && (
                  <MaterialIcon
                    icon="groups"
                    className="text-stroke text-stroke-0.25 text-stroke-surface-1 -ml-2 text-primary"
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
