"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

/**
 * Available animation variants for the modal
 */
export type ModalAnimationVariant =
  | "fade"
  | "scale"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom"
  | "flip"
  | "none";

/**
 * Modal size presets
 */
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Modal position on screen
 */
export type ModalPosition = "center" | "top" | "bottom" | "left" | "right";

interface IModalState {
  /** Currently open modal ID (if any) */
  openModalId: string | null;
  /** Animation variant */
  animation: ModalAnimationVariant;
  /** Allow closing by clicking overlay */
  closeOnOverlayClick: boolean;
  /** Allow closing by pressing Escape */
  closeOnEscape: boolean;
  /** Is animation in progress */
  isAnimating: boolean;
}

interface IModalActions {
  /**
   * Open modal by ID
   */
  openModal: (id: string) => void;
  /**
   * Close currently open modal
   */
  closeModal: () => void;
  /**
   * Set animation variant
   */
  setAnimation: (animation: ModalAnimationVariant) => void;
  /**
   * Set close on overlay click behavior
   */
  setCloseOnOverlayClick: (value: boolean) => void;
  /**
   * Set close on escape behavior
   */
  setCloseOnEscape: (value: boolean) => void;
  /**
   * Set animation state
   */
  setIsAnimating: (value: boolean) => void;
}

export type ModalStore = IModalState & IModalActions;

export const useModalStore = create<ModalStore>()(
  devtools(
    (set) => ({
      // State
      openModalId: null,
      animation: "scale",
      closeOnOverlayClick: true,
      closeOnEscape: true,
      isAnimating: false,

      // Actions
      openModal: (id: string) => set({ openModalId: id }, false, "openModal"),
      closeModal: () => set({ openModalId: null }, false, "closeModal"),
      setAnimation: (animation: ModalAnimationVariant) => set({ animation }, false, "setAnimation"),
      setCloseOnOverlayClick: (value: boolean) =>
        set({ closeOnOverlayClick: value }, false, "setCloseOnOverlayClick"),
      setCloseOnEscape: (value: boolean) => set({ closeOnEscape: value }, false, "setCloseOnEscape"),
      setIsAnimating: (value: boolean) => set({ isAnimating: value }, false, "setIsAnimating"),
    }),
    {
      name: "modal-store",
    },
  ),
);

export const useModalState = () =>
  useModalStore(
    useShallow((state) => ({
      animation: state.animation,
      closeOnEscape: state.closeOnEscape,
      closeOnOverlayClick: state.closeOnOverlayClick,
      isAnimating: state.isAnimating,
      openModalId: state.openModalId,
    })),
  );

export const useModalActions = () =>
  useModalStore(
    useShallow((state) => ({
      closeModal: state.closeModal,
      openModal: state.openModal,
      setAnimation: state.setAnimation,
      setCloseOnEscape: state.setCloseOnEscape,
      setCloseOnOverlayClick: state.setCloseOnOverlayClick,
      setIsAnimating: state.setIsAnimating,
    })),
  );
