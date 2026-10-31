/**
 * Brand colours are picked for dark UIs: Next.js / GitHub / Vercel are pure
 * white and Pandas / Django are near-black navy. On the wrong theme they
 * disappear, so this nudges them just enough to stay readable while keeping
 * their hue.
 */
function parse(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex) {
  const [r, g, b] = parse(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function mix(hex, target, amount) {
  const a = parse(hex);
  const b = parse(target);
  const out = a.map((v, i) => Math.round(v + (b[i] - v) * amount));
  return `#${out.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function readableColor(hex, isLight) {
  if (!hex) return undefined;
  const l = luminance(hex);
  if (isLight) {
    if (l > 0.85) return "#0b2a1d"; // white marks become ink
    if (l > 0.35) return mix(hex, "#000000", 0.4); // yellows / cyans get deeper
    return hex;
  }
  if (l < 0.12) return mix(hex, "#ffffff", 0.62); // navy marks get lifted
  return hex;
}
