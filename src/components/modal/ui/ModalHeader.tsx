"use client";

import type * as React from "react";

/**
 * Props for Modal.Header component
 */
export interface IModalHeaderProps {
  /** Custom className */
  className?: string;
  /** Show close button */
  showCloseButton?: boolean;
  /** Children components */
  children: React.ReactNode;
}

/**
 * Modal header component for title and close button
 *
 * @example
 * ```tsx
 * <Modal.Header showCloseButton>
 *   <h2>Modal Title</h2>
 * </Modal.Header>
 * ```
 */
export const ModalHeader = ({ className = "", showCloseButton = false, children }: IModalHeaderProps) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex-1">{children}</div>
      {showCloseButton && (
        <div className="ml-4">{/* Close button will be rendered by ModalClose component */}</div>
      )}
    </div>
  );
};
