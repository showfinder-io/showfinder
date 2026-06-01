// Helper d'envoi d'emails transactionnels via Brevo.
// Usage côté server-only : route handlers, server actions. Jamais côté client (clé API).

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? "hello@agoris.io";
const BREVO_FROM_NAME = "Agoris";

type SendEmailParams = {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: string;
};

function toRecipients(value: string | string[] | undefined): Array<{ email: string }> | undefined {
  if (!value) return undefined;
  const list = Array.isArray(value) ? value : [value];
  const cleaned = list.map((e) => e.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned.map((email) => ({ email })) : undefined;
}

export async function sendTransactionalEmail({
  to,
  cc,
  subject,
  htmlContent,
  textContent,
  replyTo,
}: SendEmailParams): Promise<void> {
  if (!BREVO_API_KEY) {
    console.warn("[brevo] BREVO_API_KEY non définie, email ignoré");
    return;
  }

  const toList = toRecipients(to);
  if (!toList) {
    console.warn("[brevo] aucun destinataire valide, email ignoré");
    return;
  }
  const ccList = toRecipients(cc);

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: BREVO_FROM_EMAIL, name: BREVO_FROM_NAME },
      to: toList,
      ...(ccList ? { cc: ccList } : {}),
      subject,
      htmlContent,
      ...(textContent ? { textContent } : {}),
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo API ${res.status}: ${body}`);
  }
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
