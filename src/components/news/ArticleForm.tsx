// Modules
import { AnimatePresence, Reorder } from "framer-motion";
import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Actions,
  Card,
  CardHeader,
  Header,
  MaterialIcon,
  Section,
} from "@suankularb-components/react";

// Utils
import { FormField } from "@utils/types/news";
import { LangCode } from "@utils/types/common";

// Helpers
import { getLocaleString } from "@utils/helpers/i18n";
import { animationTransition } from "@utils/animations/config";

const ArticleForm = ({
  mode,
  setFields: setExtFields,
}: {
  mode: "add" | "edit";
  setFields: (incFields: Omit<FormField, "id">[]) => void;
}): JSX.Element => {
  const { t } = useTranslation("admin");
  const locale = useRouter().locale as LangCode;

  // Form control
  const [fields, setFields] = useState<FormField[]>([]);
  const [latestID, incrementID] = useReducer((value) => value + 1, 0);
  useEffect(() => setExtFields(fields), [fields]);

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="table" allowCustomSize />}
        text="Form"
      />
      <Actions>
        <button
          onClick={() => {
            setFields([
              {
                id: latestID,
                label: { th: `Test Question ${latestID}` },
                type: "short_answer",
                required: false,
              },
              ...fields,
            ]);
            incrementID();
          }}
          className="bg-red-900"
        >
          Add to list
        </button>
      </Actions>
      <Reorder.Group
        axis="y"
        values={fields}
        onReorder={setFields}
        className="flex flex-col gap-2"
      >
        {fields.map((field) => (
          <Reorder.Item
            key={field.id}
            value={field}
            initial={{ y: -10, scale: 0.8, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -10, scale: 0.8, opacity: 0 }}
            transition={animationTransition}
          >
            <Card type="stacked" appearance="tonal" className="drag:">
              <CardHeader
                title={<h3>{getLocaleString(field.label, locale)}</h3>}
                label={<code>{field.type}</code>}
              />
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <div className="flex flex-col gap-2"></div>
    </Section>
  );
};

export default ArticleForm;
