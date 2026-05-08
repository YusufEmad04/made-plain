import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";

export const metadata = {
    title: "Terms of Service — Made Plain",
    description: "Terms of service for Made Plain, a product owned and operated by Simplx Tech.",
};

export default function TermsPage() {
    return (
        <>
            <SiteNav />
            <main>
                <Section tone="paper" pad="loose" width="narrow">
                    <Eyebrow prefix="§">Terms of Service</Eyebrow>
                    <h1 className="font-display text-[length:var(--text-h1)] mt-6 max-w-[20ch] text-balance">
                        The deal, in plain words
                        <DotMark size="md" />
                    </h1>

                    <p className="font-mono text-[12px] text-[var(--color-mute)] mt-6">
                        Last updated: May 2026
                    </p>

                    <div className="mt-10 space-y-8 font-serif text-[length:var(--text-body)] leading-[1.65] text-[var(--color-ink)]/90">

                        <Block heading="1. Publisher & owner">
                            <p>
                                Made Plain is a product owned and operated by{" "}
                                <SimplxLink />, a technology company. By
                                accessing or purchasing from this website, you are transacting
                                with <SimplxLink />. If you have any questions about
                                who you are transacting with, contact us at{" "}
                                <a
                                    href="mailto:busines.simplx.main@gmail.com"
                                    className="text-[var(--color-accent)] underline-offset-4 hover:underline"
                                >
                                    busines.simplx.main@gmail.com
                                </a>
                                .
                            </p>
                        </Block>

                        <Block heading="2. Acceptance of terms">
                            <p>
                                By accessing this website or completing a purchase, you agree
                                to be bound by these Terms of Service. If you do not agree,
                                please do not use this website or its products.
                            </p>
                        </Block>

                        <Block heading="3. Merchant of record &amp; payments">
                            <p>
                                <SimplxLink /> acts as the merchant of record for
                                all transactions on this website. All payments, invoices, and
                                checkout experiences are processed and managed exclusively by{" "}
                                <SimplxLink /> using their registered payment
                                gateway account. The name{" "}
                                <span className="font-mono">Simplx</span> or{" "}
                                <span className="font-mono">Simplx.tech</span> will appear on
                                your bank statement and on your receipt.
                            </p>
                            <p>
                                By completing a purchase, you authorise{" "}
                                <SimplxLink /> to charge the stated amount to
                                your provided payment method.
                            </p>
                        </Block>

                        <Block heading="4. What you get">
                            <p>
                                A licence to download, use, and adapt the kit — the templates,
                                worksheets, glossary, map, and essays — for your own ventures
                                and your client work. You can edit them. You can put them in
                                front of customers and investors.
                            </p>
                        </Block>

                        <Block heading="5. What you can't do">
                            <p>
                                Resell or republish the kit as-is. Train AI models on it.
                                Strip our credit and pass it off as your own product. Anything
                                obviously bad-faith.
                            </p>
                        </Block>

                        <Block heading="6. Updates">
                            <p>
                                When we ship updates, you get them at no cost. The kit you
                                bought is the kit you keep — even if pricing or scope changes
                                later.
                            </p>
                        </Block>

                        <Block heading="7. Intellectual property">
                            <p>
                                All content on this website — including the kit, templates,
                                essays, logos, and graphics — is the intellectual property of{" "}
                                <SimplxLink /> unless otherwise stated. You may
                                not copy, reproduce, or distribute any content without written
                                permission.
                            </p>
                        </Block>

                        <Block heading="8. No warranty">
                            <p>
                                The kit is provided &ldquo;as is.&rdquo; It&apos;s a thinking
                                tool, not financial, legal, or tax advice. Get qualified
                                advisors for those.
                            </p>
                        </Block>

                        <Block heading="9. Limitation of liability">
                            <p>
                                <SimplxLink /> is not liable for any indirect,
                                incidental, or consequential damages arising from the use of
                                this product. Liability is limited to the amount paid for the
                                specific product in question.
                            </p>
                        </Block>

                        <Block heading="10. Refunds">
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

                        <Block heading="11. Changes to these terms">
                            <p>
                                We reserve the right to update these terms at any time.
                                Continued use of this website after changes are posted
                                constitutes acceptance of the updated terms.
                            </p>
                        </Block>

                        <Block heading="12. Governing law">
                            <p>
                                These terms are governed by the laws of the jurisdiction in
                                which <SimplxLink /> is registered. If you&apos;re
                                a consumer, your local consumer protections still apply —
                                these terms don&apos;t override them.
                            </p>
                        </Block>

                        <Block heading="13. Contact">
                            <p>
                                For any questions about these terms, reach out to{" "}
                                <SimplxLink /> at{" "}
                                <a
                                    href="mailto:busines.simplx.main@gmail.com"
                                    className="text-[var(--color-accent)] underline-offset-4 hover:underline"
                                >
                                    busines.simplx.main@gmail.com
                                </a>
                                .
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
