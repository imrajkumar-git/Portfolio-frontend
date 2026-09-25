/**
 * Project case studies shown on /projects and teased on the homepage.
 * `featured: true` pulls a project into the homepage selection.
 */

export const projects = [
  {
    slug: "portfolio-community-platform",
    title: "Portfolio & Community Platform",
    tagline: "This site — a Next.js frontend on a Django REST backend.",
    description:
      "A personal site that doubles as a small community platform: JWT auth with email OTP verification, a blog authors can write and illustrate from the browser, a testimonials wall, and a staff-only admin panel.",
    year: "2026",
    role: "Design & full-stack build",
    status: "Live",
    featured: true,
    stack: ["Next.js", "React", "Django REST", "PostgreSQL", "TailwindCSS", "JWT"],
    highlights: [
      "Email-OTP registration with token refresh handled transparently in the axios client.",
      "Blog covers upload straight from the author's device, validated on both ends.",
      "WebGL background and an interactive skills globe, both reduced-motion aware.",
    ],
    links: { live: "/", source: "" },
  },
  {
    slug: "store-operations-dashboard",
    title: "Store Operations Dashboard",
    tagline: "Shift reporting and stock visibility for a busy retail floor.",
    description:
      "Built from the problems I lived with on shift: end-of-day reconciliation, stock counts, and shift handover notes in one place, so the next team starts informed instead of guessing.",
    year: "2025",
    role: "Product & development",
    status: "Case study",
    featured: true,
    stack: ["React", "Node.js", "PostgreSQL", "Chart.js"],
    highlights: [
      "Cash-drawer reconciliation that flags discrepancies as they're entered.",
      "Stock thresholds that surface restock needs before a shelf empties.",
      "Shift handover notes attached to the day, not to a person's memory.",
    ],
    links: { live: "", source: "" },
  },
  {
    slug: "ml-sales-forecasting",
    title: "Retail Sales Forecasting",
    tagline: "Predicting weekly demand from two years of transaction history.",
    description:
      "A forecasting notebook turned into a small service: cleans transaction exports, engineers seasonal and promotional features, and compares several models before serving weekly predictions.",
    year: "2025",
    role: "Data & modelling",
    status: "Case study",
    featured: true,
    stack: ["Python", "Pandas", "Scikit-Learn", "Plotly", "FastAPI"],
    highlights: [
      "Feature engineering for weekday, seasonality, and promotional periods.",
      "Model comparison across linear, tree-based, and gradient-boosted baselines.",
      "Interactive Plotly charts for reviewing forecast error by product line.",
    ],
    links: { live: "", source: "" },
  },
  {
    slug: "brand-identity-kit",
    title: "Brand Identity Kits",
    tagline: "Logo, palette, and collateral systems for small businesses.",
    description:
      "Design work from my internship years and since — logos, banners, posters, and social templates delivered as a reusable kit rather than one-off files, so a business can keep producing on-brand material itself.",
    year: "2021 — 2024",
    role: "Graphic design",
    status: "Ongoing",
    featured: false,
    stack: ["Photoshop", "Illustrator", "Figma", "Canva"],
    highlights: [
      "Logo systems with spacing, colour, and misuse rules documented.",
      "Editable social templates so clients can post without a designer.",
      "Print-ready collateral prepared alongside the digital set.",
    ],
    links: { live: "", source: "" },
  },
];

export default projects;
