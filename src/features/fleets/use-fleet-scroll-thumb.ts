"use client";

import { useEffect } from "react";

const THUMB_MIN_HEIGHT = 44;

export const useFleetScrollThumb = () => {
	useEffect(() => {
		const scroller = document.querySelector<HTMLElement>(".fleets-scroll");
		const thumb =
			scroller?.parentElement?.querySelector<HTMLElement>(
				"[data-fleet-scroll-thumb]",
			) ?? document.querySelector<HTMLElement>("[data-fleet-scroll-thumb]");

		if (!scroller || !thumb || typeof ResizeObserver === "undefined") {
			return;
		}

		const applyStyles = (height: number, translateY: number, visible: boolean) => {
			thumb.style.height = `${height}px`;
			thumb.style.transform = `translateY(${translateY}px)`;
			thumb.style.visibility = visible ? "visible" : "hidden";
		};

		const update = () => {
			const trackHeight = scroller.clientHeight;
			const scrollHeight = scroller.scrollHeight;
			const overflow = scrollHeight - trackHeight;

			if (overflow <= 0) {
				applyStyles(trackHeight, 0, false);
				return;
			}

			const ratio = trackHeight / scrollHeight;
			const thumbHeight = Math.min(
				Math.max(Math.round(ratio * trackHeight), THUMB_MIN_HEIGHT),
				trackHeight,
			);
			const progress = scroller.scrollTop / overflow;
			const translateY = Math.round(progress * (trackHeight - thumbHeight));

			applyStyles(thumbHeight, translateY, true);
		};

		/** Current thumb height in px, derived the same way as `update`. */
		const currentThumbHeight = () => {
			const trackHeight = scroller.clientHeight;
			const scrollHeight = scroller.scrollHeight;
			if (scrollHeight <= trackHeight) return trackHeight;
			const ratio = trackHeight / scrollHeight;
			return Math.min(
				Math.max(Math.round(ratio * trackHeight), THUMB_MIN_HEIGHT),
				trackHeight,
			);
		};

		// The fixed-height scroller only resizes with the viewport — also observe the content wrapper, re-targeting when children change.
		let observedContent: Element | null = null;

		const resizeObserver = new ResizeObserver(() => update());
		resizeObserver.observe(scroller);

		const mutationObserver = new MutationObserver(() => {
			const content = scroller.firstElementChild;
			if (content && content !== observedContent) {
				observedContent = content;
				resizeObserver.observe(content);
			}
			update();
		});

		const content = scroller.firstElementChild;
		if (content) {
			observedContent = content;
			resizeObserver.observe(content);
		}
		mutationObserver.observe(scroller, { childList: true, subtree: true });

		const handleScroll = () => update();
		scroller.addEventListener("scroll", handleScroll, { passive: true });

		// The thumb is pointer-events:none by default; opt in for mouse/pen drag (touch stays native).
		thumb.style.pointerEvents = "auto";
		thumb.style.cursor = "grab";

		let dragCleanup: (() => void) | null = null;

		const handlePointerDown = (event: PointerEvent) => {
			if (event.pointerType === "touch") return;
			if (event.button !== 0) return;
			event.preventDefault();
			thumb.setPointerCapture(event.pointerId);
			thumb.style.cursor = "grabbing";

			const startY = event.clientY;
			const startScrollTop = scroller.scrollTop;
			const thumbHeight = currentThumbHeight();
			const maxScroll = scroller.scrollHeight - scroller.clientHeight;
			const movable = scroller.clientHeight - thumbHeight;

			const handleMove = (moveEvent: PointerEvent) => {
				if (maxScroll <= 0 || movable <= 0) return;
				const delta = moveEvent.clientY - startY;
				scroller.scrollTop = startScrollTop + (delta / movable) * maxScroll;
			};
			const handleUp = () => {
				thumb.removeEventListener("pointermove", handleMove);
				thumb.removeEventListener("pointerup", handleUp);
				thumb.removeEventListener("pointercancel", handleUp);
				thumb.style.cursor = "grab";
				dragCleanup = null;
			};

			thumb.addEventListener("pointermove", handleMove);
			thumb.addEventListener("pointerup", handleUp);
			thumb.addEventListener("pointercancel", handleUp);
			dragCleanup = handleUp;
		};

		thumb.addEventListener("pointerdown", handlePointerDown);

		update();

		return () => {
			scroller.removeEventListener("scroll", handleScroll);
			thumb.removeEventListener("pointerdown", handlePointerDown);
			dragCleanup?.();
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, []);
};
