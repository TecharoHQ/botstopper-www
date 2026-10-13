# Soteria lane visualizer

## Goal

Explain the four-lane progress display used by the Soteria challenge without
running the proof-of-work solver in the documentation page.

## Design

Add a small client component to the Soteria documentation page. It will show
four lanes, one for each nonce processed together by Soteria's SIMD solver.
Each lane will display an illustrative current nonce, an eight-digit
hexadecimal digest head, leading-zero progress toward the threshold, and the
lowest digest head seen so far. The digest head represents the first four
bytes of a digest interpreted as a big-endian 32-bit number. A digest below
the displayed threshold is a solution. A short caption will explain that the
values are sample data, not results from a running challenge.

The component will render its first sample frame in HTML, so the explanation
remains available without JavaScript. With JavaScript and normal motion
preferences, it will loop through a fixed sequence of sample frames every 1.6
seconds; CSS transitions will soften updates. With reduced motion enabled, it
will keep the first frame static. It will use semantic HTML and CSS, with no
canvas, third-party animation library, WebAssembly module, or worker. The
visualization will fit narrow screens without horizontal scrolling.

## Scope

Place the visualizer after the Soteria page's explanation that four challenge
programs are solved at once. Do not change the challenge implementation,
difficulty controls, or other documentation pages.

## Validation

Check the page at desktop and mobile widths, confirm reduced-motion behavior,
and run the documentation checks and lint.
