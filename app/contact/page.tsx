import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";

export const metadata = {
  title: "Contact — Made Plain",
  description: "One inbox. Replied to by the editor.",
};

export default function ContactPage() {
  return (
    <>
      <SiteNav />
      <main>
        <Section tone="paper" pad="loose" width="narrow">
          <Eyebrow prefix="§">Contact</Eyebrow>
          <h1 className="font-display text-[length:var(--text-display)] mt-6 max-w-[18ch] text-balance">
            One inbox. The editor reads it
            <DotMark size="md" />
          </h1>

          <p className="font-serif italic text-[length:var(--text-lead)] text-[var(--color-mute)] mt-6 max-w-[52ch]">
            Refunds, missing kit access, broken links, ideas for the next
            edition, press — all the same address. We aim to reply within 2
            business days.
          </p>

          <div className="mt-12 rounded-md border border-[var(--color-line)] bg-[var(--color-card-brand)] p-8 space-y-4">
            <p className="eyebrow text-[var(--color-mute)]">Email</p>
            <a
              href="mailto:hello@madeplain.co"
              className="font-display text-[length:var(--text-h2)] text-[var(--color-accent)] underline-offset-4 hover:underline"
            >
              hello@madeplain.co
            </a>
            <p className="font-serif italic text-[14px] text-[var(--color-mute)] pt-2">
              For account/login issues: include the email you used at
              checkout. For refunds: include your order ID from the receipt.
            </p>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
