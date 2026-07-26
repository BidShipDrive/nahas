"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const { dict } = useLanguage();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/cars", label: dict.nav.cars },
    { href: "/customize", label: dict.nav.customize },
    { href: "/how-it-works", label: dict.nav.howItWorks },
    { href: "/reviews", label: dict.nav.reviews },
    { href: "/track", label: dict.nav.track },
    { href: "/contact", label: dict.nav.contact },
  ];

  return (
    <header className="bg-slate-950 text-white sticky top-0 z-40">
      {/* dir="ltr" keeps the whole top bar's layout fixed (logo left, links, switcher/menu
          right) across languages — only the text itself translates, nothing reorders. */}
      <div dir="ltr" className="relative mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-4 pr-28 sm:pr-64">
          <Link href="/" className="flex items-baseline gap-2 shrink-0">
            <span className="text-lg font-bold tracking-tight">{siteConfig.businessName}</span>
            <span className="hidden sm:inline text-xs text-blue-400">{siteConfig.shortName}</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-blue-400 transition">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 sm:gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden rounded-md border border-slate-700 px-1.5 py-1 text-xs sm:px-2.5 sm:py-1.5 sm:text-sm"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-slate-800 px-4 py-3 flex flex-col gap-3 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="hover:text-blue-400 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
