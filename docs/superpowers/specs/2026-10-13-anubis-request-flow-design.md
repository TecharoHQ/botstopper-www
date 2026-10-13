# Anubis request-flow animation

## Goal

Add a visual explanation to the “What is Anubis?” documentation page showing how Anubis sits between an application's load balancer and app. The animation should make clear that Anubis evaluates requests, allows most requests to continue, and blocks a portion.

## Approved design

Place an accessible client-side Three.js animation below the introduction in `content/docs/anubis.mdx`. Arrange the outside world, load balancer / TLS terminator, BotStopper, and app as a left-to-right lane. Load the existing `/models/botstopper-rotating-aperture.glb` model for the BotStopper stage. Animate request markers from the load balancer into BotStopper; about 70% proceed to the app and about 30% stop at BotStopper with a red X. Use a static diagram fallback when motion is reduced or the 3D model cannot load.

## Implementation boundaries

- Follow the existing client-side Three.js loading and cleanup pattern in `app/aperture-model.tsx`.
- Keep the MDX page as server-rendered content and isolate browser APIs and Three.js in a client component.
- Keep the visual consistent with the site's plum/lavender palette and readable at narrow widths.
- Provide a text equivalent for assistive technology; do not rely on motion or color alone to explain the flow.
- Respect `prefers-reduced-motion` by showing the static flow without continuous animation.

## Acceptance criteria

1. The Anubis documentation page shows the four stages in order: outside world, load balancer / TLS terminator, BotStopper, app.
2. The existing BotStopper GLB appears at the BotStopper stage.
3. Repeating requests show approximately 30% blocked at BotStopper with a red X; the remainder reach the app.
4. The diagram remains understandable on small screens and without WebGL/model loading.
5. The component disposes of animation resources and listeners when unmounted.
