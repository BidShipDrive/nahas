export function SocialButton({
  href,
  label,
  icon,
  className = "",
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white transition ${className}`}
    >
      {icon}
    </a>
  );
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
      <path d="M16.5 2h-3v13.6a2.6 2.6 0 1 1-2.1-2.55v-3.13a5.6 5.6 0 1 0 5.1 5.58V9.02a7.1 7.1 0 0 0 4.1 1.3V7.25a4.1 4.1 0 0 1-4.1-4.1V2Z" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
      <path d="M13.5 21v-7.5h2.52l.38-3H13.5V8.49c0-.87.24-1.46 1.5-1.46h1.6V4.35c-.28-.04-1.23-.12-2.34-.12-2.32 0-3.91 1.42-3.91 4.02v2.25H8.32v3H10.35V21h3.15Z" />
    </svg>
  );
}
