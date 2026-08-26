"use client";

import type * as React from "react";

/**
 * Props for Modal.Body component
 */
export interface IModalBodyProps {
  /** Custom className */
  className?: string;
  /** Children components */
  children: React.ReactNode;
}

/**
 * Modal body component for main content
 *
 * @example
 * ```tsx
 * <Modal.Body>
 *   <p>Modal content goes here</p>
 * </Modal.Body>
 * ```
 */
export const ModalBody = ({ className = "", children }: IModalBodyProps) => {
  return <div className={`flex-1 ${className}`}>{children}</div>;
};
