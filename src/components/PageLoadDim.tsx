import { animationEase } from "@utils/animations/config";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PageLoadDim = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [dimmed, setDimmed] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeComplete", () => setLoading(false));
    router.events.on("routeChangeError", () => setLoading(false));

    return () => {
      router.events.off("routeChangeStart", () => setLoading(true));
      router.events.off("routeChangeComplete", () => setLoading(false));
      router.events.off("routeChangeError", () => setLoading(false));
    };
  });

  useEffect(() => {
    if (loading) setTimer(setTimeout(() => setDimmed(true), 1000));
    else {
      if (timer) clearTimeout(timer);
      setDimmed(false);
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {dimmed && (
        <motion.div
          key="page-load"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "tween", duration: 0.3, ease: animationEase }}
          className="fixed inset-0 z-50 cursor-progress items-end justify-end
            bg-[#00000020] dark:bg-[#00000050]"
        />
      )}
    </AnimatePresence>
  );
};

export default PageLoadDim;
