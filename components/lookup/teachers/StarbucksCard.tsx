import SnackbarContext from "@/contexts/SnackbarContext";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import {
  AssistChip,
  Card,
  ChipSet,
  MaterialIcon,
  Snackbar,
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import { unique } from "radash";
import { forwardRef, useContext, useEffect, useState } from "react";

/**
 * A sneaky easter egg for one of our advisors! This card is expected to only
 * be shown for Supannee’s Teacher Details Card.
 */
const StarbucksCard: StylableFC = ({ style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("lookup", {
    keyPrefix: "teachers.detail.starbucks",
  });

  const plausible = usePlausible();
  const { setSnackbar } = useContext(SnackbarContext);

  const [synthVoices, setSynthVoices] = useState<SpeechSynthesisVoice[]>();

  useEffect(() => {
    // Get the SpeechSynthesis object.
    const { speechSynthesis } = window;

    // See: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#javascript_2

    // Read the voices list.
    let voices = speechSynthesis.getVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        voices = voices.concat(speechSynthesis.getVoices());
      };
    }

    // Filter for voices with key `lang` of `th-TH` or `th_TH`.
    voices = unique(
      voices.filter((voice) => /th(-|_)TH/.test(voice.lang)),
      ({ voiceURI }) => voiceURI,
    );

    // Set the voice list state.
    setSynthVoices(voices);

    // Cleanup.
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  /**
   * Handles the read aloud action using the browser's Speech Synthesis API.
   */
  function handleReadAloud() {
    // Track easter egg discovery.
    plausible("Find Starbucks Easter Egg", {
      props: { action: "Read aloud", successful: Boolean(synthVoices?.length) },
    });

    // If no Thai voices found, the user is notified of the failure.
    if (!synthVoices?.length) {
      setSnackbar(<Snackbar>{t("snackbar.thaiSpeechNotSupported")}</Snackbar>);
      return;
    }

    // Create the `SpeechSynthesisUtterance` object.
    const textToUtter = [t("order.line1"), t("order.line2")].join("; ");
    const utterance = new SpeechSynthesisUtterance(textToUtter);

    // Configure the utterance.
    utterance.lang = "th-TH";
    utterance.voice =
      synthVoices.find(
        (voice) =>
          voice.voiceURI ===
          "Microsoft Premwadee Online (Natural) - Thai (Thailand)",
      ) || null;

    // Speak the utterance.
    speechSynthesis.speak(utterance);
  }

  return (
    <Card
      appearance="filled"
      direction="row"
      style={style}
      className={cn(
        `items-start !border-0 !bg-surface !bg-gradient-to-l
        from-[#82998760] px-4 py-3 sm:px-5 sm:py-4`,
        className,
      )}
    >
      <div className="flex grow flex-col gap-2">
        <Text
          type="title-medium"
          className="!font-body"
          element={(props) => <div {...props} lang="th" />}
        >
          <p>{t("order.line1")}</p>
          <p>{t("order.line2")}</p>
        </Text>
        <ChipSet>
          <AssistChip
            icon={<MaterialIcon icon="volume_up" />}
            onClick={handleReadAloud}
          >
            {t("action.readAloud")}
          </AssistChip>
          <AssistChip
            icon={<MaterialIcon icon="open_in_new" />}
            href={`https://www.starbucks.co.th/${locale}/delivery-in-app/`}
            onClick={() =>
              plausible("Find Starbucks Easter Egg", {
                props: { action: "Open Starbucks" },
              })
            }
            // eslint-disable-next-line react/display-name
            element={forwardRef((props, ref) => (
              <a {...props} ref={ref} target="_blank" rel="noreferrer" />
            ))}
          >
            {t("action.openStarbucks")}
          </AssistChip>
        </ChipSet>
      </div>
      <div className="my-1 hidden rounded-full bg-surface p-2 text-primary sm:block">
        <MaterialIcon icon="auto_awesome" />
      </div>
    </Card>
  );
};

export default StarbucksCard;
