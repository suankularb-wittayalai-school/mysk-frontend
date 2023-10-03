// Imports
import ContactCard from "@/components/account/ContactCard";
import MultilangText from "@/components/common/MultilingualText";
import DetailSection from "@/components/lookup/person/DetailSection";
import SnackbarContext from "@/contexts/SnackbarContext";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import useLocale from "@/utils/helpers/useLocale";
import { Student, Teacher } from "@/utils/types/person";
import { Subject } from "@/utils/types/subject";
import {
  AssistChip,
  Card,
  CardHeader,
  ChipSet,
  Columns,
  ContentLayout,
  Header,
  MaterialIcon,
  Section,
  Snackbar,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { FC, forwardRef, useContext, useEffect, useState } from "react";

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
          "Microsoft Premwadee Online (Natural) - Thai (Thailand)",
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
            href={`https://www.starbucks.co.th/${locale}/delivery-in-app/`}
            onClick={() =>
              va.track("Find Starbucks Easter Egg", {
                action: "Open Starbucks",
              })
            }
            // eslint-disable-next-line react/display-name
            element={forwardRef((props, ref) => (
              <a {...props} ref={ref} target="_blank" rel="noreferrer" />
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
  const { t } = useTranslation("lookup", {
    keyPrefix: "people.detail.general",
  });
  const { t: tx } = useTranslation("common");

  return (
    <Section className="!grid grid-cols-2 !gap-x-6 md:grid-cols-4">
      {/* Full name */}
      <DetailSection
        title={t("fullName")}
        className="col-span-2 sm:col-span-1 md:col-span-2"
      >
        <MultilangText
          text={{
            th: getLocaleName("th", person, { prefix: true }),
            "en-US": getLocaleName("en-US", person, {
              prefix: true,
            }),
          }}
          options={{ hideIconsIfOnlyLanguage: true }}
        />
      </DetailSection>

      {/* Nickname */}
      {(person.nickname?.th || person.nickname
        ? person.nickname["en-US"]
        : "") && (
        <DetailSection title={t("nickname")}>
          <MultilangText
            text={{
              th: person.nickname!.th,
              "en-US": person.nickname!["en-US"],
            }}
            options={{ hideIconsIfOnlyLanguage: true }}
          />
        </DetailSection>
      )}

      {/* Class */}
      {person.role === "student" && person.classroom && (
        <DetailSection title={t("class.title")}>
          <span className="block">
            {tx("class", { number: person.classroom.number })}
          </span>
          <span className="block">
            {t("class.classNo", { classNo: person.class_no })}
          </span>
        </DetailSection>
      )}
      {person.role === "teacher" && person.class_advisor_at && (
        <DetailSection title={t("classAdvisorAt")}>
          <span>{tx("class", { number: person.class_advisor_at.number })}</span>
        </DetailSection>
      )}

      {/* Birthdate */}
      {person.birthdate &&
        // Assuming no real person is born on Jan 1, 1970
        person.birthdate !== "1970-01-01" && (
          <DetailSection title={t("birthdate")}>
            <time>
              {new Date(person.birthdate).toLocaleDateString(locale, {
                day: "numeric",
                month: "long",
                year: undefined,
              })}
            </time>
          </DetailSection>
        )}
    </Section>
  );
};

const SubjectsSection: FC<{
  subjects: Pick<Subject, "id" | "code" | "name" | "short_name">[];
}> = ({ subjects }) => {
  const locale = useLocale();
  const { t } = useTranslation("lookup", { keyPrefix: "people.detail" });

  return (
    <Section>
      <Header level={3}>{t("subjects.title")}</Header>
      <Columns columns={2}>
        {subjects.map((subject) => (
          <Card key={subject.id} appearance="outlined" direction="row">
            <CardHeader
              title={getLocaleString(subject.name, locale)}
              subtitle={getLocaleString(subject.code, locale)}
            />
          </Card>
        ))}
      </Columns>
    </Section>
  );
};

const PersonDetailsContent: FC<{
  person: Student | Teacher;
}> = ({ person }) => {
  const { t } = useTranslation("lookup", { keyPrefix: "people.detail" });

  return (
    <ContentLayout>
      {person.first_name["en-US"] === "Supannee" && <StarbucksCard />}
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
      {person.role === "teacher" &&
        person.subjects_in_charge &&
        person.subjects_in_charge.length !== 0 && (
          <SubjectsSection subjects={person.subjects_in_charge} />
        )}
    </ContentLayout>
  );
};

export default PersonDetailsContent;
