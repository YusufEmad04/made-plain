import Link from "next/link";

const NAV = [
    { label: "The kit", href: "/#kit" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Concepts", href: "/concepts" },
    { label: "Glossary", href: "/glossary" },
    { label: "Map", href: "/map" },
    { label: "Blog", href: "/blog" },
];

export function SiteNav() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-paper)_92%,transparent)] backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-12">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-[22px] font-medium tracking-tight"
                >
                    <span>made&nbsp;</span><span style={{ color: "var(--color-accent)", fontWeight: 700 }}>plain.</span>
                </Link>

                <nav className="hidden md:flex items-center gap-7">
                    {NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-[14px] text-[var(--color-mute)] transition-colors duration-150 hover:text-[var(--color-ink)]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <Link
                    href="/#pricing"
                    className="text-[14px] font-medium text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                >
                    Get the kit&nbsp;→
                </Link>
            </div>
        </header>
    );
}
