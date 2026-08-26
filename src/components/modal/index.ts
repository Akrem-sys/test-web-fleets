export { MODAL_IDS } from "./lib/constants";
export type {
  ModalAnimationVariant,
  ModalPosition,
  ModalSize,
} from "./lib/store/modal-store";
export { useModalActions, useModalState, useModalStore } from "./lib/store/modal-store";

import { ModalBody } from "./ui/ModalBody";
import { ModalClose } from "./ui/ModalClose";
import { ModalContent } from "./ui/ModalContent";
import { ModalFooter } from "./ui/ModalFooter";
import { ModalHeader } from "./ui/ModalHeader";
import { ModalOverlay } from "./ui/ModalOverlay";
import { ModalReturn } from "./ui/ModalReturn";
import { ModalRoot } from "./ui/ModalRoot";

export const Modal = Object.assign(ModalRoot, {
  Overlay: ModalOverlay,
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Close: ModalClose,
  Return: ModalReturn,
});
