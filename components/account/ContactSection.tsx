// External libraries
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  Columns,
  Header,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Internal components
import ContactCard from "@/components/account/ContactCard";
import ContactDialog from "@/components/account/ContactDialog";

// Types
import { Contact } from "@/utils/types/contact";

const ContactsSection: FC<{
  contacts: Contact[];
  handleAdd?: (contact: Contact) => any;
  handleEdit?: (contact: Contact, idx: number) => any;
  handleRemove?: (contactID: number) => any;
}> = ({ contacts, handleAdd, handleEdit, handleRemove }) => {
  const { t } = useTranslation("account");
  const editable = Boolean(handleAdd || handleEdit || handleRemove);

  // Dialog control
  const [showAdd, setShowAdd] = useState<boolean>(false);

  return (
    <Section
      element={(props) => (
        <section {...props} aria-labelledby="header-contacts" />
      )}
    >
      <Columns columns={3} className="!items-end">
        <Header
          className="md:col-span-2"
          element={(props) => <h2 {...props} id="header-contacts" />}
        >
          {t("profile.contacts.title")}
        </Header>
        <Actions>
          {editable && (
            <Button
              appearance="tonal"
              icon={<MaterialIcon icon="add" />}
              onClick={() => setShowAdd(true)}
            >
              {t("profile.contacts.action.add")}
            </Button>
          )}
          <ContactDialog
            open={showAdd}
            onClose={() => setShowAdd(false)}
            onSubmit={(contact) => {
              va.track("Add Contact");
              setShowAdd(false);
              if (handleAdd) handleAdd(contact);
            }}
          />
        </Actions>
      </Columns>
      {contacts.length ? (
        <Columns columns={4}>
          {contacts.map((contact, idx) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onChange={
                editable
                  ? (contact) => handleEdit && handleEdit(contact, idx)
                  : undefined
              }
              onRemove={
                editable
                  ? () => handleRemove && handleRemove(contact.id)
                  : undefined
              }
            />
          ))}
        </Columns>
      ) : (
        <Card
          appearance="outlined"
          className="box-content !grid h-[4.5rem] place-content-center"
        >
          <p className="skc-body-medium text-on-surface-variant">
            {t("profile.contacts.noContacts")}
          </p>
        </Card>
      )}
    </Section>
  );
};

export default ContactsSection;
