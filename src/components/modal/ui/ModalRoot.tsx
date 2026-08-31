"use client";

import { AnimatePresence } from "framer-motion";
import * as React from "react";
import { createPortal } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { type ModalAnimationVariant, useModalStore } from "../lib/store/modal-store";

/**
 * Props for the root Modal component
 */
export interface IModalRootProps {
  /** Unique modal identifier */
  id: string;
  /** Animation variant to use */
  animation?: ModalAnimationVariant;
  /** Allow closing by clicking overlay */
  closeOnOverlayClick?: boolean;
  /** Allow closing by pressing Escape */
  closeOnEscape?: boolean;
  /** Children components */
  children: React.ReactNode;
}

/** Root Modal component that wraps all modal subcomponents. */
export const ModalRoot = ({
  id,
  animation = "scale",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
}: IModalRootProps) => {
  const { openModalId, setAnimation, setCloseOnOverlayClick, setCloseOnEscape, closeModal } = useModalStore();

  const isOpen = openModalId === id;

  React.useEffect(() => {
    const workspace = document.getElementById("app-root");
    if (!workspace) return;
    const hasProgressiveBlur = workspace.querySelector("[data-progressive-blur]") !== null;
    workspace.style.transition = "filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease";
    if (isOpen) {
      workspace.style.filter = hasProgressiveBlur ? "" : "blur(10px)";
      workspace.style.opacity = hasProgressiveBlur ? "" : "0.8";
      workspace.style.transform = "scale(0.9)";
      workspace.style.transformOrigin = "center center";
    } else {
      workspace.style.filter = "";
      workspace.style.opacity = "";
      workspace.style.transform = "";
      workspace.style.transformOrigin = "";
    }
    return () => {
      workspace.style.filter = "";
      workspace.style.opacity = "";
      workspace.style.transform = "";
      workspace.style.transformOrigin = "";
      workspace.style.transition = "";
    };
  }, [isOpen]);

  const portalElement = typeof document === "undefined" ? null : document.body;

  // Set modal configuration when props change
  React.useEffect(() => {
    if (isOpen) {
      setAnimation(animation);
      setCloseOnOverlayClick(closeOnOverlayClick);
      setCloseOnEscape(closeOnEscape);
    }
  }, [
    isOpen,
    animation,
    closeOnOverlayClick,
    closeOnEscape,
    setAnimation,
    setCloseOnOverlayClick,
    setCloseOnEscape,
  ]);

  useHotkeys(
    "escape",
    (e) => {
      e.preventDefault();
      if (isOpen && closeOnEscape) {
        closeModal();
      }
    },
    {
      enabled: isOpen && closeOnEscape,
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
    },
  );

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !portalElement) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {/* Single keyed child: AnimatePresence mode="wait" misbehaves with several children */}
      <React.Fragment key={id}>
        {React.Children.map(children, (child, index) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { key: child.key ?? `${id}-${index}` })
            : child,
        )}
      </React.Fragment>
    </AnimatePresence>,
    portalElement,
  );
};
