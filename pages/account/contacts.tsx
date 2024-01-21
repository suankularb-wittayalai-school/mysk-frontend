import ContactCard from "@/components/account/ContactCard";
import ContactDialog from "@/components/account/ContactDialog";
import ProfileLayout from "@/components/account/ProfileLayout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getContactsOfPerson from "@/utils/backend/contact/getContactsOfPerson";
import getPersonIDFromUser from "@/utils/backend/person/getPersonIDFromUser";
import useContactActions from "@/utils/helpers/contact/useContactActions";
import { CustomPage, LangCode } from "@/utils/types/common";
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
import { getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
  const { t } = useTranslation("account", { keyPrefix: "contacts" });
  const { t: tx } = useTranslation("common");

  const { handleAdd, handleRemove, handleEdit } = useContactActions(personID);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "Your contacts" })}</title>
      </Head>
      <ProfileLayout>
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

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });
  const session = await getServerSession(req, res, authOptions);
  const { data: user } = await getUserByEmail(supabase, session!.user!.email!);

  const { data: personID } = await getPersonIDFromUser(supabase, user!);
  const { data: contacts } = await getContactsOfPerson(supabase, personID!);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
      ])),
      contacts,
      personID,
    },
  };
};

export default YourContactsPage;
