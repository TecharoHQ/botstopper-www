"use client";

import { useEffect, useState } from "react";

const threshold = 0x10000000;
const requiredZeroBits = Math.clz32(threshold - 1);

type Lane = {
  nonce: number;
  head: number;
  best: number;
};

const frames: Lane[][] = [
  [
    { nonce: 0x12, head: 0x75b1c20a, best: 0x55b1c20a },
    { nonce: 0x13, head: 0xa141091f, best: 0x39d918f1 },
    { nonce: 0x14, head: 0x28d0e664, best: 0x17d0e664 },
    { nonce: 0x15, head: 0x11a33bc0, best: 0x10433bc0 },
  ],
  [
    { nonce: 0x16, head: 0x6892b4de, best: 0x55b1c20a },
    { nonce: 0x17, head: 0x0c01f825, best: 0x0c01f825 },
    { nonce: 0x18, head: 0x3b781ad2, best: 0x17d0e664 },
    { nonce: 0x19, head: 0x0e6d4a93, best: 0x0e6d4a93 },
  ],
  [
    { nonce: 0x1a, head: 0x4d0acb11, best: 0x4d0acb11 },
    { nonce: 0x1b, head: 0x08a7d240, best: 0x08a7d240 },
    { nonce: 0x1c, head: 0x13d12e6b, best: 0x13d12e6b },
    { nonce: 0x1d, head: 0x000f3a91, best: 0x000f3a91 },
  ],
  [
    { nonce: 0x1e, head: 0x21b4300a, best: 0x21b4300a },
    { nonce: 0x1f, head: 0x62942f0c, best: 0x62942f0c },
    { nonce: 0x20, head: 0x06cbe279, best: 0x06cbe279 },
    { nonce: 0x21, head: 0x7e2d4a19, best: 0x7e2d4a19 },
  ],
];

function hex(value: number) {
  return value.toString(16).padStart(8, "0");
}

export function SoteriaLaneVisualizer() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;

    const start = () => {
      if (timer !== undefined || motion.matches) return;
      timer = window.setInterval(() => {
        setFrameIndex((current) => (current + 1) % frames.length);
      }, 1600);
    };
    const stop = () => {
      if (timer === undefined) return;
      window.clearInterval(timer);
      timer = undefined;
    };
    const onMotionChange = () => {
      if (motion.matches) {
        stop();
        setFrameIndex(0);
      } else {
        start();
      }
    };

    start();
    motion.addEventListener("change", onMotionChange);
    return () => {
      stop();
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <figure className="soteria-lane-visualizer" aria-labelledby="soteria-lane-title">
      <figcaption>
        <strong id="soteria-lane-title">Four lanes, one batch</strong>
        <span>Illustrative sample data, not a live challenge. Each lane checks a digest head against the threshold.</span>
      </figcaption>
      <p className="soteria-lane-threshold">
        A lane finds a solution when its digest head is below <code>0x{hex(threshold)}</code>.
      </p>
      <ol className="soteria-lanes" aria-label="Four sample nonce lanes" data-frame={frameIndex}>
        {frames[frameIndex].map((lane, index) => {
          const zeroBits = Math.min(Math.clz32(lane.head), requiredZeroBits);
          const solved = lane.head < threshold;
          return (
            <li className={`soteria-lane${solved ? " is-solved" : ""}`} key={index} aria-label={`Lane ${index + 1}`}>
              <div className="soteria-lane-heading">
                <strong>Lane {index + 1}</strong>
                {solved && <span className="soteria-lane-solved">Solution</span>}
              </div>
              <dl className="soteria-lane-values">
                <div><dt>Nonce</dt><dd><code>{hex(lane.nonce)}</code></dd></div>
                <div><dt>Digest head</dt><dd><code>{hex(lane.head)}</code></dd></div>
                <div><dt>Best head</dt><dd><code>{hex(lane.best)}</code></dd></div>
              </dl>
              <div className="soteria-lane-progress-label">
                <span>Leading zero bits</span>
                <span>{zeroBits} / {requiredZeroBits}</span>
              </div>
              <div
                className="soteria-lane-progress"
                role="meter"
                aria-label={`Lane ${index + 1} leading zero bits toward threshold`}
                aria-valuemin={0}
                aria-valuemax={requiredZeroBits}
                aria-valuenow={zeroBits}
              >
                <span style={{ width: `${(zeroBits / requiredZeroBits) * 100}%` }} />
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
