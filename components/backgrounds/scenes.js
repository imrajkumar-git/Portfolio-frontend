/**
 * Four 2D-canvas background scenes (the fifth, Aurora, is the WebGL
 * CosmicBackground). Each scene is a factory taking a 2D context and returning
 * { resize(w, h, mobile), draw(t, dt, pal, pointer, reduced) }.
 *
 * `pal` is the live theme palette, so every scene recolours instantly when the
 * theme flips. Dark uses additive "lighter" blending for glow; light switches to
 * normal blending with deeper colours so nothing washes out on white.
 */

export const PALETTE = {
  dark: {
    a: [61, 220, 145],
    b: [92, 201, 255],
    c: [167, 139, 250],
    ink: [234, 255, 245],
    blend: "lighter",
    m: 1,
  },
  light: {
    a: [8, 140, 84],
    b: [18, 118, 186],
    c: [106, 79, 216],
    ink: [4, 48, 31],
    blend: "source-over",
    m: 1.35,
  },
};

const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
const rand = (a, b) => a + Math.random() * (b - a);

/* ------------------------------------------------------------------ */
/* 1. Starfield warp — stars streaming past, vanishing point follows   */
/*    the pointer.                                                     */
/* ------------------------------------------------------------------ */
export function warpScene(ctx) {
  let w = 0;
  let h = 0;
  let stars = [];
  let vx = 0;
  let vy = 0;

  const spawn = (s, far) => {
    s.x = rand(-1, 1);
    s.y = rand(-1, 1);
    s.z = far ? 1 : rand(0.03, 1);
    s.c = Math.floor(Math.random() * 4);
    return s;
  };

  return {
    resize(W, H, mobile) {
      w = W;
      h = H;
      vx = w / 2;
      vy = h / 2;
      stars = Array.from({ length: mobile ? 130 : 270 }, () => spawn({}, false));
    },
    draw(t, dt, pal, pointer, reduced) {
      const tx = pointer.x > -1000 ? pointer.x : w / 2;
      const ty = pointer.y > -1000 ? pointer.y : h / 2;
      vx += (tx - vx) * 0.04;
      vy += (ty - vy) * 0.04;
      const f = Math.max(w, h) * 0.28;
      const step = reduced ? 0 : dt * 0.2;

      ctx.globalCompositeOperation = pal.blend;
      ctx.lineCap = "round";

      for (const s of stars) {
        s.z -= step * (0.35 + (1 - s.z) * 1.3);
        if (s.z <= 0.02) spawn(s, true);

        const z1 = s.z;
        const z0 = Math.min(1, z1 + 0.04 + (1 - z1) * 0.1);
        const x1 = vx + (s.x / z1) * f;
        const y1 = vy + (s.y / z1) * f;
        const x0 = vx + (s.x / z0) * f;
        const y0 = vy + (s.y / z0) * f;
        if ((x1 < -50 && x0 < -50) || (x1 > w + 50 && x0 > w + 50)) continue;
        if ((y1 < -50 && y0 < -50) || (y1 > h + 50 && y0 > h + 50)) continue;

        const near = 1 - z1;
        const col = s.c < 2 ? pal.ink : s.c === 2 ? pal.a : pal.b;
        ctx.strokeStyle = rgba(col, (0.18 + near * 0.95) * Math.min(1, pal.m * 0.85));
        ctx.lineWidth = 0.5 + near * 2.4;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
    },
  };
}

/* ------------------------------------------------------------------ */
/* 2. Code rain — falling glyph columns with a bright head.            */
/* ------------------------------------------------------------------ */
const GLYPHS = "01{}[]()<>/\\=+-*;:$#@&%!?~^|";

export function rainScene(ctx) {
  let w = 0;
  let h = 0;
  let size = 16;
  let rows = 0;
  let cols = [];

  const newCol = (x, scatter) => {
    const len = Math.round(rand(8, 22));
    return {
      x,
      y: scatter ? rand(-rows, rows) : -rand(0, 12),
      speed: rand(5, 14),
      len,
      hue: Math.random() < 0.6 ? "a" : Math.random() < 0.75 ? "b" : "c",
      chars: Array.from({ length: rows + 30 }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]),
    };
  };

  return {
    resize(W, H, mobile) {
      w = W;
      h = H;
      size = mobile ? 14 : 17;
      rows = Math.ceil(h / size);
      const n = Math.ceil(w / (size * 0.95));
      cols = Array.from({ length: n }, (_, i) => newCol(i * size * 0.95, true));
    },
    draw(t, dt, pal, pointer, reduced) {
      ctx.globalCompositeOperation = pal.blend;
      ctx.font = `${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx.textBaseline = "top";

      for (const col of cols) {
        if (!reduced) {
          const boost = Math.abs(col.x - pointer.x) < 90 ? 1.9 : 1;
          col.y += col.speed * boost * dt;
          if (Math.random() < 0.08) {
            col.chars[Math.floor(Math.random() * col.chars.length)] =
              GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
          if (col.y - col.len > rows) Object.assign(col, newCol(col.x, false));
        }
        const head = Math.floor(col.y);
        const base = pal[col.hue];
        for (let k = 0; k < col.len; k++) {
          const row = head - k;
          if (row < 0 || row >= rows) continue;
          const fade = Math.pow(1 - k / col.len, 1.7);
          ctx.fillStyle = k === 0 ? rgba(pal.ink, 0.95) : rgba(base, fade * 0.7 * Math.min(1.3, pal.m));
          ctx.fillText(col.chars[row], col.x, row * size);
        }
      }
    },
  };
}

/* ------------------------------------------------------------------ */
/* 3. Fireflies — soft glowing lights that wander and pulse; they      */
/*    drift toward the pointer.                                        */
/* ------------------------------------------------------------------ */
export function fireflyScene(ctx) {
  let w = 0;
  let h = 0;
  let flies = [];
  let sprites = null;
  let spritePal = null;

  const makeSprite = (col) => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, rgba(col, 1));
    gr.addColorStop(0.25, rgba(col, 0.55));
    gr.addColorStop(1, rgba(col, 0));
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return c;
  };

  return {
    resize(W, H, mobile) {
      w = W;
      h = H;
      flies = Array.from({ length: mobile ? 38 : 80 }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        size: rand(14, 46),
        ph: rand(0, Math.PI * 2),
        f1: rand(0.15, 0.5),
        f2: rand(0.15, 0.5),
        pulse: rand(0.6, 1.8),
        c: ["a", "a", "b", "c"][Math.floor(Math.random() * 4)],
        vx: 0,
        vy: 0,
      }));
    },
    draw(t, dt, pal, pointer, reduced) {
      if (spritePal !== pal) {
        sprites = { a: makeSprite(pal.a), b: makeSprite(pal.b), c: makeSprite(pal.c) };
        spritePal = pal;
      }
      ctx.globalCompositeOperation = pal.blend;

      for (const f of flies) {
        if (!reduced) {
          const dx = pointer.x - f.x;
          const dy = pointer.y - f.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 62000 && d2 > 1) {
            f.vx += dx * 0.000012;
            f.vy += dy * 0.000012;
          }
          f.vx *= 0.97;
          f.vy *= 0.97;
          f.x += Math.cos(t * f.f1 + f.ph) * 0.45 + f.vx * 60 * dt;
          f.y += Math.sin(t * f.f2 + f.ph) * 0.35 - 0.1 + f.vy * 60 * dt;
          if (f.x < -60) f.x = w + 60;
          else if (f.x > w + 60) f.x = -60;
          if (f.y < -60) f.y = h + 60;
          else if (f.y > h + 60) f.y = -60;
        }
        const glow = 0.5 + 0.5 * Math.sin(t * f.pulse + f.ph);
        const a = (0.22 + glow * 0.7) * Math.min(1.15, pal.m);
        const s = f.size * (0.85 + glow * 0.3);
        ctx.globalAlpha = Math.min(1, a);
        ctx.drawImage(sprites[f.c], f.x - s / 2, f.y - s / 2, s, s);
        ctx.globalAlpha = Math.min(1, a + 0.15);
        ctx.fillStyle = rgba(pal.ink, 0.9);
        ctx.beginPath();
        ctx.arc(f.x, f.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  };
}

/* ------------------------------------------------------------------ */
/* 4. Waves — layered ocean swell with rising bubbles; the pointer     */
/*    lifts the water beneath it.                                      */
/* ------------------------------------------------------------------ */
const LAYERS = [
  { amp: 0.05, len: 1.2, sp: 0.35, base: 0.6, col: "b", alpha: 0.12 },
  { amp: 0.06, len: 0.9, sp: -0.28, base: 0.67, col: "a", alpha: 0.14 },
  { amp: 0.045, len: 1.6, sp: 0.5, base: 0.74, col: "c", alpha: 0.11 },
  { amp: 0.05, len: 1.1, sp: -0.42, base: 0.81, col: "a", alpha: 0.18 },
  { amp: 0.04, len: 0.8, sp: 0.6, base: 0.89, col: "b", alpha: 0.22 },
];

export function waveScene(ctx) {
  let w = 0;
  let h = 0;
  let step = 8;
  let bubbles = [];
  let bump = 0;

  const newBubble = (anywhere) => ({
    x: rand(0, w),
    y: anywhere ? rand(0, h) : h + rand(0, 40),
    r: rand(1.5, 5),
    sp: rand(10, 32),
    ph: rand(0, 6.28),
  });

  return {
    resize(W, H, mobile) {
      w = W;
      h = H;
      step = mobile ? 12 : 7;
      bubbles = Array.from({ length: mobile ? 14 : 28 }, () => newBubble(true));
    },
    draw(t, dt, pal, pointer, reduced) {
      ctx.globalCompositeOperation = pal.blend;
      const tt = reduced ? 0 : t;
      const target = pointer.x > -1000 ? 1 : 0;
      bump += (target - bump) * 0.05;

      LAYERS.forEach((L, i) => {
        const col = pal[L.col];
        const top = h * L.base - h * L.amp * 1.5;
        const g = ctx.createLinearGradient(0, top, 0, h);
        g.addColorStop(0, rgba(col, L.alpha * pal.m));
        g.addColorStop(1, rgba(col, L.alpha * pal.m * 0.12));

        ctx.beginPath();
        ctx.moveTo(0, h);
        const pts = [];
        for (let x = 0; x <= w + step; x += step) {
          const u = x / w;
          let y =
            h * L.base +
            h * L.amp * Math.sin(u * Math.PI * 2 * L.len + tt * L.sp * 1.4 + i) +
            h * L.amp * 0.4 * Math.sin(u * Math.PI * 2 * L.len * 2.3 - tt * L.sp * 1.9);
          if (bump > 0.01) {
            const d = (x - pointer.x) / (w * 0.14);
            y -= h * 0.045 * bump * Math.exp(-d * d) * (1 - i * 0.12);
          }
          pts.push(x, y);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w + step, h);
        ctx.closePath();
        ctx.fillStyle = g;
        ctx.fill();

        ctx.beginPath();
        for (let k = 0; k < pts.length; k += 2) {
          if (k === 0) ctx.moveTo(pts[k], pts[k + 1]);
          else ctx.lineTo(pts[k], pts[k + 1]);
        }
        ctx.strokeStyle = rgba(col, Math.min(0.75, L.alpha * 3.2 * pal.m));
        ctx.lineWidth = 1.4;
        ctx.stroke();
      });

      // bubbles
      ctx.lineWidth = 1;
      for (const b of bubbles) {
        if (!reduced) {
          b.y -= b.sp * dt;
          b.x += Math.sin(t * 1.2 + b.ph) * 0.25;
          if (b.y < -10) Object.assign(b, newBubble(false));
        }
        ctx.strokeStyle = rgba(pal.b, 0.4 * Math.min(1.2, pal.m));
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
  };
}

export const SCENES = {
  warp: warpScene,
  rain: rainScene,
  fireflies: fireflyScene,
  waves: waveScene,
};
