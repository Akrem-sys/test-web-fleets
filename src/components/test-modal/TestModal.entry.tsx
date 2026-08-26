"use client";

import { Test } from "./ui/Test";

export const TestModal = () => {
  return (
    <Test>
      <Test.Trigger>Test it</Test.Trigger>
      <Test.Modal>
        <Test.Modal.Message>Voila</Test.Modal.Message>
      </Test.Modal>
    </Test>
  );
};
