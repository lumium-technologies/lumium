import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRouter } from "next/router";

const PageTransition = ({ children }) => {
    const { asPath } = useRouter();
    const shouldReduceMotion = useReducedMotion();

    const variants = {
        out: {
            opacity: 0,
            transition: {
                duration: 0.05
            }
        },
        in: {
            opacity: 1,
            transition: {
                duration: 0.05,
            }
        }
    };

    return (
        <div className="lumium-page-transition">
            <AnimatePresence initial={false} exitBeforeEnter>
                <motion.div
                    key={asPath}
                    variants={shouldReduceMotion ? undefined : variants}
                    animate="in"
                    initial="out"
                    exit="out">
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export { PageTransition };
