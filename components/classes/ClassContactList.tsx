// Imports
import ContactCard from "@/components/account/ContactCard";
import ContactDialog from "@/components/account/ContactDialog";
import ClassDetailsListSection from "@/components/classes/ClassDetailsListSection";
import SnackbarContext from "@/contexts/SnackbarContext";
import createClassroomContact from "@/utils/backend/classroom/createClassroomContact";
import deleteContact from "@/utils/backend/contact/deleteContact";
import updateContact from "@/utils/backend/contact/updateContact";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import {
  Button,
  MaterialIcon,
  Snackbar,
  Text,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import { useContext, useState } from "react";
import va from "@vercel/analytics";

/**
 * A list of Contacts for Class Details Card. It can be used in both read-only and editable modes.
 *
 * @param contacts The list of contacts to display.
 * @param classroomID The ID of the Classroom the Contacts belong to.
 * @param editable Whether the list is editable or not.
 */
const ClassContactList: StylableFC<{
  contacts: Contact[];
  classroomID: string;
  editable?: boolean;
  refreshData: () => void;
}> = ({ contacts, classroomID, editable, refreshData, style, className }) => {
  const { t } = useTranslation("classes", { keyPrefix: "detail.contacts" });
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);

  const supabase = useSupabaseClient();

  const [contactOpen, setContactOpen] = useState(false);

  async function handleAdd(contact: Contact) {
    setContactOpen(false);
    const { error } = await createClassroomContact(
      supabase,
      contact,
      classroomID,
    );
    va.track("Add Classroom Contact");
    if (error) {
      setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
      setContactOpen(true);
      return;
    }
    refreshData();
  }

  async function handleEdit(contact: Contact) {
    setContactOpen(false);
    const { error } = await updateContact(supabase, contact);
    va.track("Edit Classroom Contact");
    if (error) {
      setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
      return;
    }
    refreshData();
  }

  async function handleRemove(contactID: string) {
    setContactOpen(false);
    const { error } = await deleteContact(supabase, contactID);
    if (error) {
      setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
      return;
    }
    refreshData();
  }

  return (
    <ClassDetailsListSection
      title={
        <>
          <Text type="title-medium" element="h3" className="grow">
            {t("title")}
          </Text>
          {editable && (
            <>
              <Button
                appearance="text"
                icon={<MaterialIcon icon="add" />}
                tooltip={t("action.add")}
                onClick={() => setContactOpen(true)}
                className="!-m-2 !-mr-3"
              />
              <ContactDialog
                open={contactOpen}
                onClose={() => setContactOpen(false)}
                onSubmit={handleAdd}
              />
            </>
          )}
        </>
      }
      style={style}
      className={className}
    >
      {contacts.map((contact) => (
        <li key={contact.id}>
          <ContactCard
            contact={contact}
            onChange={editable ? handleEdit : undefined}
            onRemove={editable ? () => handleRemove(contact.id) : undefined}
            className={cn(
              `!border-0`,
              !editable &&
                `hover:m-[-1px] hover:!border-1 focus:m-[-1px]
                focus:!border-1`,
            )}
          />
        </li>
      ))}
    </ClassDetailsListSection>
  );
};

export default ClassContactList;
