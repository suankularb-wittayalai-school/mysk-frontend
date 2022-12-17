// External libraries
import { useRouter } from "next/router";

// SK Components
import {
  Button,
  Card,
  CardHeader,
  MaterialIcon,
} from "@suankularb-components/react";

// Components
import ContactIcon from "@components/icons/ContactIcon";

// Types
import { LangCode } from "@utils/types/common";
import { Contact } from "@utils/types/contact";
import { getContactURL } from "@utils/helpers/contact";
import Includes from "./Includes";

const ContactChip = ({
  contact,
  allowEdit,
  onDelete,
  className,
}: {
  contact: Contact;
  allowEdit?: boolean;
  onDelete?: () => void;
  className?: string;
}): JSX.Element => {
  const locale = useRouter().locale as LangCode;

  return (
    <Card type="horizontal" appearance="tonal" hasAction className={className}>
      <CardHeader
        icon={<ContactIcon icon={contact.type} width={24} />}
        title={
          <a
            href={getContactURL(contact.type, contact.value)}
            target="_blank"
            rel="noreferrer"
          >
            <span id={`contact-${contact.id}`}>{contact.name[locale]}</span>
          </a>
        }
        end={
          <div className="flex flex-row-reverse">
            {allowEdit && (
              <Button
                type="text"
                icon={<MaterialIcon icon="delete" />}
                iconOnly
                className=" ml-4"
                isDangerous
                onClick={onDelete}
              />
            )}

            {contact.includes && <Includes includes={contact.includes} />}
          </div>
        }
        className="bg-surface-1 !p-2"
      />
    </Card>
  );
};

export default ContactChip;
