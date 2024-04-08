import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { DURATION, EASING, transition, useAnimationConfig } from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

/**
 * A Dialog for showing a larger version of a Person's profile image.
 *
 * @param open Whether the Dialog is open and shown.
 * @param profile The profile image of the Person.
 * @param onClose Triggers when the Dialog is closed.
 */
const PersonAvatarDialog: StylableFC<{
  open?: boolean;
  profile: string;
  onClose: () => void;
}> = ({ open, profile, onClose, style, className }) => {

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Dialog container (for positioning) */}
          <div
            style={style}
            className={cn(
              `pointer-events-none fixed inset-0 z-[100] grid
              place-items-center`,
              className,
            )}
          >
            {/* Dialog */}
            <motion.div
              role="alertdialog"
              aria-modal
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                scale: 0.7,
                opacity: 0,
                transition: transition(DURATION.short4, EASING.standard),
              }}
              transition={transition(DURATION.medium4, EASING.standard)}
              className="pointer-events-auto"
            >
              <Image
                src={profile}
                alt=""
                width={256}
                height={256}
                className="rounded-[50%] bg-surface-variant"
              />
            </motion.div>
          </div>

          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={transition(DURATION.medium4, EASING.standard)}
            className="skc-scrim"
            onClick={onClose}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default PersonAvatarDialog;
