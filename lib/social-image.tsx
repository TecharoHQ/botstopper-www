import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const socialImageSize = { width: 1200, height: 630 };

const logo = await readFile(join(process.cwd(), "public/botstopper-mark.svg"), "base64");
const headingFont = await readFile(join(process.cwd(), "public/fonts/podkova-bold.ttf"));
const bodyFont = await readFile(join(process.cwd(), "public/fonts/schibsted-grotesk-regular.ttf"));

// A still version of the homepage's layered shield, using SVG for OG rendering.
const shield = `
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="560" viewBox="0 0 480 560">
  <defs>
    <linearGradient id="back" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#554267"/><stop offset=".58" stop-color="#88719b"/><stop offset="1" stop-color="#bda9cc"/>
    </linearGradient>
    <linearGradient id="front" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#f8f4fa"/><stop offset=".45" stop-color="#d7c8e2"/><stop offset="1" stop-color="#a58ab8"/>
    </linearGradient>
    <linearGradient id="glint" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="face"><polygon points="240,30 416,112 400,342 340,429 240,510 140,429 80,342 64,112"/></clipPath>
  </defs>
  <g transform="rotate(8 240 280)">
    <polygon points="240,30 416,112 400,342 340,429 240,510 140,429 80,342 64,112" transform="translate(22 16)" fill="url(#back)"/>
    <polygon points="240,30 416,112 400,342 340,429 240,510 140,429 80,342 64,112" fill="url(#front)" stroke="#fff" stroke-width="2"/>
    <polygon points="240,56 394,128 380,333 324,413 240,483 156,413 100,333 86,128" fill="none" stroke="#5c4474" stroke-opacity=".28"/>
    <path d="M30 215 L380 35 L430 100 L65 295 Z" fill="url(#glint)" clip-path="url(#face)"/>
  </g>
</svg>`;

export function createSocialImage(title: string, description: string) {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "linear-gradient(110deg, #f6f3f8, #eee9f3 53%, #e7dfed)", color: "#000", fontFamily: "Schibsted", padding: 64 }}>
      <div style={{ display: "flex", position: "absolute", top: 34, left: 670, width: 480, height: 560, opacity: 0.42 }}>
        {/* ImageResponse renders embedded SVGs directly without next/image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/svg+xml;base64,${Buffer.from(shield).toString("base64")}`} width={480} height={560} alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/svg+xml;base64,${logo}`} width={220} height={220} alt="" style={{ position: "absolute", top: 150, left: 134, transform: "rotate(8deg)", opacity: 0.6 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontFamily: "Podkova", fontWeight: 700, fontSize: 42 }}>BotStopper</span>
          <span style={{ fontSize: 22 }}>from Techaro</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontFamily: "Podkova", fontWeight: 700, fontSize: title.length > 65 ? 64 : 80, lineHeight: 1.04, letterSpacing: "-0.035em", maxWidth: 1040 }}>{title}</div>
          <div style={{ fontSize: 28, lineHeight: 1.4, maxWidth: 940 }}>{description}</div>
        </div>
        <div style={{ fontSize: 18, letterSpacing: "0.12em" }}>BUILT FOR THE OPEN WEB</div>
      </div>
    </div>,
    {
      ...socialImageSize,
      fonts: [
        { name: "Podkova", data: headingFont, weight: 700, style: "normal" },
        { name: "Schibsted", data: bodyFont, weight: 400, style: "normal" },
      ],
    },
  );
}
