import Link from "next/link";
import { DotMark } from "@/components/brand/dot-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-paper)] py-16">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-5 sm:grid-cols-3 sm:px-8 lg:px-12">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[15px] font-medium tracking-tight">
            <span>made&nbsp;plain</span>
            <DotMark size="sm" />
          </div>
          <p className="font-serif italic text-[14px] text-[var(--color-mute)]">
            Made plain, in 2026.
          </p>
        </div>

        <div className="space-y-3">
          <div className="eyebrow text-[var(--color-mute)]">The kit</div>
          <ul className="space-y-2 text-[14px]">
            <li>
              <Link href="/#kit" className="hover:text-[var(--color-accent)]">
                What&apos;s in it
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="hover:text-[var(--color-accent)]">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-[var(--color-accent)]">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/refunds" className="hover:text-[var(--color-accent)]">
                Refund policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="eyebrow text-[var(--color-mute)]">Free</div>
          <ul className="space-y-2 text-[14px]">
            <li>
              <Link href="/concepts" className="hover:text-[var(--color-accent)]">
                Concepts
              </Link>
            </li>
            <li>
              <Link href="/glossary" className="hover:text-[var(--color-accent)]">
                Glossary
              </Link>
            </li>
            <li>
              <Link href="/map" className="hover:text-[var(--color-accent)]">
                Connection Map
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-[var(--color-accent)]">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/newsletter" className="hover:text-[var(--color-accent)]">
                Newsletter
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1320px] flex-col gap-3 border-t border-[var(--color-line)] px-5 pt-6 text-[13px] text-[var(--color-mute)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>© 2026 Made Plain. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-[var(--color-accent)]">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[var(--color-accent)]">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-[var(--color-accent)]">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
