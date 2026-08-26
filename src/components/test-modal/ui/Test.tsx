"use client";

import type { FC, PropsWithChildren } from "react";

import { Button } from "@/components/button";
import { MODAL_IDS, Modal, useModalActions } from "@/components/modal";

const TestRoot: FC<PropsWithChildren> = ({ children }) => {
	return (
		<main className="flex min-h-screen items-center justify-center p-6">
			{children}
		</main>
	);
};

const TestTrigger: FC<PropsWithChildren> = ({ children }) => {
	const { openModal } = useModalActions();

	return (
		<Button
			className="glassmorphism hover:scale-120"
			variant="ghostMonochrome"
			padding="lg"
			onClick={() => openModal(MODAL_IDS.test)}
			type="button"
		>
			{children}
		</Button>
	);
};

const TestModalRoot: FC<PropsWithChildren> = ({ children }) => {
	return (
		<Modal id={MODAL_IDS.test} animation="scale">
			<Modal.Overlay blurIntensity={10} opacity={0.35} />
			<Modal.Close ariaLabel="Close modal" label={"Close"} />
			<Modal.Content
				borderRadius="1rem"
				className="glassmorphism flex min-h-52 items-center justify-center text-white"
				maxWidth="24rem"
				padding="2rem"
				scrollable={false}
				size="sm"
				width="calc(100% - 2rem)"
			>
				{children}
			</Modal.Content>
		</Modal>
	);
};

const TestModalMessage: FC<PropsWithChildren> = ({ children }) => {
	return (
		<Modal.Body className="flex items-center justify-center">
			<p className="text-3xl font-semibold">{children}</p>
		</Modal.Body>
	);
};

const TestModal = Object.assign(TestModalRoot, {
	Message: TestModalMessage,
});

export const Test = Object.assign(TestRoot, {
	Modal: TestModal,
	Trigger: TestTrigger,
});
