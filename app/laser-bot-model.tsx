"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function LaserBotModel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let started = false;
    let cleanup = () => {};
    const abort = new AbortController();

    async function initialize() {
      const [THREE, { GLTFLoader }] = await Promise.all([
        import("three"),
        import("three/addons/loaders/GLTFLoader.js"),
      ]);
      if (disposed || !container) return;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 100);
      camera.position.set(0, 0, 10);
      scene.add(new THREE.AmbientLight(0xffffff, 2));
      const light = new THREE.DirectionalLight(0xffffff, 3);
      light.position.set(-3, 4, 6);
      scene.add(light);

      // These are assigned once after the model finishes loading and used by cleanup.
      // eslint-disable-next-line prefer-const
      let model: import("three").Group | undefined;
      // eslint-disable-next-line prefer-const
      let pivot: import("three").Group | undefined;
      // eslint-disable-next-line prefer-const
      let mixer: import("three").AnimationMixer | undefined;
      let dissolveUniform: { value: number } | undefined;
      // eslint-disable-next-line prefer-const
      let resizeObserver: ResizeObserver | undefined;
      // eslint-disable-next-line prefer-const
      let visibilityObserver: IntersectionObserver | undefined;
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      let visible = false;
      let previousTime: number | undefined;
      let targetPitch = 0;
      let targetYaw = 0;
      let pitch = 0;
      let yaw = 0;
      const basePitch = -0.55;
      const baseYaw = 0.28;
      const applyTilt = () => {
        if (!pivot) return;
        pivot.rotation.x = Math.PI / 2 + basePitch + pitch;
        pivot.rotation.z = baseYaw + yaw;
      };
      const handlePointerMove = (event: PointerEvent) => {
        const bounds = container.getBoundingClientRect();
        targetYaw = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.35;
        targetPitch = ((event.clientY - bounds.top) / bounds.height - 0.5) * -0.25;
        if (motion.matches) {
          pitch = targetPitch;
          yaw = targetYaw;
          applyTilt();
          render();
        }
      };
      const resetPointer = () => {
        targetPitch = 0;
        targetYaw = 0;
        if (motion.matches) {
          pitch = 0;
          yaw = 0;
          applyTilt();
          render();
        }
      };
      const render = () => renderer.render(scene, camera);
      const updateDissolve = () => {
        if (!mixer || !dissolveUniform) return;

        // The model fires at the bot near the end of its six-second loop.
        // Break its image into glowing fragments, then restore it for the next pass.
        const cycle = mixer.time % 6;
        const dissolveStart = 4.15;
        const dissolveEnd = 4.85;
        const restoreStart = 5.65;
        const restoreEnd = 6;
        if (cycle < dissolveStart) {
          dissolveUniform.value = 0;
        } else if (cycle < dissolveEnd) {
          const progress = (cycle - dissolveStart) / (dissolveEnd - dissolveStart);
          dissolveUniform.value = progress * progress * (3 - 2 * progress);
        } else if (cycle < restoreStart) {
          dissolveUniform.value = 1;
        } else {
          const progress = (cycle - restoreStart) / (restoreEnd - restoreStart);
          dissolveUniform.value = 1 - progress * progress * (3 - 2 * progress);
        }
      };
      const animate = (time: number) => {
        if (previousTime !== undefined) {
          mixer?.update(Math.min((time - previousTime) / 1000, 0.1));
        }
        previousTime = time;
        pitch += (targetPitch - pitch) * 0.2;
        yaw += (targetYaw - yaw) * 0.2;
        applyTilt();
        updateDissolve();
        render();
      };
      const updatePlayback = () => {
        previousTime = undefined;
        renderer.setAnimationLoop(visible && !document.hidden && !motion.matches ? animate : null);
        render();
      };

      cleanup = () => {
        resizeObserver?.disconnect();
        visibilityObserver?.disconnect();
        motion.removeEventListener("change", updatePlayback);
        document.removeEventListener("visibilitychange", updatePlayback);
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerleave", resetPointer);
        renderer.setAnimationLoop(null);
        if (model) {
          mixer?.stopAllAction();
          mixer?.uncacheRoot(model);
          model.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            for (const material of materials) {
              for (const value of Object.values(material)) {
                if (value instanceof THREE.Texture) value.dispose();
              }
              material.dispose();
            }
          });
        }
        renderer.dispose();
        renderer.domElement.remove();
        delete container.dataset.loaded;
      };

      const response = await fetch("/models/botstopper-laser-bot.glb", { signal: abort.signal });
      if (!response.ok) throw new Error("Unable to load BotStopper laser bot model");
      const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), "/models/");
      model = gltf.scene;
      if (disposed) {
        cleanup();
        return;
      }

      const bounds = new THREE.Box3().setFromObject(model);
      const sphere = bounds.getBoundingSphere(new THREE.Sphere());
      model.position.sub(sphere.center);
      const botTarget = model.getObjectByName("Bot_Target_PNG");
      if (botTarget instanceof THREE.Mesh) {
        const hadMaterialArray = Array.isArray(botTarget.material);
        const materials: import("three").Material[] = hadMaterialArray
          ? botTarget.material
          : [botTarget.material];
        const dissolve = { value: 0 };
        dissolveUniform = dissolve;
        const dissolvedMaterials = materials.map((material: import("three").Material) => {
          const dissolvedMaterial = material.clone();
          dissolvedMaterial.onBeforeCompile = (shader: import("three").WebGLProgramParametersWithUniforms) => {
            shader.uniforms.uDissolve = dissolve;
            shader.vertexShader = shader.vertexShader
              .replace("#include <common>", "#include <common>\nvarying vec2 vDissolveUv;")
              .replace("#include <uv_vertex>", "#include <uv_vertex>\nvDissolveUv = uv;");
            shader.fragmentShader = shader.fragmentShader
              .replace("#include <common>", "#include <common>\nuniform float uDissolve;\nvarying vec2 vDissolveUv;")
              .replace("#include <map_fragment>", `#include <map_fragment>
                float dissolveNoise = fract(sin(dot(vDissolveUv, vec2(12.9898, 78.233))) * 43758.5453);
                if (dissolveNoise < uDissolve) discard;
                float dissolveEdge = 1.0 - smoothstep(uDissolve, uDissolve + 0.08, dissolveNoise);
                diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.24, 0.035), dissolveEdge * step(0.001, uDissolve));`);
          };
          dissolvedMaterial.customProgramCacheKey = () => "botstopper-target-dissolve-v1";
          return dissolvedMaterial;
        });
        botTarget.material = hadMaterialArray ? dissolvedMaterials : dissolvedMaterials[0];
      }

      pivot = new THREE.Group();
      pivot.rotation.x = Math.PI / 2 + basePitch;
      pivot.rotation.z = baseYaw;
      pivot.position.y = sphere.radius * 0.3;
      pivot.add(model);
      scene.add(pivot);
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerleave", resetPointer);
      mixer = new THREE.AnimationMixer(model);
      const attack = gltf.animations.find((clip) => clip.name === "Target_Lock_Attack_6s");
      if (attack) mixer.clipAction(attack).play();
      mixer.update(0);
      updateDissolve();

      const resize = () => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        const aspect = width / height;
        const halfHeight = sphere.radius * 0.78 / Math.min(aspect, 1);
        camera.left = -halfHeight * aspect;
        camera.right = halfHeight * aspect;
        camera.top = halfHeight;
        camera.bottom = -halfHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        render();
      };
      container.appendChild(renderer.domElement);
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      resize();
      container.dataset.loaded = "true";

      visibilityObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        updatePlayback();
      });
      visibilityObserver.observe(container);
      motion.addEventListener("change", updatePlayback);
      document.addEventListener("visibilitychange", updatePlayback);
    }

    const loadObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      loadObserver.disconnect();
      void initialize().catch(() => {
        cleanup();
        // Keep the static brand mark if WebGL or the model is unavailable.
      });
    }, { rootMargin: "200px" });
    loadObserver.observe(container);

    return () => {
      disposed = true;
      loadObserver.disconnect();
      abort.abort();
      cleanup();
    };
  }, []);

  return (
    <div
      className="laser-bot-model"
      ref={containerRef}
      role="img"
      aria-label="BotStopper challenges an automated bot, which breaks apart under the laser attack."
    >
      <Image className="laser-bot-fallback" src="/botstopper-mark.svg" alt="" width={160} height={160} />
    </div>
  );
}
