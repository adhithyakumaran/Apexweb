export const smoothEase = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export const cardReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export const defaultViewport = {
  once: true,
  amount: 0.25,
  margin: "-40px",
} as const;

export const defaultTransition = {
  duration: 0.75,
  ease: smoothEase,
};

export const cardTransition = {
  duration: 0.8,
  ease: smoothEase,
};
