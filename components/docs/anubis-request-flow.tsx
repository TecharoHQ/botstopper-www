"use client";

import { useEffect, useRef } from "react";

export function AnubisRequestFlow() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const container = sceneRef.current;
    if (!container) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || window.matchMedia("(max-width: 640px)").matches) return;

    let disposed = false;
    let cleanup = () => {};
    let frame = 0;
    const abort = new AbortController();

    async function initialize() {
      const [THREE, { GLTFLoader }] = await Promise.all([
        import("three"),
        import("three/addons/loaders/GLTFLoader.js"),
      ]);
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-4, 4, 2, -2, 0.1, 100);
      camera.position.set(0, 0, 10);
      scene.add(new THREE.AmbientLight(0xffffff, 2.2));
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
      keyLight.position.set(-3, 4, 7);
      scene.add(keyLight);

      const pathGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-3.5, -1.18, 0),
        new THREE.Vector3(3.5, -1.18, 0),
      ]);
      const path = new THREE.Line(pathGeometry, new THREE.LineDashedMaterial({
        color: 0x9a87a8,
        dashSize: 0.12,
        gapSize: 0.09,
        transparent: true,
        opacity: 0.75,
      }));
      path.computeLineDistances();
      scene.add(path);

      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.085, 20, 16),
        new THREE.MeshBasicMaterial({ color: 0x886da0 }),
      );
      marker.position.set(-3.4, -1.18, 0.2);
      scene.add(marker);

      const stopMark = new THREE.Group();
      const stopMaterial = new THREE.LineBasicMaterial({ color: 0xc7463e, linewidth: 3 });
      const stopOne = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-0.12, -0.12, 0),
          new THREE.Vector3(0.12, 0.12, 0),
        ]),
        stopMaterial,
      );
      const stopTwo = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-0.12, 0.12, 0),
          new THREE.Vector3(0.12, -0.12, 0),
        ]),
        stopMaterial,
      );
      stopMark.add(stopOne, stopTwo);
      stopMark.position.set(0.45, -1.18, 0.3);
      stopMark.visible = false;
      scene.add(stopMark);

      let model: import("three").Group | undefined;
      let pivot: import("three").Group | undefined;
      let mixer: import("three").AnimationMixer | undefined;
      let resizeObserver: ResizeObserver | undefined;
      let visibilityObserver: IntersectionObserver | undefined;
      let visible = false;
      let previousTime: number | undefined;
      let requestStart = 0;
      let requestNumber = 0;
      let blocked = false;
      let requestFrom = -2.2;
      let gateX = 0;
      let appX = 2.2;
      const cycleMs = 1550;
      const render = () => renderer.render(scene, camera);
      const updatePlayback = () => {
        previousTime = undefined;
        if (visible && !document.hidden && !motion.matches) {
          frame = window.requestAnimationFrame(animate);
        } else {
          window.cancelAnimationFrame(frame);
          render();
        }
      };
      const animate = (time: number) => {
        if (previousTime === undefined) {
          previousTime = time;
          requestStart = time;
        }
        const delta = Math.min((time - previousTime) / 1000, 0.1);
        previousTime = time;
        mixer?.update(delta);

        const elapsed = time - requestStart;
        const progress = Math.min(elapsed / cycleMs, 1);
        if (progress >= 1) {
          requestNumber += 1;
          requestStart = time;
          blocked = requestNumber % 10 >= 7;
        }

        const travelEnd = blocked ? gateX + 0.32 : appX;
        const eased = 1 - (1 - progress) ** 2;
        marker.position.x = requestFrom + (travelEnd - requestFrom) * eased;
        marker.visible = progress < 1;
        stopMark.visible = blocked && progress >= 0.48;
        render();
        frame = window.requestAnimationFrame(animate);
      };

      cleanup = () => {
        resizeObserver?.disconnect();
        visibilityObserver?.disconnect();
        motion.removeEventListener("change", updatePlayback);
        document.removeEventListener("visibilitychange", updatePlayback);
        window.cancelAnimationFrame(frame);
        mixer?.stopAllAction();
        if (model) {
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
        pathGeometry.dispose();
        (path.material as import("three").Material).dispose();
        marker.geometry.dispose();
        (marker.material as import("three").Material).dispose();
        for (const mark of [stopOne, stopTwo]) {
          mark.geometry.dispose();
          (mark.material as import("three").Material).dispose();
        }
        renderer.dispose();
        renderer.domElement.remove();
        delete container!.dataset.loaded;
      };

      try {
        const response = await fetch("/models/botstopper-rotating-aperture.glb", { signal: abort.signal });
        if (!response.ok) throw new Error("Unable to load BotStopper model");
        const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), "/models/");
        model = gltf.scene;
        if (disposed) {
          cleanup();
          return;
        }

        model.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          for (const material of materials) {
            material.transparent = true;
            material.opacity = 0.5;
            material.needsUpdate = true;
          }
        });

        const bounds = new THREE.Box3().setFromObject(model);
        const sphere = bounds.getBoundingSphere(new THREE.Sphere());
        model.position.sub(sphere.center);
        pivot = new THREE.Group();
        pivot.rotation.x = Math.PI / 2;
        pivot.add(model);
        pivot.scale.setScalar(0.72 / sphere.radius);
        scene.add(pivot);
        mixer = new THREE.AnimationMixer(model);
        for (const clip of gltf.animations) mixer.clipAction(clip).play();
        mixer.update(0);

        const resize = () => {
          const { width, height } = container!.getBoundingClientRect();
          if (!width || !height) return;
          const halfHeight = 2;
          const aspect = width / height;
          const worldX = (element: Element | null, fallback: number) => {
            if (!element) return fallback;
            const rect = element.getBoundingClientRect();
            return ((rect.left + rect.width / 2) - (container!.getBoundingClientRect().left + width / 2)) * (halfHeight * 2 / height);
          };
          requestFrom = worldX(stageRefs.current[1] ?? null, -2.2);
          gateX = worldX(stageRefs.current[2] ?? null, 0);
          appX = worldX(stageRefs.current[3] ?? null, 2.2);
          pathGeometry.setFromPoints([
            new THREE.Vector3(requestFrom, -1.18, 0),
            new THREE.Vector3(appX, -1.18, 0),
          ]);
          path.computeLineDistances();
          stopMark.position.x = gateX + 0.32;
          if (pivot) pivot.position.x = gateX;
          camera.left = -halfHeight * aspect;
          camera.right = halfHeight * aspect;
          camera.top = halfHeight;
          camera.bottom = -halfHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          render();
        };

        container!.appendChild(renderer.domElement);
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container!);
        resize();
        container!.dataset.loaded = "true";
        visibilityObserver = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          updatePlayback();
        });
        visibilityObserver.observe(container!);
        motion.addEventListener("change", updatePlayback);
        document.addEventListener("visibilitychange", updatePlayback);
      } catch (error) {
        cleanup();
        if (!abort.signal.aborted) throw error;
      }
    }

    let started = false;
    const loadObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      loadObserver.disconnect();
      void initialize().catch(() => {
        cleanup();
      });
    }, { rootMargin: "180px" });
    loadObserver.observe(container);

    return () => {
      disposed = true;
      loadObserver.disconnect();
      abort.abort();
      cleanup();
    };
  }, []);

  return (
    <figure className="anubis-request-flow" aria-labelledby="anubis-flow-caption">
      <figcaption id="anubis-flow-caption">
        A request passes through the load balancer and BotStopper before it reaches your app.
      </figcaption>
      <div className="anubis-flow-visual">
        <div className="anubis-flow-scene" ref={sceneRef} aria-hidden="true" />
        <ol className="anubis-flow-stages" aria-label="Request path">
          <li className="anubis-flow-stage" ref={(node) => { stageRefs.current[0] = node; }}><span className="anubis-flow-kicker">REQUESTS FROM</span><strong>Outside world</strong></li>
          <li className="anubis-flow-stage" ref={(node) => { stageRefs.current[1] = node; }}><span className="anubis-flow-kicker">FIRST STOP</span><strong>Load balancer <small>/ TLS terminator</small></strong></li>
          <li className="anubis-flow-stage anubis-flow-gate" ref={(node) => { stageRefs.current[2] = node; }}><span className="anubis-flow-kicker">INSPECTS EACH REQUEST</span><strong>BotStopper</strong></li>
          <li className="anubis-flow-stage" ref={(node) => { stageRefs.current[3] = node; }}><span className="anubis-flow-kicker">ALLOWED TRAFFIC</span><strong>Your app</strong></li>
        </ol>
      </div>
      <div className="anubis-flow-outcomes" aria-hidden="true">
        <span className="anubis-flow-blocked"><b aria-hidden="true">×</b> Bot requests blocked</span>
        <span className="anubis-flow-allowed">Allowed requests continue <b>→</b></span>
      </div>
      <p className="anubis-flow-description">
        BotStopper checks requests between your load balancer and app. It blocks some bot requests and allows others to continue to your app.
      </p>
    </figure>
  );
}
