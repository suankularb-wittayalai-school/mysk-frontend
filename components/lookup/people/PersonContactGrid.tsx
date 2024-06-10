import ContactCard from "@/components/account/ContactCard";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import { UserRole } from "@/utils/types/person";
import { Columns, Text } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

/**
 * A grid of Contacts for Search Students and Search Teachers.
 *
 * @param contacts The Contacts to display.
 */
const PersonContactGrid: StylableFC<{
  role: UserRole.student | UserRole.teacher;
  contacts: Contact[];
}> = ({ role, contacts, style, className }) => {
  const { t } = useTranslation(
    {
      student: "search/students/detail",
      teacher: "search/teachers/detail",
    }[role],
  );

  return (
    <section style={style} className={cn(`space-y-2`, className)}>
      <Text type="title-medium" element="h3" className="px-3">
        {t("contacts.title")}
      </Text>
      <Columns columns={2} className="!gap-2">
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </Columns>
    </section>
  );
};

export default PersonContactGrid;
