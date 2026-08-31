"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useIntlayer } from "next-intlayer";
import type { z } from "zod";
import { Button } from "@/components/button";
import { Modal, MODAL_IDS, useModalActions, useModalStore } from "@/components/modal";
import { FleetCreateError, type FleetFieldErrors } from "@/lib/fleets/client";
import { buildCreateFleetSchema } from "@/lib/fleets/schema";
import { cn } from "@/utils";
import { ColorSwatches } from "./color-swatches";
import { FleetPreviewCard } from "./fleet-preview-card";
import { ChevronRightIcon, InfoIcon } from "./icons";
import { DEFAULT_FLEET_COLOR } from "./lib/palette";
import type { FleetFormValues } from "./lib/types";
import { TiltCard } from "./tilt-card";

export interface IFleetCreationModalProps {
	/** Submit handler — the modal closes once it resolves. */
	onCreate?: (values: FleetFormValues) => void | Promise<void>;
	/** External submitting state (API in flight). */
	isCreating?: boolean;
}

/** What the form holds — zod input type of the creation schema. */
type FleetFormSchema = ReturnType<typeof buildCreateFleetSchema>;
type FleetFormInput = z.input<FleetFormSchema>;
/** What `handleSubmit` receives — the schema-trimmed output of the resolver. */
type FleetFormOutput = z.output<FleetFormSchema>;

const defaultValues: FleetFormInput = {
	title: "",
	description: "",
	color: DEFAULT_FLEET_COLOR,
};

/** Fleet creation overlay: breadcrumb + live tilt preview on the left, form on the right. */
export const FleetCreationModal = ({ onCreate, isCreating = false }: IFleetCreationModalProps) => {
	const content = useIntlayer("fleet-creation");
	const { closeModal } = useModalActions();

	// Rebuilt only on locale switch; String() unwraps intlayer proxies — zod needs real strings.
	const errorMessages = useMemo(
		() => ({
			titleRequired: String(content.errors.titleRequired),
			titleTooLong: String(content.errors.titleTooLong),
			descriptionTooLong: String(content.errors.descriptionTooLong),
			colorInvalid: String(content.errors.colorInvalid),
		}),
		[
			content.errors.titleRequired,
			content.errors.titleTooLong,
			content.errors.descriptionTooLong,
			content.errors.colorInvalid,
		],
	);
	const schema = useMemo(() => buildCreateFleetSchema(errorMessages), [errorMessages]);

	const {
		control,
		reset,
		getValues,
		setError,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
	} = useForm<FleetFormInput, unknown, FleetFormOutput>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues,
	});

	// Live preview values (explicit defaults so the first render shows them).
	const title = useWatch({ control, name: "title", defaultValue: "" });
	const description = useWatch({ control, name: "description", defaultValue: "" });
	const color = useWatch({ control, name: "color", defaultValue: DEFAULT_FLEET_COLOR });

	// Reset the form on the closed → open transition.
	useEffect(() => {
		const modalId = MODAL_IDS["fleet-creation"];
		const unsubscribe = useModalStore.subscribe((state, prevState) => {
			const justOpened =
				prevState.openModalId !== modalId && state.openModalId === modalId;
			if (justOpened) {
				reset(defaultValues);
			}
		});
		return unsubscribe;
	}, [reset]);

	const busy = isSubmitting || isCreating;

	// Re-map server field errors onto the localized message matching the schema rules.
	const applyServerFieldErrors = (fieldErrors: FleetFieldErrors) => {
		const title = getValues("title").trim();
		const description = (getValues("description") ?? "").trim();

		for (const [field, message] of Object.entries(fieldErrors)) {
			if (!message) continue;

			if (field === "title") {
				if (!title) {
					setError("title", { type: "server", message: errorMessages.titleRequired });
			} else if (title.length > 100) {
				setError("title", { type: "server", message: errorMessages.titleTooLong });
			} else {
				console.error(String(content.errors.submitFailed), { field, message });
			}
		} else if (field === "description") {
			if (description.length > 160) {
				setError("description", {
					type: "server",
					message: errorMessages.descriptionTooLong,
				});
			} else {
				console.error(String(content.errors.submitFailed), { field, message });
			}
			} else if (field === "color") {
				setError("color", { type: "server", message: errorMessages.colorInvalid });
			}
		}
	};

	const onSubmit = handleSubmit(async (values: FleetFormOutput) => {
		const result: unknown = onCreate?.({
			title: values.title,
			description: values.description ?? "",
			color: values.color,
		});
		if (result instanceof Promise) {
			try {
				await result;
				closeModal();
			} catch (error) {
				// Keep the overlay open; field errors are localized and set on the form.
				if (error instanceof FleetCreateError) {
					applyServerFieldErrors(error.fieldErrors);
				}
			}
		} else {
			closeModal();
		}
	});

	return (
		<Modal.Root id={MODAL_IDS["fleet-creation"]} animation="fade">
			<Modal.Overlay blurIntensity={10} opacity={0.3} />
			<Modal.Return label={content.returnLabel} />

			{/* Sibling of Modal.Return on purpose: inside the animated panel, `fixed` would resolve against it */}
			<button
				type="button"
				className={cn(
					"fixed top-11.75 right-26 z-70 flex cursor-pointer items-center gap-s rounded-xs px-s py-1",
					"text-s text-white/60 transition-colors hover:text-white",
					"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70",
				)}
			>
				{content.helpLabel}
				<InfoIcon className="size-5" />
			</button>

			<Modal.Content
				size="full"
				padding="0"
				borderRadius="0"
				maxHeight="100vh"
				scrollable
				/* pointer-events-none so backdrop clicks reach the overlay */
				className="pointer-events-none"
			>
				<div className="flex min-h-full w-full items-center justify-center px-m py-4xl md:px-16">
					<div className="pointer-events-auto flex w-full max-w-[1412px] flex-col items-center gap-3xl lg:flex-row lg:items-start lg:justify-center lg:gap-6 min-[1600px]:lg:gap-[164px]">
						{/* Left: breadcrumb + live preview */}
						<div className="flex w-full max-w-[550px] flex-col gap-m lg:w-[550px] lg:shrink-0">
							<nav aria-label={content.breadcrumbAriaLabel} className="flex items-center gap-1">
								<span className="text-sm leading-[28px] text-white/70">
									{content.breadcrumbRoot}
								</span>
								<ChevronRightIcon aria-hidden="true" className="size-5 text-white/70" />
								<span
									className={cn(
										"max-w-[280px] truncate text-sm font-semibold leading-[28px]",
										title.trim() ? "text-white" : "text-white/40",
									)}
								>
									{title.trim() || content.breadcrumbFallback}
								</span>
							</nav>

							<TiltCard maxTilt={9}>
								<FleetPreviewCard
									title={title.trim()}
									description={(description ?? "").trim()}
									color={color}
									typeLabel={content.previewTypeLabel}
									titlePlaceholder={content.previewTitlePlaceholder}
									descriptionPlaceholder={content.previewDescriptionPlaceholder}
								/>
							</TiltCard>
						</div>

						{/* Right: form */}
						<form
							className="flex w-full max-w-[698px] flex-col gap-[60px] lg:w-[698px] lg:shrink-0"
							onSubmit={onSubmit}
							noValidate
						>
							<div className="flex flex-col gap-[60px]">
								<header className="flex flex-col gap-s">
									<h2 className="text-[length:var(--text-lm)] font-bold text-white">
										{content.heading}
									</h2>
									<p className="text-sx leading-5 text-white/70">{content.subtitle}</p>
								</header>

								<div className="flex flex-wrap items-start gap-xl min-[480px]:gap-[60px]">
									<div className="flex flex-col gap-s">
										<label htmlFor="fleet-title" className="text-sx font-medium leading-5 text-white">
											{content.nameLabel}{" "}
											<span aria-hidden="true" className="text-primary-200">
												*
											</span>
										</label>
										<Controller
											control={control}
											name="title"
											render={({ field, fieldState: { invalid } }) => (
												<input
													id="fleet-title"
													name="title"
													type="text"
													required
													maxLength={100}
													placeholder={content.namePlaceholder}
													value={field.value}
													onChange={(event) => field.onChange(event.target.value)}
													aria-invalid={invalid || undefined}
													aria-describedby={invalid ? "fleet-title-error" : undefined}
												className={cn(
													"h-11 w-[288px] max-w-full rounded-s border bg-white/10 px-m",
													"text-sx text-white outline-none transition-colors placeholder:text-white/40",
													"hover:bg-white/15 focus-visible:border-white/40",
													invalid ? "border-danger-500" : "border-black/10",
												)}
											/>
										)}
									/>
									{errors.title ? (
										<p
											id="fleet-title-error"
											role="alert"
											className="text-[13px] leading-[18px] text-danger-text"
										>
											{errors.title.message}
										</p>
									) : null}
									</div>

									<div className="flex flex-col gap-s">
										<span id="fleet-color-label" className="text-sx font-medium leading-5 text-white">
											{content.colorLabel}
										</span>
										<Controller
											control={control}
											name="color"
											render={({ field }) => (
												<ColorSwatches
													value={field.value}
													onChange={field.onChange}
													ariaLabel={content.colorAriaLabel}
													className="pt-1.5"
												/>
											)}
										/>
									</div>
								</div>

							<div className="flex flex-col gap-s">
								<label htmlFor="fleet-description" className="text-sx font-medium leading-5 text-white">
									{content.descriptionLabel}
								</label>
								<Controller
									control={control}
									name="description"
									render={({ field, fieldState: { invalid } }) => (
										<textarea
											id="fleet-description"
											name="description"
											maxLength={160}
											placeholder={content.descriptionPlaceholder}
											value={field.value ?? ""}
											onChange={(event) => field.onChange(event.target.value)}
											aria-invalid={invalid || undefined}
											aria-describedby={invalid ? "fleet-description-error" : undefined}
											className={cn(
												"h-[92px] w-full resize-none rounded-s border bg-white/10 px-m py-sm",
												"text-sx text-white outline-none transition-colors placeholder:text-white/40",
												"hover:bg-white/15 focus-visible:border-white/40",
												invalid ? "border-danger-500" : "border-black/10",
											)}
										/>
									)}
								/>
								{errors.description ? (
									<p
										id="fleet-description-error"
										role="alert"
										className="text-[13px] leading-[18px] text-danger-text"
									>
										{errors.description.message}
									</p>
								) : null}
							</div>
							</div>

							<footer className="flex items-center justify-between">
								<Button type="button" variant="danger" textSize="base" onClick={closeModal}>
									{content.cancel}
								</Button>
								<Button
									type="submit"
									variant="primary"
									textSize="base"
									disabled={!isValid || busy}
									isLoading={busy}
									className={cn(
										"rounded-[4px] px-4 py-3 font-normal text-white",
										"disabled:bg-white/5 disabled:text-white/40",
									)}
								>
									{content.submit}
								</Button>
							</footer>
						</form>
					</div>
				</div>
			</Modal.Content>
		</Modal.Root>
	);
};
