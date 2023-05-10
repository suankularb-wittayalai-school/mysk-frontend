// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { FC, useContext } from "react";

// SK Components
import {
  Card,
  CardHeader,
  Columns,
  ContentLayout,
  Header,
  Section,
  Snackbar,
} from "@suankularb-components/react";

// Internal components
import ContactsSection from "@/components/account/ContactSection";
import DynamicAvatar from "@/components/common/DynamicAvatar";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Backend
import {
  addContactToClassroom,
  removeContactFromClassroom,
} from "@/utils/backend/classroom/classroom";
import {
  createContact,
  deleteContact,
  updateContact,
} from "@/utils/backend/contact";

// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useRefreshProps } from "@/utils/hooks/routing";

// Types
import { ClassOverview as ClassOverviewType } from "@/utils/types/class";
import { Contact } from "@/utils/types/contact";
import { Teacher } from "@/utils/types/person";

/**
 * Displays a list of this class’ Class Advisors.
 *
 * @param advisors The list of Advisors to display.
 *
 * @returns A Section.
 */
const AdvisorsSection: FC<{ advisors: Teacher[] }> = ({ advisors }) => {
  const locale = useLocale();
  const { t } = useTranslation("class");

  return (
    <Section>
      <Header>{t("overview.classAdvisors.title")}</Header>
      <Columns columns={3}>
        {advisors.map((teacher) => (
          <Card
            key={teacher.id}
            appearance="outlined"
            stateLayerEffect
            href={`/lookup/person?id=${teacher.id}&role=teacher`}
            element={Link}
          >
            <CardHeader
              avatar={<DynamicAvatar profile={teacher.profile} />}
              title={nameJoiner(locale, teacher.name)}
              subtitle={getLocaleString(teacher.subjectGroup.name, locale)}
            />
          </Card>
        ))}
      </Columns>
    </Section>
  );
};

/**
 * Displays a list of this class’ Contacts. The Class Advisors of this class
 * can also edit this list.
 *
 * @param advisors The list of Contacts to display.
 */
const ClassContactsSection: FC<{
  contacts: Contact[];
  classID?: number;
  editable?: boolean;
}> = ({ contacts, classID, editable }) => {
  const { t } = useTranslation("common");
  const { setSnackbar } = useContext(SnackbarContext);
  const refreshProps = useRefreshProps();
  const supabase = useSupabaseClient();

  /**
   * Creates and add a Contact to this class.
   *
   * @param contact The Contact to add.
   */
  async function handleAdd(contact: Contact) {
    const { data, error } = await createContact(supabase, contact);
    if (error) {
      setSnackbar(<Snackbar>{t("snackbar.failure")}</Snackbar>);
      return;
    }

    const { error: classError } = await addContactToClassroom(
      supabase,
      data!.id,
      classID!
    );
    if (classError) {
      setSnackbar(<Snackbar>{t("snackbar.failure")}</Snackbar>);
      return;
    }

    refreshProps();
  }

  /**
   * Edits a given Contact.
   *
   * @param contact The new data for the Contact.
   */
  async function handleEdit(contact: Contact) {
    const { error } = await updateContact(supabase, contact);
    if (error) {
      setSnackbar(<Snackbar>{t("snackbar.failure")}</Snackbar>);
      return;
    }

    refreshProps();
  }

  /**
   * Delete a given Contact from Supabase.
   *
   * @param contactID The ID of the Contact to delete.
   */
  async function handleRemove(contactID: number) {
    const { error } = await removeContactFromClassroom(
      supabase,
      contactID,
      classID!
    );
    if (error) {
      setSnackbar(<Snackbar>{t("snackbar.failure")}</Snackbar>);
      return;
    }

    refreshProps();
  }

  return (
    <ContactsSection
      contacts={contacts}
      handleAdd={editable ? handleAdd : undefined}
      handleEdit={editable ? handleEdit : undefined}
      handleRemove={
        editable ? (contactID) => handleRemove(contactID) : undefined
      }
    />
  );
};

/**
 * Displays an overview of a Class. Used for Class Overview pages like `/class`
 * and `/lookup/class/[classNumber]`. Occupies the full page.
 *
 * @param classItem The overview information (Advisors and Contacts) of the Class to display.
 * @param editable If the user can edit information about this class. Reserved for this class’ Class Advisors and admins.
 *
 * @returns A Content Layout.
 */
const ClassOverview: FC<{
  classItem: ClassOverviewType;
  editable?: boolean;
}> = ({ classItem, editable }) => {
  return (
    <ContentLayout>
      <AdvisorsSection advisors={classItem.classAdvisors} />
      <ClassContactsSection
        contacts={classItem.contacts}
        classID={classItem.id}
        editable={editable}
      />
    </ContentLayout>
  );
};

export default ClassOverview;
