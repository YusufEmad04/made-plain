import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";

export const metadata = {
    title: "Privacy Policy — Made Plain",
    description: "Privacy policy for Made Plain, a product owned and operated by Simplx Tech.",
};

export default function PrivacyPage() {
    return (
        <>
            <SiteNav />
            <main>
                <Section tone="paper" pad="loose" width="narrow">
                    <Eyebrow prefix="§">Privacy Policy</Eyebrow>
                    <h1 className="font-display text-[length:var(--text-h1)] mt-6 max-w-[20ch] text-balance">
                        What we keep. What we don&apos;t
                        <DotMark size="md" />
                    </h1>

                    <p className="font-mono text-[12px] text-[var(--color-mute)] mt-6">
                        Last updated: May 2026
                    </p>

                    <div className="mt-10 space-y-8 font-serif text-[length:var(--text-body)] leading-[1.65] text-[var(--color-ink)]/90">
                        <Block heading="What we collect">
                            <p>
                                Your email address (so we can send the kit, the receipt, and
                                the optional weekly newsletter). Your name (for the receipt).
                                Your IP and rough geolocation, kept by our hosting providers
                                in standard request logs. Aggregate, anonymous traffic data.
                            </p>
                        </Block>

                        <Block heading="Who operates this site">
                            <p>
                                This website is owned and operated by{" "}
                                <SimplxLink />. By using this site, you are
                                interacting with <SimplxLink /> as the data
                                controller.
                            </p>
                        </Block>

                        <Block heading="What we don't collect">
                            <p>
                                Your card details. We never see them — payments are processed
                                entirely by <SimplxLink /> through their
                                registered payment gateway. We don&apos;t use behavioural
                                advertising trackers. We don&apos;t fingerprint you across
                                sites.
                            </p>
                        </Block>

                        <Block heading="What we send">
                            <p>
                                Order receipts. Sign-in links you ask for. Product updates to
                                the kit (1–4 a year). The weekly Operator Notes newsletter, if
                                you opt in. One-click unsubscribe everywhere except the
                                receipt and sign-in link, which are required to operate the
                                product.
                            </p>
                        </Block>

                        <Block heading="What you can ask for">
                            <p>
                                Export of your data. Deletion of your account and all
                                associated data. A copy of any specific record. Email{" "}
                                <a
                                    href="mailto:busines.simplx.main@gmail.com"
                                    className="text-[var(--color-accent)] underline-offset-4 hover:underline"
                                >
                                    busines.simplx.main@gmail.com
                                </a>{" "}
                                — we reply within 5 business days.
                            </p>
                        </Block>

                        <Block heading="Where the data lives">
                            <p>
                                Hosted with Vercel (US/EU edge). Email delivery via our
                                transactional email provider. Storage with AWS S3.
                                International transfers covered by Standard Contractual
                                Clauses where applicable.
                            </p>
                        </Block>
                    </div>
                </Section>
            </main>
            <SiteFooter />
        </>
    );
}

function SimplxLink() {
    return (
        <a
            href="https://www.simplx.tech/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[var(--color-accent)] underline-offset-4 hover:underline"
        >
            Simplx.tech
        </a>
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
