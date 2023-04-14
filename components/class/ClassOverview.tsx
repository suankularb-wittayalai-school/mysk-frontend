// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardHeader,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Internal components
import ContactCard from "@/components/account/ContactCard";
import ContactDialog from "@/components/account/ContactDialog";
import DynamicAvatar from "@/components/common/DynamicAvatar";

// Backemd
import { addContactToClassroom } from "@/utils/backend/classroom/classroom";
import { createContact, deleteContact } from "@/utils/backend/contact";

// Helpers
import { getLocaleString } from "@/utils/helpers/i18n";
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { ClassOverview as ClassOverviewType } from "@/utils/types/class";
import { Contact } from "@/utils/types/contact";
import { Teacher } from "@/utils/types/person";

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
            aAttr={{ target: "_blank", rel: "noreferrer" }}
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

const ContactsSection: FC<{
  contacts: Contact[];
  classID?: number;
  editable?: boolean;
}> = ({ contacts, classID, editable }) => {
  // Translation
  const { t } = useTranslation("account");

  // Dialog control
  const [showAdd, setShowAdd] = useState<boolean>(false);

  const router = useRouter();
  const supabase = useSupabaseClient();

  async function handleAdd(contact: Contact) {
    setShowAdd(false);

    const { data, error } = await createContact(supabase, contact);
    if (error) return;

    const { error: classError } = await addContactToClassroom(
      supabase,
      data!.id,
      classID!
    );
    if (classError) return;

    router.replace(router.asPath);
  }
  async function handleEdit(contact: Contact) {
    router.replace(router.asPath);
  }
  async function handleRemove(contactID: number) {
    const { error } = await deleteContact(supabase, contactID);
    if (error) return;
    router.replace(router.asPath);
  }

  return (
    <Section sectionAttr={{ "aria-labelledby": "header-contacts" }}>
      <Columns columns={3} className="!items-end">
        <Header
          className={editable ? "md:col-span-2" : "sm:col-span-2 md:col-span-3"}
          hAttr={{ id: "header-contacts" }}
        >
          {t("profile.contacts.title")}
        </Header>
        {editable && (
          <Actions>
            <Button
              appearance="tonal"
              icon={<MaterialIcon icon="add" />}
              onClick={() => setShowAdd(true)}
            >
              {t("profile.contacts.action.add")}
            </Button>
            <ContactDialog
              open={showAdd}
              onClose={() => setShowAdd(false)}
              onSubmit={handleAdd}
            />
          </Actions>
        )}
      </Columns>
      {contacts.length ? (
        <Columns columns={3}>
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onChange={editable ? handleEdit : undefined}
              onRemove={editable ? () => handleRemove(contact.id) : undefined}
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

const ClassOverview: FC<{
  classItem: ClassOverviewType;
  editable?: boolean;
}> = ({ classItem, editable }) => {
  return (
    <ContentLayout>
      <AdvisorsSection advisors={classItem.classAdvisors} />
      <ContactsSection
        contacts={classItem.contacts}
        classID={classItem.id}
        editable={editable}
      />
    </ContentLayout>
  );
};

export default ClassOverview;
