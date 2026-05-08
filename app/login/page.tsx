import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";
import { LoginForm } from "@/components/marketing/login-form";

export const metadata = {
    title: "Sign in — Made Plain",
    robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
    expired: "That link expired or was already used. Send a fresh one.",
    missing: "No token in that link. Send a fresh one.",
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { error } = await searchParams;
    const message = error ? ERRORS[error] : null;

    return (
        <>
            <SiteNav />
            <main>
                <Section tone="paper" pad="loose" width="narrow">
                    <Eyebrow prefix="§">Sign in</Eyebrow>
                    <h1 className="font-display text-[length:var(--text-h1)] mt-6 max-w-[18ch] text-balance">
                        One link. No passwords.
                        <DotMark size="md" />
                    </h1>

                    <p className="font-serif italic text-[length:var(--text-lead)] text-[var(--color-mute)] mt-6 max-w-[48ch]">
                        We&apos;ll email you a one-time sign-in link. Use it to open your
                        library and download your kit.
                    </p>

                    {message && (
                        <div className="mt-6 rounded-md border border-[var(--color-neg)]/40 bg-[var(--color-sand)] p-4 font-serif italic text-[14px] text-[var(--color-neg)]">
                            {message}
                        </div>
                    )}

                    <div className="mt-10 max-w-[420px]">
                        <LoginForm />
                    </div>
                </Section>
            </main>
            <SiteFooter />
        </>
    );
}
