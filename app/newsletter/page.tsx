import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

export const metadata = {
  title: "Newsletter — Made Plain",
  description: "Weekly Sunday note. Free, forever.",
};

export default function NewsletterPage() {
  return (
    <>
      <SiteNav />
      <main>
        <Section tone="sand" pad="loose" width="narrow">
          <div className="text-center space-y-8">
            <Eyebrow prefix="§">Newsletter</Eyebrow>
            <h1 className="font-display text-[length:var(--text-display)] text-balance max-w-[16ch] mx-auto">
              The Sunday note
              <DotMark size="md" />
            </h1>
            <p className="font-serif italic text-[length:var(--text-lead)] text-[var(--color-ink)]/85 max-w-[44ch] mx-auto">
              ~600 words, every Sunday. Free, forever. No upsells in the body.
            </p>
            <div className="max-w-[420px] mx-auto pt-4">
              <NewsletterForm cta="Send me the weekly note" />
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
