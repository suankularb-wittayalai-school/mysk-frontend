// External libraries
import { useRouter } from "next/router";

// SK Components
import { MaterialIcon } from "@suankularb-components/react";

// Components
import ContactIcon from "@components/icons/ContactIcon";

// Helpers
import { getContactURL } from "@utils/helpers/contact";
import { getLocaleString } from "@utils/helpers/i18n";

// Types
import { LangCode } from "@utils/types/common";
import { Contact } from "@utils/types/contact";

const ContactIconList = ({
  contacts,
}: {
  contacts: Contact[];
}): JSX.Element => {
  const locale = useRouter().locale as LangCode;

  if (contacts.length == 0)
    return (
      <div className="pr-1 text-on-surface-translucent-38">
        <MaterialIcon icon="no_accounts" />
      </div>
    );

  return (
    <ul className="flex w-fit flex-row gap-1 pr-1">
      {contacts.map((contact) => (
        <li key={contact.id}>
          <a
            href={getContactURL(contact.type, contact.value)}
            title={getLocaleString(contact.name, locale)}
            target="_blank"
            rel="noreferrer"
          >
            <ContactIcon icon={contact.type} />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default ContactIconList;
