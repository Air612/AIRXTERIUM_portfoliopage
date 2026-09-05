import { useEffect, useRef, useState } from "react";

export function Sculpture({ variant = "hero", motion = true, className = "" }) {
  const hostRef = useRef(null);
  const motionRef = useRef(motion);
  const controlsRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    motionRef.current = motion;
    controlsRef.current?.syncMotion();
  }, [motion]);

  useEffect(() => {
    const host = hostRef.current;
    let disposed = false;
    let release = () => {};
    setReady(false);

    async function createScene() {
      let renderer;
      let environment;
      let room;
      let pmrem;
      let scene;
      const materials = new Set();
      const geometries = new Set();

      const freeResources = () => {
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        environment?.dispose();
        room?.dispose();
        pmrem?.dispose();
        renderer?.dispose();
        renderer?.forceContextLoss();
        renderer?.domElement.remove();
      };

      try {
        const [THREE, { RoomEnvironment }] = await Promise.all([
          import("three"),
          import("three/addons/environments/RoomEnvironment.js"),
        ]);
        if (disposed) return;

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
        renderer.domElement.style.cssText =
          "display:block;width:100%;height:100%;position:absolute;inset:0;pointer-events:none;";
        renderer.domElement.setAttribute("aria-hidden", "true");

        scene = new THREE.Scene();
        pmrem = new THREE.PMREMGenerator(renderer);
        room = new RoomEnvironment();
        environment = pmrem.fromScene(room, 0.025);
        scene.environment = environment.texture;
        scene.environmentIntensity = 1.7;
        scene.environmentRotation.y = -0.55;
        room.dispose();
        room = null;
        pmrem.dispose();
        pmrem = null;

        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80);
        const sculpture = new THREE.Group();
        const satellites = new THREE.Group();
        scene.add(sculpture, satellites);

        const material = (parameters) => {
          const result = new THREE.MeshPhysicalMaterial(parameters);
          materials.add(result);
          return result;
        };
        const geometry = (result) => {
          geometries.add(result);
          return result;
        };
        const chrome = material({
          color: 0xc7cbc9,
          metalness: 1,
          roughness: 0.19,
          clearcoat: 0.55,
          clearcoatRoughness: 0.16,
          envMapIntensity: 1.05,
        });
        const acid = material({
          color: 0xd6fc72,
          roughness: 0.26,
          metalness: 0.22,
          emissive: 0x7e9b32,
          emissiveIntensity: 0.12,
        });
        const wire = new THREE.LineBasicMaterial({
          color: 0x737a68,
          transparent: true,
          opacity: 0.3,
          depthWrite: false,
        });
        materials.add(wire);

        const addOrbit = (radius, tiltX, tiltY, target = satellites) => {
          const points = Array.from({ length: 161 }, (_, index) => {
            const angle = (index / 160) * Math.PI * 2;
            return new THREE.Vector3(
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              0,
            );
          });
          const orbit = new THREE.LineLoop(
            geometry(new THREE.BufferGeometry().setFromPoints(points)),
            wire,
          );
          orbit.rotation.set(tiltX, tiltY, 0);
          target.add(orbit);
          return orbit;
        };

        const isProduct = variant === "product";
        const orbitingPoints = [];

        if (isProduct) {
          const core = new THREE.Mesh(
            geometry(new THREE.IcosahedronGeometry(1.27, 0)),
            chrome,
          );
          sculpture.add(core);
          const coreEdges = new THREE.EdgesGeometry(core.geometry);
          geometries.add(coreEdges);
          const edgeMaterial = new THREE.LineBasicMaterial({
            color: 0xd6fc72,
            transparent: true,
            opacity: 0.43,
          });
          materials.add(edgeMaterial);
          sculpture.add(new THREE.LineSegments(coreEdges, edgeMaterial));

          addOrbit(2.15, 1.1, 0.22);
          addOrbit(2.44, -0.7, 0.6);
          addOrbit(2.05, 0.15, -0.85);
          const sphere = geometry(new THREE.SphereGeometry(0.12, 20, 14));
          for (let index = 0; index < 5; index += 1) {
            const dot = new THREE.Mesh(sphere, index % 2 === 0 ? acid : chrome);
            dot.userData = {
              phase: index * 1.256,
              radius: 2.15 + (index % 2) * 0.22,
            };
            orbitingPoints.push(dot);
            satellites.add(dot);
          }
        } else {
          const knot = new THREE.Mesh(
            geometry(new THREE.TorusKnotGeometry(1.47, 0.48, 240, 40, 2, 3)),
            chrome,
          );
          sculpture.add(knot);
          addOrbit(3.05, 1.24, -0.26);
          const dot = new THREE.Mesh(
            geometry(new THREE.SphereGeometry(0.065, 20, 14)),
            acid,
          );
          dot.userData = { phase: 0.5, radius: 3.05 };
          orbitingPoints.push(dot);
          satellites.add(dot);
        }

        const key = new THREE.DirectionalLight(0xffffff, 3.5);
        key.position.set(-3, 4, 5);
        const rim = new THREE.DirectionalLight(0xe4f3c7, 1.8);
        rim.position.set(4, -1, -3);
        scene.add(key, rim);

        const pointer = { x: 0, y: 0 };
        const easedPointer = { x: 0, y: 0 };
        const section = host.closest("section") || host;
        let scrollTarget = 0;
        let easedScroll = 0;
        let inView = true;
        let contextLost = false;
        let frame = 0;
        let previousTime = 0;
        let elapsed = 0;

        const updateScene = () => {
          easedPointer.x += (pointer.x - easedPointer.x) * 0.045;
          easedPointer.y += (pointer.y - easedPointer.y) * 0.045;
          easedScroll += (scrollTarget - easedScroll) * 0.035;
          sculpture.rotation.set(
            (isProduct ? 0.24 : 0.75) +
              Math.sin(elapsed * 0.21) * 0.12 +
              easedPointer.y * 0.11 +
              easedScroll * 0.3,
            (isProduct ? -0.4 : -0.22) +
              elapsed * (isProduct ? 0.12 : 0.065) +
              easedPointer.x * 0.16,
            (isProduct ? 0.14 : -0.34) +
              Math.sin(elapsed * 0.17) * 0.09 +
              easedScroll * 0.12,
          );
          sculpture.position.y =
            Math.sin(elapsed * 0.55) * 0.09 - easedScroll * 0.18;
          satellites.rotation.y = Math.sin(elapsed * 0.13) * 0.18;
          orbitingPoints.forEach((dot) => {
            const angle =
              dot.userData.phase + elapsed * (isProduct ? 0.22 : 0.13);
            const radius = dot.userData.radius;
            dot.position.set(
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.35,
              Math.sin(angle) * radius * 0.94,
            );
          });
        };

        const render = () => {
          if (disposed || contextLost) return;
          renderer.render(scene, camera);
        };
        const stop = () => {
          window.cancelAnimationFrame(frame);
          frame = 0;
          previousTime = 0;
        };
        const animate = (time) => {
          frame = 0;
          if (
            disposed ||
            contextLost ||
            !motionRef.current ||
            !inView ||
            document.hidden
          )
            return;
          if (previousTime)
            elapsed += Math.min((time - previousTime) / 1000, 0.05);
          previousTime = time;
          updateScene();
          render();
          frame = window.requestAnimationFrame(animate);
        };
        const resume = () => {
          if (disposed || contextLost || !inView || document.hidden) return;
          if (motionRef.current && !frame)
            frame = window.requestAnimationFrame(animate);
          else if (!motionRef.current) render();
        };
        const updateScroll = () => {
          if (!motionRef.current || !inView || document.hidden) return;
          const rect = section.getBoundingClientRect();
          scrollTarget = Math.max(
            -1,
            Math.min(
              1,
              (window.innerHeight - rect.top * 2 - rect.height) /
                (window.innerHeight + rect.height),
            ),
          );
        };
        const onVisibility = () => {
          if (document.hidden) stop();
          else {
            updateScroll();
            resume();
          }
        };
        const onPointerMove = (event) => {
          if (!motionRef.current || !inView || event.pointerType !== "mouse")
            return;
          const rect = host.getBoundingClientRect();
          pointer.x =
            ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
          pointer.y =
            ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
        };
        const resetPointer = () => {
          pointer.x = 0;
          pointer.y = 0;
        };
        const onContextLost = (event) => {
          event.preventDefault();
          contextLost = true;
          stop();
          if (!disposed) setReady(false);
        };
        const resize = () => {
          if (disposed || contextLost) return;
          const width = Math.max(host.clientWidth, 1);
          const height = Math.max(host.clientHeight, 1);
          camera.aspect = width / height;
          camera.position.z =
            (isProduct ? 9.8 : 9.5) / Math.min(camera.aspect, 1);
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          updateScroll();
          if (inView && !document.hidden) render();
        };

        const observer = new IntersectionObserver(
          ([entry]) => {
            inView = entry.isIntersecting;
            if (inView) {
              updateScroll();
              resume();
            } else stop();
          },
          { rootMargin: "80px" },
        );
        const resizeObserver = new ResizeObserver(resize);
        host.appendChild(renderer.domElement);
        updateScene();
        resize();
        observer.observe(host);
        resizeObserver.observe(host);
        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("scroll", updateScroll, { passive: true });
        renderer.domElement.addEventListener("webglcontextlost", onContextLost);
        host.addEventListener("pointermove", onPointerMove, { passive: true });
        host.addEventListener("pointerleave", resetPointer, { passive: true });
        controlsRef.current = {
          syncMotion() {
            if (motionRef.current) {
              updateScroll();
              resume();
            } else stop();
          },
        };

        release = () => {
          controlsRef.current = null;
          stop();
          observer.disconnect();
          resizeObserver.disconnect();
          document.removeEventListener("visibilitychange", onVisibility);
          window.removeEventListener("scroll", updateScroll);
          renderer.domElement.removeEventListener(
            "webglcontextlost",
            onContextLost,
          );
          host.removeEventListener("pointermove", onPointerMove);
          host.removeEventListener("pointerleave", resetPointer);
          freeResources();
        };
        setReady(true);
        resume();
      } catch {
        freeResources();
        if (!disposed) setReady(false);
      }
    }

    createScene();
    return () => {
      disposed = true;
      release();
    };
  }, [variant]);

  return (
    <div
      ref={hostRef}
      className={`sculpture-stage sculpture-stage--${variant}${ready ? " is-ready" : ""} ${className}`}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden="true"
      data-renderer={ready ? "webgl" : "fallback"}
    >
      <div
        className="sculpture-fallback"
        style={{ visibility: ready ? "hidden" : "visible" }}
      >
        <span className="sculpture-fallback-ring" />
        <span className="sculpture-fallback-ring" />
        <span className="sculpture-fallback-ring" />
        <span className="sculpture-fallback-core" />
      </div>
    </div>
  );
}
