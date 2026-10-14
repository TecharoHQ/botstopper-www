# Soteria Lane Visualizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible, self-contained four-lane Soteria explainer to the Soteria documentation page.

**Architecture:** A focused client component renders an HTML first frame from a fixed sequence of illustrative lane samples, then advances the frame on a timer when motion is allowed. CSS handles the responsive lane cards and transitions; no solver, WASM, worker, or animation dependency is added.

**Tech Stack:** Next.js App Router, React client component, CSS, MDX, Playwright.

---

## File map

- Create `components/docs/soteria-lane-visualizer.tsx` for the sample data, frame cycling, semantic lane markup, and reduced-motion behavior.
- Modify `app/globals.css` for the visualizer's responsive cards, digest progress indicator, and reduced-motion-safe transitions.
- Modify `content/docs/challenges/soteria.mdx` to mount the component after the explanation of four concurrent solutions.
- Modify `tests/docs.spec.ts` to verify the page labels the four sample lanes and clearly identifies them as illustrative.

## Task 1: Add the self-contained lane visualizer

**Files:**
- Create: `components/docs/soteria-lane-visualizer.tsx`
- Modify: `app/globals.css`
- Modify: `content/docs/challenges/soteria.mdx`
- Test: `tests/docs.spec.ts`

- [ ] Add deterministic sample frames containing four lanes. Each lane has a nonce, current 32-bit digest head, and lowest digest head so far. Treat the digest head as the first four digest bytes interpreted big-endian. Use the illustrative threshold `0x10000000`; it requires four leading zero bits because `clz32(threshold - 1) === 4`. For a digest head, progress is `min(clz32(head), 4) / 4`. A zero digest head therefore shows full progress and qualifies; a head equal to the threshold does not qualify because solutions require `head < threshold`.
- [ ] Render a figure with a caption that says the values are illustrative and not a live challenge. Render four semantic lane items with the nonce, 8-digit hexadecimal digest head, leading-zero progress toward the visible threshold, best digest head, and a visible solution indicator when the head is below threshold.
- [ ] Initialize the component at frame zero so server-rendered HTML is useful without JavaScript. In an effect, cycle through the fixed frames every 1.6 seconds. If reduced motion is requested, keep frame zero static; handle preference changes and clear timers/listeners on unmount.
- [ ] Add responsive styles using the existing plum/lavender documentation palette. Use a compact grid on wide screens and stacked rows on small screens. Provide a visible progress bar and sufficient text contrast. Transitions must be suppressed when reduced motion is requested.
- [ ] Import and mount the visualizer after the paragraph describing four challenge programs in `content/docs/challenges/soteria.mdx`.
- [ ] Add Playwright checks that the server-rendered HTML contains the first sample frame, all four lane labels, and the sample-data caveat; that the normal-motion sequence advances and loops; and that reduced motion keeps the first frame static, including after changing the preference while the page is open.
- [ ] Check the layout at desktop and mobile widths and assert the visualizer does not cause horizontal page overflow. Review the component cleanup for interval and media-query listener removal; navigate away during animation and confirm no browser errors.
- [ ] Run `pnpm lint`, `pnpm test:docs`, and `git diff --check`.

Expected result: the Soteria page explains how to read four solver lanes with a looping sample animation, while the initial frame remains complete and comprehensible without JavaScript or motion.
