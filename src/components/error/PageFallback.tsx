// External libraries
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Actions,
  Button,
  Card,
  CardHeader,
  CardSupportingText,
  MaterialIcon,
  RegularLayout,
  Section,
  Title,
} from "@suankularb-components/react";

const PageFallback = ({ error }: { error: Error }): JSX.Element => {
  const { t } = useTranslation("common");
  const router = useRouter();

  return (
    <RegularLayout
      Title={
        <Title
          name={{ title: t("fallback.title") }}
          pageIcon={<MaterialIcon icon="sentiment_very_dissatisfied" />}
          backGoesTo={() => history.back()}
        />
      }
    >
      <Section>
        <h2 className="font-display text-9xl font-bold text-on-surface-variant">
          {t("fallback.title")}
        </h2>
        <Actions align="left">
          <Button
            label={t("fallback.action.back")}
            type="filled"
            icon={<MaterialIcon icon="arrow_back" />}
            onClick={() => history.back()}
          />
          <Button
            label={t("fallback.action.reload")}
            type="outlined"
            icon={<MaterialIcon icon="refresh" />}
            onClick={router.reload}
          />
        </Actions>
      </Section>
      <Section>
        <Card type="stacked" appearance="outlined">
          <CardHeader
            icon={<MaterialIcon icon="folder_open" />}
            title={<h2>{t("fallback.stack")}</h2>}
          />
          <CardSupportingText>
            <code className="font-mono">
              <pre>{error.stack}</pre>
            </code>
          </CardSupportingText>
        </Card>
      </Section>
    </RegularLayout>
  );
};

export default PageFallback;
