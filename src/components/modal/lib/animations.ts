import type { Variants } from "framer-motion";
import type { ModalAnimationVariant } from "./store/modal-store";

/**
 * Overlay animation variants
 */
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (customOpacity: number = 0.5) => ({
    opacity: customOpacity,
    transition: { duration: 0.2, ease: "easeOut" },
  }),
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
};

/**
 * Content animation variants based on animation type
 */
export const getContentVariants = (animation: ModalAnimationVariant): Variants => {
  switch (animation) {
    case "fade":
      return {
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
        exit: {
          opacity: 0,
          transition: {
            duration: 0.2,
            ease: "easeIn",
          },
        },
      };

    case "scale":
      return {
        hidden: {
          opacity: 0,
          scale: 0.9,
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.3,
            ease: [0.34, 1.56, 0.64, 1], // Custom bezier curve
          },
        },
        exit: {
          opacity: 0,
          scale: 0.9,
          transition: {
            duration: 0.2,
            ease: "easeIn",
          },
        },
      };

    case "slide-up":
      return {
        hidden: {
          opacity: 0,
          y: 50,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
        exit: {
          opacity: 0,
          y: 50,
          transition: {
            duration: 0.2,
            ease: "easeIn",
          },
        },
      };

    case "slide-down":
      return {
        hidden: {
          opacity: 0,
          y: -50,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
        exit: {
          opacity: 0,
          y: -50,
          transition: {
            duration: 0.2,
            ease: "easeIn",
          },
        },
      };

    case "slide-left":
      return {
        hidden: {
          opacity: 0,
          x: 50,
        },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
        exit: {
          opacity: 0,
          x: 50,
          transition: {
            duration: 0.2,
            ease: "easeIn",
          },
        },
      };

    case "slide-right":
      return {
        hidden: {
          opacity: 0,
          x: -50,
        },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
        exit: {
          opacity: 0,
          x: -50,
          transition: {
            duration: 0.2,
            ease: "easeIn",
          },
        },
      };

    case "zoom":
      return {
        hidden: {
          opacity: 0,
          scale: 0.5,
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.4,
            ease: [0.175, 0.885, 0.32, 1.275],
          },
        },
        exit: {
          opacity: 0,
          scale: 0.5,
          transition: {
            duration: 0.2,
            ease: "easeIn",
          },
        },
      };

    case "flip":
      return {
        hidden: {
          opacity: 0,
          rotateX: 90,
        },
        visible: {
          opacity: 1,
          rotateX: 0,
          transition: {
            duration: 0.4,
            ease: "easeOut",
          },
        },
        exit: {
          opacity: 0,
          rotateX: -90,
          transition: {
            duration: 0.3,
            ease: "easeIn",
          },
        },
      };

    case "none":
      return {
        hidden: {},
        visible: {},
        exit: {},
      };

    default:
      return {
        hidden: {
          opacity: 0,
          scale: 0.9,
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
        exit: {
          opacity: 0,
          scale: 0.9,
          transition: {
            duration: 0.2,
            ease: "easeIn",
          },
        },
      };
  }
};
