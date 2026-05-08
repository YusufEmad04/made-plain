/**
 * Email adapter.
 *
 * - If `RESEND_API_KEY` is set: send via Resend.
 * - Otherwise: log to the server console (useful for local dev so
 *   magic links are visible without configuring SMTP).
 */
import { Resend } from "resend";

export type EmailMessage = {
    to: string;
    subject: string;
    text: string;
    /** Optional HTML body. */
    html?: string;
};

const FROM = process.env.EMAIL_FROM ?? "Made Plain <hello@madeplain.co>";
const API_KEY = process.env.RESEND_API_KEY;

let client: Resend | null = null;
function resend(): Resend | null {
    if (!API_KEY) return null;
    if (!client) client = new Resend(API_KEY);
    return client;
}

export async function sendEmail(msg: EmailMessage): Promise<void> {
    const r = resend();
    if (!r) {
        // Dev fallback: log to console so magic links are usable
        // without configuring an email provider.
        // eslint-disable-next-line no-console
        console.log("\n[email]", "to:", msg.to, "subject:", msg.subject);
        // eslint-disable-next-line no-console
        console.log(msg.text, "\n");
        return;
    }

    const { error } = await r.emails.send({
        from: FROM,
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
    });
    if (error) {
        throw new Error(`[email] Resend error: ${error.message ?? "unknown"}`);
    }
}
