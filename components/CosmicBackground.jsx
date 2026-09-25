"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/context/ThemeContext";

/**
 * The site's persistent background.
 *
 * Three layers, rendered once in the root layout so they sit behind every page:
 *   1. an aurora shader — slow domain-warped noise in the emerald/sky palette
 *   2. three parallax star layers that drift at different speeds
 *   3. a thin horizon grid that gives the scene a floor
 *
 * The whole thing eases toward the pointer, so moving the mouse shifts the
 * parallax slightly. Falls back to a still frame under prefers-reduced-motion,
 * and pauses entirely when the tab is hidden.
 */

const AURORA_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const AURORA_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uAspect;
  uniform vec3 uEmerald;
  uniform vec3 uSky;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= uAspect;
    float t = uTime * 0.035;

    // Domain warping gives the ribbons their folded, curtain-like shape.
    vec2 q = vec2(fbm(uv * 2.4 + vec2(0.0, t)), fbm(uv * 2.4 + vec2(3.7, -t)));
    vec2 r = vec2(
      fbm(uv * 3.1 + 3.0 * q + vec2(1.7, 9.2) + 0.25 * t),
      fbm(uv * 3.1 + 3.0 * q + vec2(8.3, 2.8) - 0.20 * t)
    );
    float f = fbm(uv * 2.0 + 2.6 * r);

    // Concentrate the glow into bands instead of washing the whole screen.
    float band = smoothstep(0.18, 0.95, f + 0.35);
    float vignette = smoothstep(1.15, 0.15, distance(vUv, vec2(0.5, 0.42)));

    vec3 col = mix(uEmerald, uSky, clamp(r.x * 1.6 + 0.35, 0.0, 1.0));
    float alpha = band * vignette * uIntensity;

    gl_FragColor = vec4(col * (0.55 + band * 0.9), alpha);
  }
`;

export default function CosmicBackground() {
  const mountRef = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      58,
      mount.clientWidth / mount.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const emerald = new THREE.Color("#1fc879");
    const sky = new THREE.Color("#2fb2f4");
    const white = new THREE.Color("#eafff5");

    // ---------- layer 1: aurora ----------
    const auroraUniforms = {
      uTime: { value: 0 },
      uIntensity: { value: 0.0 }, // eased in over the first frames
      uAspect: { value: mount.clientWidth / mount.clientHeight },
      uEmerald: { value: emerald },
      uSky: { value: sky },
    };

    const auroraMat = new THREE.ShaderMaterial({
      uniforms: auroraUniforms,
      vertexShader: AURORA_VERT,
      fragmentShader: AURORA_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const aurora = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), auroraMat);
    const auroraScene = new THREE.Scene();
    const auroraCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    auroraScene.add(aurora);

    // ---------- layer 2: parallax stars ----------
    const starLayers = [];
    const LAYER_SPECS = [
      { count: 700, spread: 260, size: 1.5, depth: -120, speed: 0.02, opacity: 0.95 },
      { count: 900, spread: 420, size: 1.0, depth: -260, speed: 0.012, opacity: 0.65 },
      { count: 700, spread: 620, size: 0.7, depth: -420, speed: 0.006, opacity: 0.4 },
    ];
    const mobile = window.innerWidth < 768;

    LAYER_SPECS.forEach((spec) => {
      const count = mobile ? Math.round(spec.count * 0.45) : spec.count;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const palette = [white, white, emerald, sky];

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        pos[i3] = (Math.random() - 0.5) * spec.spread * 2.2;
        pos[i3 + 1] = (Math.random() - 0.5) * spec.spread * 1.4;
        pos[i3 + 2] = spec.depth + (Math.random() - 0.5) * 80;

        const c = palette[Math.floor(Math.random() * palette.length)];
        col[i3] = c.r;
        col[i3 + 1] = c.g;
        col[i3 + 2] = c.b;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));

      const mat = new THREE.PointsMaterial({
        size: spec.size,
        vertexColors: true,
        transparent: true,
        opacity: spec.opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);
      starLayers.push({ pts, mat, spec, baseSize: spec.size });
    });

    // ---------- layer 3: horizon grid ----------
    const grid = new THREE.GridHelper(1400, 44, emerald, sky);
    grid.material.transparent = true;
    grid.material.opacity = 0.05;
    grid.material.depthWrite = false;
    grid.position.set(0, -130, -260);
    grid.rotation.x = 0.06;
    scene.add(grid);

    // ---------- pointer parallax ----------
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onPointerMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ---------- loop ----------
    let raf;
    let running = true;
    const clock = new THREE.Clock();

    const render = () => {
      const t = clock.getElapsedTime();

      // Fade the aurora in once, rather than popping on at full strength.
      const target = reduced ? 0.4 : 0.62;
      auroraUniforms.uIntensity.value +=
        (target - auroraUniforms.uIntensity.value) * 0.02;
      if (!reduced) auroraUniforms.uTime.value = t;

      eased.x += (pointer.x - eased.x) * 0.035;
      eased.y += (pointer.y - eased.y) * 0.035;

      starLayers.forEach(({ pts, mat, spec, baseSize }, i) => {
        if (!reduced) {
          pts.rotation.y = t * spec.speed;
          pts.rotation.x = Math.sin(t * spec.speed * 1.6) * 0.03;
          mat.size = baseSize + Math.sin(t * 1.4 + i) * baseSize * 0.12;
        }
        // Nearer layers move further with the pointer.
        const push = 14 - i * 4;
        pts.position.x = -eased.x * push;
        pts.position.y = eased.y * push * 0.6;
      });

      camera.position.x += (eased.x * 4 - camera.position.x) * 0.04;
      camera.position.y += (-eased.y * 3 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, -200);

      renderer.autoClear = true;
      renderer.render(auroraScene, auroraCam);
      renderer.autoClear = false;
      renderer.render(scene, camera);

      if (running) raf = requestAnimationFrame(render);
    };
    render();

    // Stop burning frames on a hidden tab.
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      auroraUniforms.uAspect.value = mount.clientWidth / mount.clientHeight;
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      starLayers.forEach(({ pts, mat }) => {
        pts.geometry.dispose();
        mat.dispose();
      });
      aurora.geometry.dispose();
      auroraMat.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 -z-10 transition-colors duration-700 ${
        isLight
          ? "bg-[radial-gradient(120%_90%_at_50%_0%,#f2fbf7_0%,#e6f4fb_45%,#eef9f4_100%)]"
          : "bg-[radial-gradient(120%_90%_at_50%_0%,#08211c_0%,#05100e_48%,#030706_100%)]"
      }`}
      aria-hidden="true"
    >
      <div
        ref={mountRef}
        className="absolute inset-0"
        style={{ opacity: isLight ? 0.45 : 1 }}
      />
      {/* Soft falloff keeps body text legible over the brightest bands. */}
      <div
        className={`absolute inset-0 ${
          isLight
            ? "bg-gradient-to-b from-white/50 via-white/10 to-white/60"
            : "bg-gradient-to-b from-black/40 via-transparent to-black/70"
        }`}
      />
      <div className="bg-noise absolute inset-0" />
    </div>
  );
}
