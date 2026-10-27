import "server-only";
import { Resend } from "resend";
import { SITE_NAME, SITE_URL } from "./config";

const DEFAULT_FROM = "newsletter@updates.thescholarshipcircle.com";

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Uses the same verified domain as your existing RESEND_FROM_EMAIL, with a no-reply mailbox name. */
export function noReplyAddress() {
  if (process.env.RESEND_NOREPLY_EMAIL) return process.env.RESEND_NOREPLY_EMAIL;
  const m = (process.env.RESEND_FROM_EMAIL || DEFAULT_FROM).match(/@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/);
  return `no-reply@${m ? m[1] : "updates.thescholarshipcircle.com"}`;
}

interface Mail {
  to: string;
  subject: string;
  heading: string;
  paragraphs: string[];
  button?: { label: string; url: string };
}

const NOTICE = `Please do not reply to this email. This mailbox is not monitored. If you need help, contact us at ${SITE_URL}/contact`;

export async function sendNoReply({ to, subject, heading, paragraphs, button }: Mail) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set.");

  const body = paragraphs
    .map((p) => `<p style="margin:0 0 14px;line-height:1.6">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
  const btn = button
    ? `<p style="margin:22px 0"><a href="${escapeHtml(button.url)}" style="background:#1e3a8a;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;display:inline-block">${escapeHtml(button.label)}</a></p>
       <p style="margin:0 0 14px;font-size:13px;color:#555">If the button does not work, copy this link into your browser:<br>${escapeHtml(button.url)}</p>`
    : "";

  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1a1a1a">
    <h2 style="margin:0 0 16px">${escapeHtml(heading)}</h2>${body}${btn}
    <hr style="border:none;border-top:1px solid #ddd;margin:24px 0">
    <p style="font-size:12px;color:#777;margin:0"><strong>Do not reply to this email.</strong> This is an automated message from ${SITE_NAME} and replies are not monitored. Need help? <a href="${SITE_URL}/contact">Contact us</a>.</p>
  </div>`;

  const text = [heading, "", ...paragraphs, ...(button ? ["", `${button.label}: ${button.url}`] : []), "", "--", NOTICE].join("\n");

  const resend = new Resend(key);
  // Resend returns { error } instead of throwing, so it must be checked explicitly.
  const { error } = await resend.emails.send({
    from: `${SITE_NAME} <${noReplyAddress()}>`,
    to: [to],
    subject: subject.replace(/[\r\n]+/g, " ").trim(),
    html,
    text,
    headers: { "Auto-Submitted": "auto-generated" },
  });
  if (error) throw new Error(error.message || "Resend rejected the email.");
}

export const sendVolunteerInvite = (to: string, name: string, url: string) =>
  sendNoReply({
    to,
    subject: `You're invited to volunteer with ${SITE_NAME}`,
    heading: "Welcome to the volunteer team",
    paragraphs: [
      `Hello ${name},`,
      `Thank you for applying to volunteer with ${SITE_NAME}. Your application has been approved and your volunteer account is ready.`,
      "Use the button below to choose your password. The link works once and expires in 48 hours.",
    ],
    button: { label: "Set up my account", url },
  });

export const sendPasswordReset = (to: string, name: string, url: string) =>
  sendNoReply({
    to,
    subject: `Reset your ${SITE_NAME} volunteer password`,
    heading: "Reset your password",
    paragraphs: [
      `Hello ${name},`,
      "We received a request to reset your volunteer account password. The link works once and expires in 48 hours.",
      "If you did not ask for this, you can ignore this email.",
    ],
    button: { label: "Choose a new password", url },
  });

export const sendAccountSuspended = (to: string, name: string, reason: string) =>
  sendNoReply({
    to,
    subject: `Your ${SITE_NAME} volunteer account has been suspended`,
    heading: "Account suspended",
    paragraphs: [
      `Hello ${name},`,
      "Your volunteer account has been suspended because of a breach of our volunteer rules.",
      `Reason: ${reason}`,
      "If you believe this is a mistake, please use the contact page on our website.",
    ],
  });

export const sendApplicationReceived = (to: string, name: string, kind: "volunteer" | "partnership") =>
  sendNoReply({
    to,
    subject: `We received your ${kind} application`,
    heading: "Application received",
    paragraphs: [
      `Hello ${name},`,
      `Thank you for your ${kind} application to ${SITE_NAME}. Our team will review it and contact you by email.`,
    ],
  });

export const sendApplicantMessage = (to: string, subject: string, message: string) =>
  sendNoReply({ to, subject, heading: subject, paragraphs: message.split(/\n{2,}/) });
