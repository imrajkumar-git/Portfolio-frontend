/**
 * The technical-expertise dataset behind /skills.
 *
 * `orbit` drives the draggable 3D sphere — each entry needs a brand colour and
 * a react-icons key (resolved in components/TechIcon.jsx). `categories` drives
 * the tabbed panel underneath.
 */

export const orbit = [
  { name: "Python", icon: "python", color: "#3776AB" },
  { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
  { name: "TypeScript", icon: "typescript", color: "#3178C6" },
  { name: "React", icon: "react", color: "#61DAFB" },
  { name: "Next.js", icon: "nextjs", color: "#FFFFFF" },
  { name: "Node.js", icon: "nodejs", color: "#5FA04E" },
  { name: "Django", icon: "django", color: "#0C4B33" },
  { name: "PostgreSQL", icon: "postgresql", color: "#4169E1" },
  { name: "MongoDB", icon: "mongodb", color: "#47A248" },
  { name: "Redis", icon: "redis", color: "#FF4438" },
  { name: "Docker", icon: "docker", color: "#2496ED" },
  { name: "Git", icon: "git", color: "#F05032" },
  { name: "GitHub", icon: "github", color: "#FFFFFF" },
  { name: "TailwindCSS", icon: "tailwind", color: "#38BDF8" },
  { name: "TensorFlow", icon: "tensorflow", color: "#FF6F00" },
  { name: "Pandas", icon: "pandas", color: "#150458" },
  { name: "NumPy", icon: "numpy", color: "#4DABCF" },
  { name: "Scikit-Learn", icon: "sklearn", color: "#F7931E" },
  { name: "Jupyter", icon: "jupyter", color: "#F37626" },
  { name: "Plotly", icon: "plotly", color: "#7A76FF" },
  { name: "Vercel", icon: "vercel", color: "#FFFFFF" },
  { name: "Supabase", icon: "supabase", color: "#3ECF8E" },
  { name: "Figma", icon: "figma", color: "#F24E1E" },
  { name: "Postman", icon: "postman", color: "#FF6C37" },
  { name: "GraphQL", icon: "graphql", color: "#E10098" },
  { name: "Firebase", icon: "firebase", color: "#FFCA28" },
  { name: "Prisma", icon: "prisma", color: "#5A67D8" },
  { name: "Express", icon: "express", color: "#FFFFFF" },
];

export const categories = [
  {
    id: "foundations",
    tab: "Foundations",
    title: "Programming Foundations",
    blurb:
      "Core concepts that underpin everything — applied across problem-solving, development, and system design.",
    skills: [
      { name: "Object-Oriented Programming" },
      { name: "Data Structures" },
      { name: "Algorithms" },
      { name: "Complexity Analysis" },
      { name: "Linear Algebra" },
      { name: "Probability & Statistics" },
      { name: "Computer Networks" },
      { name: "Operating Systems" },
      { name: "System Design" },
      { name: "REST API Design" },
    ],
  },
  {
    id: "languages",
    tab: "Languages",
    title: "Languages & Frameworks",
    blurb:
      "Languages and frameworks used across data work, backend logic, and frontend interfaces.",
    skills: [
      { name: "Python", icon: "python", color: "#3776AB" },
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
      { name: "TypeScript", icon: "typescript", color: "#3178C6" },
      { name: "SQL", icon: "postgresql", color: "#4169E1" },
      { name: "HTML / CSS", icon: "html", color: "#E34F26" },
      { name: "React", icon: "react", color: "#61DAFB" },
      { name: "Next.js", icon: "nextjs", color: "#FFFFFF" },
      { name: "Node.js", icon: "nodejs", color: "#5FA04E" },
      { name: "Express.js", icon: "express", color: "#FFFFFF" },
      { name: "Django", icon: "django", color: "#44B78B" },
      { name: "Django REST", icon: "django", color: "#44B78B" },
      { name: "TailwindCSS", icon: "tailwind", color: "#38BDF8" },
      { name: "PostgreSQL", icon: "postgresql", color: "#4169E1" },
      { name: "MongoDB", icon: "mongodb", color: "#47A248" },
      { name: "Prisma ORM", icon: "prisma", color: "#5A67D8" },
      { name: "GraphQL", icon: "graphql", color: "#E10098" },
    ],
  },
  {
    id: "ai-ml",
    tab: "AI / ML",
    title: "AI & Machine Learning",
    blurb:
      "Concepts explored through coursework and applied directly to analytical and agentic projects.",
    skills: [
      { name: "Supervised Learning" },
      { name: "Unsupervised Learning" },
      { name: "Deep Learning" },
      { name: "Neural Networks" },
      { name: "Natural Language Processing" },
      { name: "Feature Engineering" },
      { name: "Model Evaluation" },
      { name: "Data Preprocessing" },
      { name: "TensorFlow", icon: "tensorflow", color: "#FF6F00" },
      { name: "Scikit-Learn", icon: "sklearn", color: "#F7931E" },
      { name: "Pandas", icon: "pandas", color: "#A277FF" },
      { name: "NumPy", icon: "numpy", color: "#4DABCF" },
      { name: "Prompt Engineering" },
      { name: "Retrieval-Augmented Generation" },
    ],
  },
  {
    id: "tools",
    tab: "Tools",
    title: "Tools & Ecosystem",
    blurb:
      "Supporting toolchain for development, data work, DevOps, and deployment.",
    skills: [
      { name: "Git", icon: "git", color: "#F05032" },
      { name: "GitHub", icon: "github", color: "#FFFFFF" },
      { name: "Docker", icon: "docker", color: "#2496ED" },
      { name: "Redis", icon: "redis", color: "#FF4438" },
      { name: "Supabase", icon: "supabase", color: "#3ECF8E" },
      { name: "Vercel", icon: "vercel", color: "#FFFFFF" },
      { name: "Firebase", icon: "firebase", color: "#FFCA28" },
      { name: "Postman", icon: "postman", color: "#FF6C37" },
      { name: "VS Code", icon: "vscode", color: "#007ACC" },
      { name: "Jupyter", icon: "jupyter", color: "#F37626" },
      { name: "Plotly", icon: "plotly", color: "#7A76FF" },
      { name: "Figma", icon: "figma", color: "#F24E1E" },
      { name: "Photoshop", icon: "photoshop", color: "#31A8FF" },
      { name: "Illustrator", icon: "illustrator", color: "#FF9A00" },
      { name: "Linux", icon: "linux", color: "#FCC624" },
      { name: "Nginx", icon: "nginx", color: "#009639" },
    ],
  },
];

export default { orbit, categories };
