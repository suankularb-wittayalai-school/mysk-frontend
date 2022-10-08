// External libraries
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";

// SK Components
import { Button, MaterialIcon } from "@suankularb-components/react";

// Animation
import { animationTransition } from "@utils/animations/config";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

const CopyButton = ({ textToCopy }: { textToCopy: string }): JSX.Element => {
  const { t } = useTranslation("common");
  const [copied, toggleCopied] = useToggle();

  useEffect(() => {
    if (copied) setTimeout(toggleCopied, 5000);
  }, [copied]);

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      {copied ? (
        <motion.div
          key="copy-done"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={animationTransition}
        >
          <MaterialIcon icon="done" />
        </motion.div>
      ) : (
        <motion.div
          key="copy-button"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={animationTransition}
        >
          <Button
            name={t("action.copy")}
            type="text"
            iconOnly
            icon={<MaterialIcon icon="content_copy" />}
            onClick={() => {
              navigator.clipboard.writeText(textToCopy);
              toggleCopied();
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CopyButton;
