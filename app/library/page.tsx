import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowDownRight,
  SignOut,
} from "@phosphor-icons/react/dist/ssr";

import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Section } from "@/components/brand/section";
import { Eyebrow } from "@/components/brand/eyebrow";
import { DotMark } from "@/components/brand/dot-mark";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { KIT_ARTIFACTS } from "@/lib/content/kit";
import { getDownloadUrl } from "@/lib/storage";

export const metadata = {
  title: "Library — Made Plain",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const user = await db.users.findByEmail(session.email);
  const ownsKit = user?.ownsKit ?? false;

  return (
    <>
      <SiteNav />
      <main>
        <Section tone="paper" pad="default" width="default">
          <div className="flex items-start justify-between gap-6">
            <div>
              <Eyebrow prefix="§">Your library</Eyebrow>
              <h1 className="font-display text-[length:var(--text-h1)] mt-4 max-w-[18ch]">
                Welcome back<DotMark size="md" />
              </h1>
              <p className="font-serif italic text-[var(--color-mute)] mt-3">
                Signed in as <strong>{session.email}</strong>
              </p>
            </div>

            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-[14px] text-[var(--color-mute)] hover:text-[var(--color-accent)]"
              >
                <SignOut weight="bold" className="size-4" />
                Sign out
              </button>
            </form>
          </div>

          {!ownsKit ? (
            <div className="mt-12 rounded-md border border-dashed border-[var(--color-line)] bg-[var(--color-sand)] p-8">
              <h2 className="font-display text-[length:var(--text-h2)] max-w-[24ch]">
                You don&apos;t own the kit yet.
              </h2>
              <p className="font-serif text-[length:var(--text-body)] mt-3 text-[var(--color-mute)] max-w-[60ch]">
                The library opens once you have the kit. The Operator Notes
                newsletter is on the way regardless.
              </p>
              <Link
                href="/#pricing"
                className="mt-6 inline-flex items-center justify-center h-11 px-5 text-[14px] font-semibold rounded-md bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90"
              >
                Get the kit — $19
              </Link>
            </div>
          ) : (
            <div className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(
                  await Promise.all(
                    KIT_ARTIFACTS.map(async (a) => ({
                      a,
                      grant: await getDownloadUrl(a.storageKey),
                    }))
                  )
                ).map(({ a, grant }) => {
                  return (
                    <a
                      key={a.slug}
                      href={grant.url}
                      className="group flex items-start justify-between gap-6 rounded-md border border-[var(--color-line)] bg-[var(--color-card-brand)] p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="space-y-1">
                        <h3 className="font-display text-[length:var(--text-h3)]">
                          {a.name}
                        </h3>
                        <p className="font-serif text-[14px] text-[var(--color-ink)]/80">
                          {a.description}
                        </p>
                        <p className="font-mono text-[12px] tabular-nums text-[var(--color-mute)] pt-2">
                          {a.spec}
                        </p>
                      </div>
                      <ArrowDownRight
                        weight="bold"
                        className="size-5 shrink-0 text-[var(--color-accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  );
                })}
              </div>

              <div className="mt-10 font-serif italic text-[13px] text-[var(--color-mute)]">
                Download links rotate every 15 minutes for security. Re-open
                this page to refresh them.
              </div>
            </div>
          )}
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
