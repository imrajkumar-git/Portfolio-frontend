"use client";

import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiDjango,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiGit,
  SiGithub,
  SiTailwindcss,
  SiTensorflow,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiJupyter,
  SiPlotly,
  SiVercel,
  SiSupabase,
  SiFigma,
  SiPostman,
  SiGraphql,
  SiFirebase,
  SiPrisma,
  SiExpress,
  SiHtml5,
  SiLinux,
  SiNginx,
} from "react-icons/si";
// The Adobe marks aren't in the simple-icons set shipped with react-icons,
// so these come from the devicons pack instead.
import { DiPhotoshop, DiIllustrator } from "react-icons/di";
import { VscVscode } from "react-icons/vsc";
import { FiCode } from "react-icons/fi";

const REGISTRY = {
  python: SiPython,
  javascript: SiJavascript,
  typescript: SiTypescript,
  react: SiReact,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  django: SiDjango,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  redis: SiRedis,
  docker: SiDocker,
  git: SiGit,
  github: SiGithub,
  tailwind: SiTailwindcss,
  tensorflow: SiTensorflow,
  pandas: SiPandas,
  numpy: SiNumpy,
  sklearn: SiScikitlearn,
  jupyter: SiJupyter,
  plotly: SiPlotly,
  vercel: SiVercel,
  supabase: SiSupabase,
  figma: SiFigma,
  postman: SiPostman,
  graphql: SiGraphql,
  firebase: SiFirebase,
  prisma: SiPrisma,
  express: SiExpress,
  html: SiHtml5,
  linux: SiLinux,
  nginx: SiNginx,
  photoshop: DiPhotoshop,
  illustrator: DiIllustrator,
  vscode: VscVscode,
};

export default function TechIcon({ name, className, style }) {
  const Icon = REGISTRY[name] || FiCode;
  return <Icon className={className} style={style} aria-hidden="true" />;
}
