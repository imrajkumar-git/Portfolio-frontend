import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-black/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="RK logo" width={86} height={36} />
            <span className="font-display text-lg font-semibold text-white">
              Rajkumar Aryal
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            IT fresher and full-stack developer based in Abu Dhabi, building
            clean, colourful, dependable web experiences. 💻✨
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase text-emerald-400">
            Explore
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li><Link href="/about" className="hover:text-sky-400">About</Link></li>
            <li><Link href="/experience" className="hover:text-sky-400">Experience</Link></li>
            <li><Link href="/blog" className="hover:text-sky-400">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-sky-400">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase text-sky-400">
            Connect
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>
              <a href="mailto:rajkumararyal0977@gmail.com" className="hover:text-emerald-400">
                📧 rajkumararyal0977@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+9710547809320" className="hover:text-emerald-400">
                📞 +971 054 780 9320
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/rajkumar-aryal-38b43a233"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400"
              >
                🔗 LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://rajkumarayal.com.np"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400"
              >
                🌐 rajkumarayal.com.np
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase text-emerald-400">
            Based In
          </h4>
          <p className="mt-4 text-sm text-slate-300">
            Baniyas East-8, Abu Dhabi, United Arab Emirates 🇦🇪
          </p>
          <div className="mt-5 flex gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulseline" />
            <span className="text-xs text-slate-400">Available for new projects</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-lg text-slate-500">
        © {new Date().getFullYear()}All rights reserved.<a href="https://rajkumarayal.com.np" target="_blank" rel="noreferrer" className="ml-1 text-sky-400 hover:underline">rajkumarayal.com.np</a>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-sky-400 to-purple-400" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  

    
    </footer>
  );
}
