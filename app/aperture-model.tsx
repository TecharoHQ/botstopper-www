"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function ApertureModel() {
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

      let model: import("three").Group | undefined = undefined;
      let pivot: import("three").Group | undefined = undefined;
      let mixer: import("three").AnimationMixer | undefined = undefined;
      let resizeObserver: ResizeObserver | undefined = undefined;
      let visibilityObserver: IntersectionObserver | undefined = undefined;
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      let visible = false;
      let previousTime: number | undefined;
      let targetPitch = 0;
      let targetYaw = 0;
      let pitch = 0;
      let yaw = 0;
      const applyTilt = () => {
        if (!pivot) return;
        pivot.rotation.x = Math.PI / 2 + pitch;
        pivot.rotation.z = yaw;
      };
      const handlePointerMove = (event: PointerEvent) => {
        const bounds = container.getBoundingClientRect();
        targetYaw = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.36;
        targetPitch = ((event.clientY - bounds.top) / bounds.height - 0.5) * -0.24;
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
      const animate = (time: number) => {
        if (previousTime !== undefined) {
          mixer?.update(Math.min((time - previousTime) / 1000, 0.1));
        }
        previousTime = time;
        pitch += (targetPitch - pitch) * 0.08;
        yaw += (targetYaw - yaw) * 0.08;
        applyTilt();
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

      const response = await fetch("/models/botstopper-rotating-aperture.glb", { signal: abort.signal });
      if (!response.ok) throw new Error("Unable to load aperture model");
      const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), "/models/");
      model = gltf.scene;
      if (disposed) {
        cleanup();
        return;
      }

      const bounds = new THREE.Box3().setFromObject(model);
      const sphere = bounds.getBoundingSphere(new THREE.Sphere());
      model.position.sub(sphere.center);
      // The supplied model lies in the XZ plane. Face its front toward the camera.
      pivot = new THREE.Group();
      pivot.rotation.x = Math.PI / 2;
      pivot.add(model);
      scene.add(pivot);
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerleave", resetPointer);
      mixer = new THREE.AnimationMixer(model);
      for (const clip of gltf.animations) mixer.clipAction(clip).play();
      mixer.update(0);

      const resize = () => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        const aspect = width / height;
        const halfHeight = sphere.radius * 1.15 / Math.min(aspect, 1);
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
    <div className="aperture-model" ref={containerRef} aria-hidden="true">
      <Image className="aperture-fallback" src="/botstopper-mark.svg" alt="" width={160} height={160} />
    </div>
  );
}
