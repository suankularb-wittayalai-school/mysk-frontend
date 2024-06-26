import ContactCard from "@/components/account/ContactCard";
import ContactDialog from "@/components/account/ContactDialog";
import ProfileLayout from "@/components/account/ProfileLayout";
import getContactsOfPerson from "@/utils/backend/contact/getContactsOfPerson";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import getPersonIDFromUser from "@/utils/backend/person/getPersonIDFromUser";
import useContactActions from "@/utils/helpers/contact/useContactActions";
import { CustomPage } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import {
  Actions,
  Button,
  Columns,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useState } from "react";

/**
 * The Your Contacts page lets the user manage their Contacts.
 *
 * @param contacts The list of Contacts of the currently logged-in user.
 * @param personID The ID of the Person of the currently logged-in user.
 */
const YourContactsPage: CustomPage<{
  contacts: Contact[];
  personID: string;
}> = ({ contacts, personID }) => {
  const { t } = useTranslation("account/contacts");

  const { handleAdd, handleRemove, handleEdit } = useContactActions(personID);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{t("common:tabName", { tabName: t("title") })}</title>
      </Head>
      <ProfileLayout title={t("title")}>
        {/* Add Button */}
        <Actions align="left" className="mb-3">
          <Button
            appearance="filled"
            icon={<MaterialIcon icon="add" />}
            onClick={() => setAddOpen(true)}
          >
            {t("action.add")}
          </Button>
          <ContactDialog
            open={addOpen}
            onClose={() => setAddOpen(false)}
            onSubmit={(contact) => {
              setAddOpen(false);
              handleAdd(contact);
            }}
          />
        </Actions>
        <Text type="body-medium" element="p" className="mb-5">
          {t("desc")}
        </Text>

        {/* List */}
        <Columns columns={3}>
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onChange={handleEdit}
              onRemove={() => handleRemove(contact.id)}
            />
          ))}
        </Columns>
      </ProfileLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const mysk = await createMySKClient(req);
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });
  const role = mysk.user!.role;

  const { data: personID } = await getPersonIDFromUser(supabase, mysk.user!);
  const { data: contacts } = await getContactsOfPerson(supabase, personID!);

  return { props: { contacts, personID, role } };
};

export default YourContactsPage;
