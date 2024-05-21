import ContactCard from "@/components/account/ContactCard";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Contact } from "@/utils/types/contact";
import { Columns, Text } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

/**
 * A grid of Contacts for Search Students and Search Teachers.
 *
 * @param contacts The Contacts to display.
 */
const PersonContactGrid: StylableFC<{
  contacts: Contact[];
}> = ({ contacts, style, className }) => {
  const { t } = useTranslation("search/students/detail");

  return (
    <section style={style} className={cn(`space-y-2`, className)}>
      <Text
        type="title-medium"
        element="h3"
        className="rounded-md bg-surface px-3 py-2"
      >
        {t("contacts.title")}
      </Text>
      <Columns columns={2} className="!gap-2">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            className={cn(`!border-0 hover:m-[-1px] hover:!border-1
              focus:m-[-1px] focus:!border-1`)}
          />
        ))}
      </Columns>
    </section>
  );
};

export default PersonContactGrid;
