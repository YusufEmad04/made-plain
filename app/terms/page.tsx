import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";

export const metadata = {
  title: "Terms — Made Plain",
};

export default function TermsPage() {
  return (
    <>
      <SiteNav />
      <main>
        <Section tone="paper" pad="loose" width="narrow">
          <Eyebrow prefix="§">Terms</Eyebrow>
          <h1 className="font-display text-[length:var(--text-h1)] mt-6 max-w-[20ch] text-balance">
            The deal, in plain words
            <DotMark size="md" />
          </h1>

          <p className="font-mono text-[12px] text-[var(--color-mute)] mt-6">
            Last updated: 2026
          </p>

          <div className="mt-10 space-y-8 font-serif text-[length:var(--text-body)] leading-[1.65] text-[var(--color-ink)]/90">
            <Block heading="What you get">
              <p>
                A licence to download, use, and adapt the kit — the templates,
                worksheets, glossary, map, and essays — for your own ventures
                and your client work. You can edit them. You can put them in
                front of customers and investors.
              </p>
            </Block>

            <Block heading="What you can't do">
              <p>
                Resell or republish the kit as-is. Train AI models on it.
                Strip our credit and pass it off as your own product. Anything
                obviously bad-faith.
              </p>
            </Block>

            <Block heading="Updates">
              <p>
                When we ship updates, you get them at no cost. The kit you
                bought is the kit you keep — even if pricing or scope changes
                later.
              </p>
            </Block>

            <Block heading="No warranty">
              <p>
                The kit is provided &ldquo;as is.&rdquo; It&apos;s a thinking
                tool, not financial, legal, or tax advice. Get qualified
                advisors for those.
              </p>
            </Block>

            <Block heading="Refunds">
              <p>
                30 days, no questions. See{" "}
                <a
                  href="/refunds"
                  className="text-[var(--color-accent)] underline-offset-4 hover:underline"
                >
                  the refund policy
                </a>
                .
              </p>
            </Block>

            <Block heading="Governing law">
              <p>
                Disputes go to the courts of the publisher&apos;s registered
                jurisdiction. If you&apos;re a consumer, your local consumer
                protections still apply — these terms don&apos;t override
                them.
              </p>
            </Block>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}

function Block({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-display text-[length:var(--text-h3)]">{heading}</h2>
      {children}
    </div>
  );
}
