"use client";

import type * as React from "react";

/**
 * Props for Modal.Footer component
 */
export interface IModalFooterProps {
  /** Custom className */
  className?: string;
  /** Footer alignment */
  align?: "left" | "center" | "right" | "space-between";
  /** Children components */
  children: React.ReactNode;
}

/**
 * Alignment mapping
 */
const alignMap = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
  "space-between": "justify-between",
};

/**
 * Modal footer component for actions and buttons
 *
 * @example
 * ```tsx
 * <Modal.Footer align="right">
 *   <button>Cancel</button>
 *   <button>Confirm</button>
 * </Modal.Footer>
 * ```
 */
export const ModalFooter = ({ className = "", align = "right", children }: IModalFooterProps) => {
  const alignClass = alignMap[align];

  return <div className={`flex items-center gap-3 mt-4 ${alignClass} ${className}`}>{children}</div>;
};
