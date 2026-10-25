"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { experience, education, skills, languages } from "@/data/experience";
import { projects } from "@/data/projects";

/* Pages the `open` command can navigate to. */
const PAGES = {
  about: "/about",
  experience: "/experience",
  skills: "/skills",
  projects: "/projects",
  blog: "/blog",
  reviews: "/reviews",
  contact: "/contact",
};

/* Commands shown in `help` and as tappable chips under the terminal. */
const COMMANDS = [
  { name: "help", desc: "list every command" },
  { name: "about", desc: "who I am and what I do" },
  { name: "skills", desc: "tools and technologies" },
  { name: "experience", desc: "where I have worked" },
  { name: "projects", desc: "things I have built" },
  { name: "education", desc: "studies and diplomas" },
  { name: "languages", desc: "languages I speak" },
  { name: "contact", desc: "how to reach me" },
  { name: "open <page>", desc: "go to a page, e.g. open blog" },
  { name: "clear", desc: "clear the terminal" },
];

const CHIPS = ["help", "about", "skills", "experience", "projects", "contact"];
const AUTOCOMPLETE = [
  ...COMMANDS.map((c) => c.name.split(" ")[0]),
  "whoami",
  "ls",
  "blog",
];

const Row = ({ label, children }) => (
  <div className="term-row">
    <span className="term-key">{label}</span>
    <span className="term-val">{children}</span>
  </div>
);

function runCommand(raw, router) {
  const input = raw.trim();
  if (!input) return { lines: [] };

  const [cmdRaw, ...args] = input.split(/\s+/);
  const cmd = cmdRaw.toLowerCase();

  switch (cmd) {
    case "help":
      return {
        lines: [
          <p key="h" className="term-muted">
            Available commands:
          </p>,
          ...COMMANDS.map((c) => (
            <Row key={c.name} label={c.name}>
              {c.desc}
            </Row>
          )),
        ],
      };

    case "about":
      return {
        lines: [
          <p key="a1">
            I&apos;m Rajkumar Aryal, a Computer Engineering graduate (TEVT
            Diploma) based in Baniyas, Abu Dhabi.
          </p>,
          <p key="a2">
            I focus on full-stack web development: Python and JavaScript on the
            backend, React and Next.js on the front, with a graphic-design
            background that keeps the interfaces clean and colourful.
          </p>,
          <p key="a3" className="term-muted">
            Type <b>open about</b> for the full story.
          </p>,
        ],
      };

    case "whoami":
      return {
        lines: [<p key="w">Rajkumar Aryal, full-stack developer, Abu Dhabi, UAE.</p>],
      };

    case "skills":
      return {
        lines: [
          ...Object.entries(skills).map(([group, items]) => (
            <Row key={group} label={group}>
              {items.join(", ")}
            </Row>
          )),
          <p key="s" className="term-muted">
            Type <b>open skills</b> to explore the interactive skills globe.
          </p>,
        ],
      };

    case "experience":
      return {
        lines: [
          ...experience.map((job) => (
            <Row key={job.role + job.company} label={job.period}>
              {job.role} at {job.company}
            </Row>
          )),
          <p key="e" className="term-muted">
            Type <b>open experience</b> for the full timeline.
          </p>,
        ],
      };

    case "projects":
      return {
        lines: [
          ...projects.map((p) => (
            <Row key={p.slug} label={p.year}>
              <b>{p.title}</b>: {p.tagline}
            </Row>
          )),
          <p key="p" className="term-muted">
            Type <b>open projects</b> to see the case studies.
          </p>,
        ],
      };

    case "education":
      return {
        lines: education.map((e) => (
          <Row key={e.title} label={e.period}>
            {e.title}, {e.school}
          </Row>
        )),
      };

    case "languages":
      return {
        lines: languages.map((l) => (
          <Row key={l.name} label={l.name}>
            {l.level}
          </Row>
        )),
      };

    case "contact":
      return {
        lines: [
          <Row key="c1" label="email">
            <a href="mailto:rajkumararyal0977@gmail.com">
              rajkumararyal0977@gmail.com
            </a>
          </Row>,
          <Row key="c2" label="phone">
            <a href="tel:+9710547809320">+971 054 780 9320</a>
          </Row>,
          <Row key="c3" label="linkedin">
            <a
              href="https://www.linkedin.com/in/rajkumar-aryal-38b43a233"
              target="_blank"
              rel="noreferrer"
            >
              linkedin.com/in/rajkumar-aryal-38b43a233
            </a>
          </Row>,
          <p key="c4" className="term-muted">
            Or type <b>open contact</b> to send a message from the site.
          </p>,
        ],
      };

    case "ls":
      return {
        lines: [<p key="ls">{Object.keys(PAGES).join("   ")}</p>],
      };

    case "open":
    case "cd": {
      const target = (args[0] || "").toLowerCase().replace(/^\/|\/$/g, "");
      if (!target) {
        return {
          lines: [
            <p key="o" className="term-err">
              Usage: open &lt;page&gt;. Pages: {Object.keys(PAGES).join(", ")}.
            </p>,
          ],
        };
      }
      if (!PAGES[target]) {
        return {
          lines: [
            <p key="o" className="term-err">
              No page called &quot;{target}&quot;. Pages: {Object.keys(PAGES).join(", ")}.
            </p>,
          ],
        };
      }
      // Navigate after the line has had a chance to render.
      setTimeout(() => router.push(PAGES[target]), 350);
      return { lines: [<p key="o">Opening /{target} ...</p>] };
    }

    case "blog":
    case "reviews":
      return {
        lines: [
          <p key="b">
            The {cmd} lives on its own page. Type <b>open {cmd}</b> to go there.
          </p>,
        ],
      };

    default:
      return {
        lines: [
          <p key="x" className="term-err">
            command not found: {cmdRaw}. Type <b>help</b> to see what you can
            run.
          </p>,
        ],
      };
  }
}

export default function HomeTerminal() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const past = useRef([]);
  const cursor = useRef(-1);

  const welcome = useMemo(
    () => (
      <>
        <p>Welcome to my portfolio terminal.</p>
        <p className="term-muted">
          Type a command and press Enter, or tap one below. Start with{" "}
          <b>help</b>.
        </p>
      </>
    ),
    []
  );

  // Keep the newest output in view inside the terminal only (never scrolls the page).
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const submit = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    past.current.push(trimmed);
    cursor.current = past.current.length;

    if (trimmed.toLowerCase() === "clear") {
      setHistory([]);
      setValue("");
      return;
    }

    const { lines } = runCommand(trimmed, router);
    setHistory((h) => [...h, { cmd: trimmed, lines }]);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!past.current.length) return;
      cursor.current = Math.max(0, cursor.current - 1);
      setValue(past.current[cursor.current] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!past.current.length) return;
      cursor.current = Math.min(past.current.length, cursor.current + 1);
      setValue(past.current[cursor.current] ?? "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const word = value.trim().toLowerCase();
      if (!word || word.includes(" ")) return;
      const match = AUTOCOMPLETE.find((c) => c.startsWith(word));
      if (match) setValue(match);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div className="term-window" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="term-bar">
        <span className="term-dot term-dot-red" />
        <span className="term-dot term-dot-yellow" />
        <span className="term-dot term-dot-green" />
        <span className="term-title">rajkumar@portfolio: ~</span>
      </div>

      <div
        ref={bodyRef}
        className="term-body"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        <div className="term-block">{welcome}</div>

        {history.map((entry, i) => (
          <div key={i} className="term-block">
            <div className="term-line">
              <span className="term-prompt">$</span>
              <span>{entry.cmd}</span>
            </div>
            {entry.lines}
          </div>
        ))}

        <div className="term-line term-input-line">
          <span className="term-prompt" aria-hidden="true">
            $
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            className="term-input"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="type a command, e.g. about"
            aria-label="Terminal command input"
          />
        </div>
      </div>

      <div className="term-chips" onClick={(e) => e.stopPropagation()}>
        <span className="term-chips-label">Try:</span>
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            className="term-chip"
            onClick={() => {
              submit(c);
              inputRef.current?.focus({ preventScroll: true });
            }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
