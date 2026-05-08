"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Sticky CTA bar. Mounts after the user scrolls past the hero
 * (~viewport height) and hides itself again once the pricing
 * section enters view.
 */
export function StickyCtaBar() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function onScroll() {
            const y = window.scrollY;
            const pricing = document.getElementById("pricing");
            const pricingTop = pricing
                ? pricing.getBoundingClientRect().top + window.scrollY
                : Infinity;
            const past = y > window.innerHeight * 0.9;
            const beforePricing = y + window.innerHeight < pricingTop + 200;
            setVisible(past && beforePricing);
        }
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div
            aria-hidden={!visible}
            className={`fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"
                }`}
        >
            <div className="border-t border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-paper)_94%,transparent)] backdrop-blur-md">
                <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
                    <div className="hidden sm:flex items-center gap-3">
                        <span className="size-2 rounded-full bg-[var(--color-accent)] animate-pulse-dot" />
                        <p className="font-serif italic text-[14px] text-[var(--color-mute)]">
                            One kit. Pay once. 30-day refund.
                        </p>
                    </div>
                    <Link
                        href="/#pricing"
                        className="ml-auto inline-flex items-center justify-center h-11 px-5 text-[14px] font-semibold rounded-md bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 transition-colors"
                    >
                        Get the kit — $19
                    </Link>
                </div>
            </div>
        </div>
    );
}
