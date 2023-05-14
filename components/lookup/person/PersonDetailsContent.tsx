// External libraries
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { FC, forwardRef, useContext, useEffect, useState } from "react";

// SK Components
import {
  AssistChip,
  Card,
  ChipSet,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
  Snackbar,
} from "@suankularb-components/react";

// Internal components
import ContactCard from "@/components/account/ContactCard";
import MultilangText from "@/components/common/MultilingualText";
import DetailSection from "@/components/lookup/person/DetailSection";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Types
import { Student, Teacher } from "@/utils/types/person";

// Helpers
import { nameJoiner } from "@/utils/helpers/name";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";

const StarbucksCard: FC = () => {
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "people" });

  const { setSnackbar } = useContext(SnackbarContext);

  const [synthVoices, setSynthVoices] = useState<SpeechSynthesisVoice[]>();

  useEffect(() => {
    // Get the SpeechSynthesis object
    const { speechSynthesis } = window;

    // See https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#javascript_2
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        // Read the voices list
        const voices = speechSynthesis
          .getVoices()
          // Filter for voices with key `lang` of `th-TH` or `th_TH`
          .filter((voice) => /th(-|_)TH/.test(voice.lang));

        // Set the voice list state
        setSynthVoices(voices);
      };
    }

    // Cleanup
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  function handleReadAloud() {
    // Track easter egg discovery
    va.track("Find Starbucks Easter Egg", {
      action: "Read aloud",
      successful: Boolean(synthVoices?.length),
    });

    // If no Thai voices found, the user is notified of the failure
    if (!synthVoices?.length) {
      setSnackbar(<Snackbar>{t("snackbar.thaiSpeechNotSupported")}</Snackbar>);
      return;
    }

    // Create the SpeechSynthesisUtterance object
    const textToUtter = [
      t("detail.starbucks.order.line1"),
      t("detail.starbucks.order.line2"),
    ].join("; ");
    const utterance = new SpeechSynthesisUtterance(textToUtter);

    // Configure the utterance
    utterance.lang = "th-TH";
    utterance.voice =
      synthVoices.find(
        (voice) =>
          voice.voiceURI ===
          "Microsoft Premwadee Online (Natural) - Thai (Thailand)"
      ) || null;

    // Speak the utterance
    speechSynthesis.speak(utterance);
  }

  return (
    <Card
      appearance="outlined"
      direction="row"
      className="mx-4 items-start bg-gradient-to-l from-[#82998760] px-4 py-3
        sm:mx-0 sm:px-5 sm:py-4"
    >
      <div className="flex grow flex-col gap-2">
        <div className="skc-title-medium !font-body" lang="th">
          <p>{t("detail.starbucks.order.line1")}</p>
          <p>{t("detail.starbucks.order.line2")}</p>
        </div>
        <ChipSet>
          <AssistChip
            icon={<MaterialIcon icon="volume_up" />}
            onClick={handleReadAloud}
          >
            {t("detail.starbucks.action.readAloud")}
          </AssistChip>
          <AssistChip
            icon={<MaterialIcon icon="open_in_new" />}
            onClick={() =>
              va.track("Find Starbucks Easter Egg", {
                action: "Open Starbucks",
              })
            }
            // eslint-disable-next-line react/display-name
            element={forwardRef((props, ref) => (
              <a
                {...props}
                ref={ref}
                href={`https://www.starbucks.co.th/${locale}/delivery-in-app/`}
                target="_blank"
                rel="noreferrer"
              />
            ))}
          >
            {t("detail.starbucks.action.openStarbucks")}
          </AssistChip>
        </ChipSet>
      </div>
      <div className="my-1 hidden rounded-full bg-surface p-2 text-primary sm:block">
        <MaterialIcon icon="auto_awesome" />
      </div>
    </Card>
  );
};

const GeneralInfoSection: FC<{
  person: Student | Teacher;
}> = ({ person }) => {
  const locale = useLocale();
  const { t } = useTranslation(["lookup", "common"]);

  return (
    <Section className="!grid grid-cols-2 !gap-x-6 md:grid-cols-4">
      {/* Full name */}
      <DetailSection
        title={t("people.detail.general.fullName")}
        className="col-span-2 sm:col-span-1 md:col-span-2"
      >
        <MultilangText
          text={{
            th: nameJoiner("th", person.name, person.prefix, { prefix: true }),
            "en-US": person.name["en-US"]
              ? nameJoiner("en-US", person.name, person.prefix, {
                  prefix: true,
                })
              : undefined,
          }}
          options={{ hideIconsIfOnlyLanguage: true }}
        />
      </DetailSection>

      {/* Class */}
      {person.role === "student" && person.class && (
        <DetailSection title={t("people.detail.general.class.title")}>
          <span className="block">
            {t("class", { ns: "common", number: person.class.number })}
          </span>
          <span className="block">
            {t("people.detail.general.class.classNo", {
              classNo: person.classNo,
            })}
          </span>
        </DetailSection>
      )}
      {person.role === "teacher" && person.classAdvisorAt && (
        <DetailSection title="Class advisor at">
          <span>
            {t("class", {
              ns: "common",
              number: person.classAdvisorAt.number,
            })}
          </span>
        </DetailSection>
      )}

      {/* Birthdate */}
      <DetailSection title={t("people.detail.general.birthdate")}>
        <time>
          {new Date(person.birthdate).toLocaleDateString(locale, {
            day: "numeric",
            month: "long",
            year: undefined,
          })}
        </time>
      </DetailSection>
    </Section>
  );
};

const PersonDetailsContent: FC<{
  person: Student | Teacher;
}> = ({ person }) => {
  const { t } = useTranslation("lookup", { keyPrefix: "people.detail" });

  return (
    <ContentLayout>
      {person.name["en-US"]?.firstName === "Supannee" && <StarbucksCard />}
      <GeneralInfoSection {...{ person }} />
      {person.contacts.length > 0 && (
        <Section>
          <Header level={3}>{t("contacts.title")}</Header>
          <Columns columns={2}>
            {person.contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </Columns>
        </Section>
      )}
    </ContentLayout>
  );
};

export default PersonDetailsContent;
