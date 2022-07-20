// Modules
import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useReducer } from "react";

// SK Components
import {
  Section,
  Actions,
  Button,
  MaterialIcon,
  Header,
} from "@suankularb-components/react";

// Types
import { WaitingSnackbar } from "@utils/types/common";

export const PublishArticle = ({
  handlePublish: handlePublishExt,
  allowPublish,
  addToSnbQueue,
}: {
  handlePublish: Promise<{ data: any; error: Partial<PostgrestError> | null }>;
  allowPublish: boolean;
  addToSnbQueue?: (newSnb: WaitingSnackbar) => void;
}): JSX.Element => {
  const router = useRouter();
  const [loading, toggleLoading] = useReducer((state) => !state, false);
  const { t } = useTranslation("admin");

  async function handlePublish() {
    toggleLoading();
    const { data, error } = await handlePublishExt;
    if (error) {
      if (addToSnbQueue) {
        addToSnbQueue({
          id: "publish-error",
          text: t("error", { errorMsg: error.message || "unkown error" }),
        });
      }
      toggleLoading();
    } else if (data) router.push("/t/admin/news");
  }

  return (
    <Section>
      <Header
        icon={<MaterialIcon icon="publish" allowCustomSize />}
        text={t("articleEditor.publish.title")}
      />
      <p>{t("articleEditor.publish.supportingText")}</p>
      <Actions>
        <Button
          label={t("articleEditor.publish.action.pushToPublic")}
          type="filled"
          disabled={!allowPublish || loading}
          onClick={handlePublish}
        />
      </Actions>
    </Section>
  );
};
