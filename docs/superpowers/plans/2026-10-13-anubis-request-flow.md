# Anubis Request-Flow Animation Implementation Plan

> **For agentic workers:** Execute this plan task-by-task in the current session. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add an accessible Three.js animation to the Anubis documentation page that shows requests passing from the outside world through a load balancer and BotStopper to an app, with about 30% blocked.

**Architecture:** Keep the documentation route server-rendered and place a focused client component inside the existing MDX content. Dynamically import Three.js and GLTFLoader, load the existing BotStopper GLB, animate requests on a recurring 70/30 pass/block schedule, and clean up renderer resources and event listeners on unmount. Include a responsive semantic HTML diagram that remains available when reduced motion is enabled or WebGL/model loading fails.

**Tech Stack:** Next.js App Router, MDX, React client component, Three.js 0.186, GLTFLoader, CSS.

---

## File map

- Create `components/docs/anubis-request-flow.tsx`: client-only scene, model loading, request animation, accessible fallback, and cleanup.
- Modify `content/docs/anubis.mdx`: insert the component after the introductory paragraphs.
- Modify `app/globals.css`: styles for the responsive stage lane, canvas, request states, fallback, and reduced-motion presentation.
- Create `docs/superpowers/specs/2026-10-13-anubis-request-flow-design.md`: approved design and acceptance criteria.

## Task 1: Review local framework conventions

**Files:** No changes.

- [x] Read `node_modules/next/dist/docs/01-app/02-guides/mdx.md`, `node_modules/next/dist/docs/01-app/02-guides/server-and-client-boundary.md`, and `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md` from the repository root.
- [x] Review `app/aperture-model.tsx`, `mdx-components.tsx`, and the current Anubis MDX content. Use the existing dynamic import, abort, resize, and cleanup patterns.
- [x] Check `tests/docs.spec.ts` and the package scripts to understand page rendering conventions. Do not modify or run tests as part of this task.

## Task 2: Build the semantic diagram and client component

**Files:** Create `components/docs/anubis-request-flow.tsx`.

- [x] Begin with the `"use client"` directive. Render a `figure` with a caption and a readable stage list: Outside world, Load balancer / TLS terminator, BotStopper, App. Include textual pass/block labels so meaning does not depend on color or animation.
- [x] Render the static flow before Three.js loads. Use a `prefers-reduced-motion` media query to retain the static flow and skip renderer/model initialization when enabled.
- [x] In an effect, concurrently import `three` and `three/addons/loaders/GLTFLoader.js`. Fetch `/models/botstopper-rotating-aperture.glb` with an `AbortController`, parse with base path `/models/`, and add the loaded model to the BotStopper stage.
- [x] Set up a transparent renderer, camera, and resize observer sized to the component. Keep the canvas decorative for assistive technology; the HTML figure and labels provide the explanation.
- [x] Animate a request marker from the load balancer to BotStopper. Use a deterministic repeating sequence where three of every ten markers show a red X and stop, while the other seven continue to the App. Keep motion subtle and continuous.
- [x] On failure, retain the static HTML flow. On cleanup, cancel animation frames, disconnect observers, abort fetch, dispose geometries/materials/renderer, and remove the canvas.

## Task 3: Add styling and place the component

**Files:** Modify `app/globals.css`, `content/docs/anubis.mdx`.

- [x] Add styles scoped under `.anubis-request-flow`, matching the existing plum/lavender documentation palette. Make the lane scroll-free at mobile widths by allowing compact stages and wrapped labels; stack stages when needed.
- [x] Keep the static lane visible when reduced motion is active or when `data-loaded` is false. Reveal the canvas and loaded GLB only when initialization succeeds.
- [x] Add a reduced-motion rule that disables CSS motion for this component.
- [x] Import `AnubisRequestFlow` in the MDX file and place `<AnubisRequestFlow />` after the opening description, before “How the proof-of-work challenge works”.

## Task 4: Review the implementation

**Files:** Review all files above.

- [x] Inspect the diff for Next.js client/server boundary correctness, hook cleanup, inaccessible canvas-only content, and consistency with the spec.
- [x] Confirm all four stages are present and ordered, the existing GLB URL is reused, and the pass/block ratio is 7:3.
- [x] Do not run tests unless requested by the user.

## Spec coverage review

- Stage order and placement: Tasks 2 and 3.
- Existing GLB: Task 2.
- Three-of-ten blocked with red X: Task 2.
- Responsive and static fallback: Tasks 2 and 3.
- Resource cleanup: Task 2.
- Accessible text and reduced motion: Tasks 2 and 3.
