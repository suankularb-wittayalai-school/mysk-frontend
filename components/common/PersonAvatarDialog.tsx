import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { transition, useAnimationConfig } from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

/**
 * A Dialog for showing a larger version of a Person's profile image.
 *
 * @param open Whether the Dialog is open and shown.
 * @param profile The profile image of the Person.
 * @param onClose Triggers when the Dialog is closed.
 * 
 * @param options Options.
 * @param options.noLayout Whether to disable layout animation. Useful when the layout animation fails.
 */
const PersonAvatarDialog: StylableFC<{
  open?: boolean;
  profile: string;
  onClose: () => void;
  options?: Partial<{ noLayout: boolean }>;
}> = ({ open, profile, onClose, options, style, className }) => {
  const { duration, easing } = useAnimationConfig();

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
              {...(options?.noLayout
                ? {
                    initial: { scale: 0.8, opacity: 0 },
                    animate: { scale: 1, opacity: 1 },
                    exit: {
                      scale: 0.7,
                      opacity: 0,
                      transition: transition(duration.short4, easing.standard),
                    },
                  }
                : { layoutId: profile })}
              transition={transition(duration.medium4, easing.standard)}
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
            transition={transition(duration.medium4, easing.standard)}
            className="skc-scrim"
            onClick={onClose}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default PersonAvatarDialog;
