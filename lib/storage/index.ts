/**
 * Storage adapter.
 *
 * - If `S3_BUCKET` and AWS creds are configured: returns a real
 *   S3 presigned GET URL (15 min TTL).
 * - Otherwise: returns a same-origin URL pointing at the mock
 *   download route, which serves a placeholder text file. This
 *   lets the buyer flow be exercised end-to-end without S3.
 */
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const SIGNED_URL_TTL_SECONDS = 60 * 15;

export type DownloadGrant = {
    url: string;
    expiresAt: number;
};

const BUCKET = process.env.S3_BUCKET;
const REGION = process.env.AWS_REGION ?? "us-east-1";

let s3: S3Client | null = null;
function client(): S3Client | null {
    if (!BUCKET) return null;
    if (!s3) s3 = new S3Client({ region: REGION });
    return s3;
}

export async function getDownloadUrl(
    storageKey: string
): Promise<DownloadGrant> {
    const expiresAt = Date.now() + SIGNED_URL_TTL_SECONDS * 1000;
    const c = client();
    if (!c || !BUCKET) {
        return {
            url: `/api/mock-download?key=${encodeURIComponent(
                storageKey
            )}&exp=${expiresAt}`,
            expiresAt,
        };
    }
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: storageKey });
    const url = await getSignedUrl(c, cmd, {
        expiresIn: SIGNED_URL_TTL_SECONDS,
    });
    return { url, expiresAt };
}

/** Whether the storage adapter is in mock mode. */
export function isMockStorage(): boolean {
    return !BUCKET;
}
