import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8 lg:px-14">
        <a href="/" className="flex items-center gap-2.5" aria-label="Cinch home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-sm">
            <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" aria-hidden="true">
              <path d="M23.5 9.5c-2-1.7-4.2-2.5-6.9-2.5-5.2 0-8.9 3.6-8.9 9s3.7 9 8.9 9c2.7 0 4.9-.8 6.9-2.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M20.8 8.5 23.5 9.5l-1 2.8M20.8 23.5l2.7-1-1-2.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.5 12.2h3.2l1.5 2.2 1.6-2.2 1.6 2.2 1.6-2.2" stroke="white" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" opacity=".82" />
              <circle cx="23.8" cy="9.5" r="1" fill="#fb923c" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">Cinch</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          <a href="#how-it-works" className="text-sm text-white/60 transition-colors hover:text-white">How it works</a>
          <a href="#app" className="text-sm text-white/60 transition-colors hover:text-white">Proofs</a>
          <a href="#privacy" className="text-sm text-white/60 transition-colors hover:text-white">Privacy</a>
        </nav>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/40">Midnight Preprod</span>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-14">{children}</main>
    </div>
  );
}
