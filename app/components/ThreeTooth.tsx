"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

export default function ThreeTooth() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    tooth: THREE.Group;
    particles: THREE.Points;
    glow: THREE.Mesh;
    glow2: THREE.Mesh;
    movingLight: THREE.PointLight;
    mouse: { x: number; y: number };
    targetMouse: { x: number; y: number };
    rafId: number;
    isInView: boolean;
    scrollProgress: number;
    time: number;
    entranceProgress: number;
  } | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sceneRef.current) return;
    const rect = mountRef.current?.getBoundingClientRect();
    if (!rect) return;
    sceneRef.current.targetMouse.x =
      ((e.clientX - rect.left) / rect.width) * 2 - 1;
    sceneRef.current.targetMouse.y =
      -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ═══════════════════════════════════════════
    // PREMIUM STUDIO LIGHTING
    // ═══════════════════════════════════════════

    // Soft ambient fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    // Main key light — warm white from upper right
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.1);
    mainLight.position.set(3, 4, 5);
    scene.add(mainLight);

    // Fill light — teal accent from left
    const fillLight = new THREE.DirectionalLight(0x67b7b2, 0.3);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    // Rim light — subtle edge highlight
    const rimLight = new THREE.PointLight(0x0b7c83, 0.4, 10);
    rimLight.position.set(0, 2, -3);
    scene.add(rimLight);

    // Back light — soft depth
    const backLight = new THREE.PointLight(0xe8f7f5, 0.3, 10);
    backLight.position.set(0, -1, -4);
    scene.add(backLight);

    // Moving highlight light — travels across tooth surface
    const movingLight = new THREE.PointLight(0xffffff, 0.6, 6);
    movingLight.position.set(-2, 1, 3);
    scene.add(movingLight);

    // ═══════════════════════════════════════════
    // PROCEDURAL TOOTH — Premium Medical Material
    // ═══════════════════════════════════════════

    const toothGroup = new THREE.Group();

    // Premium enamel material — glossy, slightly translucent
    const toothMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8f5f0,
      roughness: 0.1,
      metalness: 0.01,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.05,
      thickness: 0.6,
      envMapIntensity: 0.8,
      sheen: 0.4,
      sheenRoughness: 0.15,
      sheenColor: new THREE.Color(0xe8f7f5),
      ior: 1.5,
    });

    // Crown — main body
    const crownGeo = new THREE.CapsuleGeometry(0.6, 0.8, 16, 32);
    const crown = new THREE.Mesh(crownGeo, toothMaterial);
    crown.position.y = 0.5;
    crown.scale.set(1, 1.1, 0.85);
    toothGroup.add(crown);

    // Crown top — rounded occlusal surface
    const topBumpGeo = new THREE.SphereGeometry(0.55, 24, 16);
    const topBump = new THREE.Mesh(topBumpGeo, toothMaterial);
    topBump.position.y = 1.05;
    topBump.scale.set(1, 0.6, 0.85);
    toothGroup.add(topBump);

    // Roots — slightly warmer tone
    const rootMat = new THREE.MeshPhysicalMaterial({
      color: 0xede5d8,
      roughness: 0.2,
      metalness: 0.01,
      clearcoat: 0.5,
    });

    const rootGeo = new THREE.CapsuleGeometry(0.18, 0.7, 8, 16);
    const root1 = new THREE.Mesh(rootGeo, rootMat);
    root1.position.set(-0.22, -0.7, 0);
    root1.rotation.z = 0.12;
    toothGroup.add(root1);

    const root2 = new THREE.Mesh(rootGeo, rootMat);
    root2.position.set(0.22, -0.7, 0);
    root2.rotation.z = -0.12;
    toothGroup.add(root2);

    const root3Geo = new THREE.CapsuleGeometry(0.14, 0.55, 8, 16);
    const root3 = new THREE.Mesh(root3Geo, rootMat);
    root3.position.set(0, -0.65, 0.15);
    toothGroup.add(root3);

    // Cusps — detailed anatomical features
    const cuspGeo = new THREE.SphereGeometry(0.18, 12, 8);
    const cuspPositions = [
      [-0.2, 1.35, -0.15],
      [0.2, 1.35, -0.15],
      [-0.15, 1.35, 0.18],
      [0.15, 1.35, 0.18],
    ];
    cuspPositions.forEach((pos) => {
      const cusp = new THREE.Mesh(cuspGeo, toothMaterial);
      cusp.position.set(pos[0], pos[1], pos[2]);
      cusp.scale.y = 0.7;
      toothGroup.add(cusp);
    });

    // Start small and transparent for entrance animation
    toothGroup.position.y = -0.2;
    toothGroup.scale.setScalar(0.01);
    scene.add(toothGroup);

    // ═══════════════════════════════════════════
    // FLOATING PARTICLES — Medical Tech Dust
    // ═══════════════════════════════════════════

    const particleCount = isMobile ? 20 : 45;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      sizes[i] = Math.random() * 0.02 + 0.01;
    }
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0x67b7b2,
      size: 0.02,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ═══════════════════════════════════════════
    // RADIAL TEAL GLOW — Behind Tooth
    // ═══════════════════════════════════════════

    const glowGeo = new THREE.SphereGeometry(1.6, 32, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x0b7c83,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.z = -1.5;
    scene.add(glow);

    const glowGeo2 = new THREE.SphereGeometry(2.0, 32, 16);
    const glowMat2 = new THREE.MeshBasicMaterial({
      color: 0x67b7b2,
      transparent: true,
      opacity: 0.03,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glow2 = new THREE.Mesh(glowGeo2, glowMat2);
    glow2.position.z = -2.0;
    scene.add(glow2);

    // ═══════════════════════════════════════════
    // SCENE REF
    // ═══════════════════════════════════════════

    sceneRef.current = {
      renderer,
      scene,
      camera,
      tooth: toothGroup,
      particles,
      glow,
      glow2,
      movingLight,
      mouse: { x: 0, y: 0 },
      targetMouse: { x: 0, y: 0 },
      rafId: 0,
      isInView: true,
      scrollProgress: 0,
      time: 0,
      entranceProgress: 0,
    };

    // Scroll observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (sceneRef.current) {
          sceneRef.current.isInView = entry.isIntersecting;
        }
      },
      { threshold: 0 }
    );
    observer.observe(container);

    // Scroll listener
    const handleScroll = () => {
      if (!sceneRef.current) return;
      const rect = container.getBoundingClientRect();
      const viewH = window.innerHeight;
      sceneRef.current.scrollProgress = Math.max(
        0,
        Math.min(1, 1 - (rect.bottom / (rect.height + viewH)))
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Mouse listener
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ═══════════════════════════════════════════
    // ANIMATION LOOP
    // ═══════════════════════════════════════════

    const animate = () => {
      if (!sceneRef.current) return;
      const { renderer, scene, camera, tooth, particles, glow, glow2, movingLight, mouse, targetMouse, isInView } =
        sceneRef.current;

      sceneRef.current.rafId = requestAnimationFrame(animate);

      if (!isInView) return;

      sceneRef.current.time += 0.005;
      const time = sceneRef.current.time;

      // Smooth mouse interpolation (lerp)
      mouse.x += (targetMouse.x - mouse.x) * 0.04;
      mouse.y += (targetMouse.y - mouse.y) * 0.04;

      // ── ENTRANCE ANIMATION ──
      // 0%→40%: scale up, 40%→70%: become sharp, 70%→100%: final position
      if (!prefersReduced && sceneRef.current.entranceProgress < 1) {
        sceneRef.current.entranceProgress = Math.min(
          1,
          sceneRef.current.entranceProgress + 0.012
        );
      }
      const ep = sceneRef.current.entranceProgress;

      // Cubic-bezier-like easing for entrance
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const entranceScale = easeOut(Math.min(1, ep * 1.4)) * 1.0;
      const entranceOpacity = easeOut(Math.min(1, ep * 1.2));
      const entranceBlur = ep < 0.6 ? (1 - ep / 0.6) * 0.5 : 0;

      if (!prefersReduced) {
        // ── TOOTH ROTATION ──
        // Continuous slow Y rotation + mouse influence
        tooth.rotation.y = time * 0.3 + mouse.x * 0.3;
        tooth.rotation.x = Math.sin(time * 0.4) * 0.05 + mouse.y * 0.1;

        // ── FLOATING ──
        tooth.position.y = -0.2 + Math.sin(time * 0.5) * 0.08;

        // ── SCROLL TRANSFORM ──
        const sp = sceneRef.current.scrollProgress;

        // Scale: grow slightly, then shrink as it disappears
        const scrollScale = sp < 0.5
          ? 1 + sp * 0.5
          : 1.25 - (sp - 0.5) * 1.5;
        const finalScale = Math.max(0, scrollScale) * entranceScale;
        tooth.scale.setScalar(finalScale);

        // Move toward center on scroll
        tooth.position.x = -sp * 0.5;

        // Rotate more on scroll
        tooth.rotation.y += sp * 2.0;

        // Move backward in 3D space
        tooth.position.z = -sp * 1.5;

        // Fade out on scroll
        const fadeOut = sp > 0.6 ? 1 - (sp - 0.6) / 0.4 : 1;
        tooth.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = child.material as THREE.MeshPhysicalMaterial;
            if (mat.opacity !== undefined) {
              mat.transparent = true;
              mat.opacity = entranceOpacity * fadeOut;
            }
          }
        });

        // ── PARTICLE DRIFT ──
        const pos = particles.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const arr = pos.array as Float32Array;
          arr[i * 3 + 1] += Math.sin(time * 0.7 + i * 0.4) * 0.0005;
          arr[i * 3] += Math.cos(time * 0.3 + i * 0.6) * 0.0003;
          if (arr[i * 3 + 1] > 2.2) arr[i * 3 + 1] = -2.2;
          if (arr[i * 3 + 1] < -2.2) arr[i * 3 + 1] = 2.2;
        }
        pos.needsUpdate = true;
        particles.rotation.y = time * 0.03;
        particles.rotation.x = Math.sin(time * 0.2) * 0.02;
        // Fade particles with scroll
        (particles.material as THREE.PointsMaterial).opacity = 0.35 * fadeOut;

        // ── GLOW PULSE ──
        (glow.material as THREE.MeshBasicMaterial).opacity =
          0.06 + Math.sin(time * 0.6) * 0.02;
        (glow2.material as THREE.MeshBasicMaterial).opacity =
          0.03 + Math.sin(time * 0.4 + 1) * 0.01;

        // Glow follows tooth position
        glow.position.x = tooth.position.x * 0.5;
        glow.position.y = tooth.position.y * 0.3;
        glow2.position.x = tooth.position.x * 0.3;

        // ── MOVING HIGHLIGHT ──
        // White highlight that travels across tooth surface
        const highlightAngle = time * 0.4;
        movingLight.position.x = Math.cos(highlightAngle) * 2.5;
        movingLight.position.y = Math.sin(highlightAngle * 0.7) * 1.5 + 1;
        movingLight.position.z = 2.5 + Math.sin(highlightAngle) * 0.5;
        movingLight.intensity = 0.5 + Math.sin(time * 0.8) * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!sceneRef.current || !container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(sceneRef.current?.rafId ?? 0);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      renderer.dispose();
      container.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={mountRef}
      className="three-tooth-canvas"
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    />
  );
}
