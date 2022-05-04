// Modules
import Image from "next/image";
import { useRouter } from "next/router";

// SK Components
import { Card, CardHeader, MaterialIcon } from "@suankularb-components/react";

// Components
import ContactIcon from "@components/icons/ContactIcon";

// Types
import { Contact } from "@utils/types/contact";

const ContactChip = ({
  contact,
  className,
}: {
  contact: Contact;
  className?: string;
}): JSX.Element => {
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <Card type="horizontal" appearance="tonal" hasAction className={className}>
      <CardHeader
        icon={<ContactIcon icon={contact.type} />}
        title={<span id={`contact-${contact.id}`}>{contact.name[locale]}</span>}
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
  );
};

export default ContactChip;
