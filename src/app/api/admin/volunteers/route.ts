import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/volunteer/admin-auth";
import { SITE_URL } from "@/lib/volunteer/config";
import { sendAccountSuspended, sendVolunteerInvite } from "@/lib/volunteer/mail";
import {
  EMAIL_RE,
  createLinkToken,
  deleteVolunteer,
  getVolunteer,
  listVolunteers,
  normEmail,
  saveVolunteer,
} from "@/lib/volunteer/store";

const json = (data: Record<string, unknown>, status = 200) => NextResponse.json(data, { status });

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const volunteers = (await listVolunteers()).map(({ passwordHash, ...safe }) => ({
      ...safe,
      hasPassword: !!passwordHash,
    }));
    return json({ success: true, volunteers });
  } catch (error) {
    console.error("List volunteers error", error);
    return json({ success: false, message: error instanceof Error ? error.message : "Could not load volunteers." }, 500);
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => ({}));
    const action = String(body?.action || "");
    const email = normEmail(String(body?.email || ""));
    if (!EMAIL_RE.test(email)) return json({ success: false, message: "Valid email required." }, 400);

    const existing = await getVolunteer(email);

    if (action === "invite") {
      const name = String(body?.name || "").trim().slice(0, 100);
      if (!name) return json({ success: false, message: "Name is required." }, 400);
      if (existing?.status === "active") return json({ success: false, message: "This person already has an active account." }, 409);
      if (existing?.status === "suspended") return json({ success: false, message: "This account is suspended. Reactivate it first." }, 409);

      const volunteer = existing ?? {
        id: randomUUID(),
        email,
        name,
        status: "invited" as const,
        createdAt: new Date().toISOString(),
      };
      await saveVolunteer(volunteer);

      const token = await createLinkToken(email);
      try {
        await sendVolunteerInvite(email, volunteer.name, `${SITE_URL}/volunteer/setup?token=${token}`);
      } catch (e) {
        console.error("Invite email failed", e);
        return json({ success: false, message: `Account created but the email failed: ${e instanceof Error ? e.message : "unknown error"}. Press Invite again to retry.` }, 502);
      }
      return json({ success: true, message: `Invitation sent to ${email}.` });
    }

    if (!existing) return json({ success: false, message: "No volunteer account with that email." }, 404);

    if (action === "suspend") {
      const reason = String(body?.reason || "").trim().slice(0, 500);
      if (!reason) return json({ success: false, message: "A reason is required." }, 400);
      existing.status = "suspended";
      existing.suspendedReason = reason;
      existing.suspendedAt = new Date().toISOString();
      await saveVolunteer(existing);

      let note = "";
      if (body?.notify) {
        try {
          await sendAccountSuspended(existing.email, existing.name, reason);
        } catch (e) {
          console.error("Suspension email failed", e);
          note = " (the notice email could not be sent)";
        }
      }
      return json({ success: true, message: `${email} is suspended and logged out immediately${note}.` });
    }

    if (action === "reactivate") {
      existing.status = existing.passwordHash ? "active" : "invited";
      delete existing.suspendedReason;
      delete existing.suspendedAt;
      await saveVolunteer(existing);
      return json({ success: true, message: `${email} is reactivated.` });
    }

    if (action === "delete") {
      await deleteVolunteer(email);
      return json({ success: true, message: `${email} was deleted.` });
    }

    return json({ success: false, message: "Unknown action." }, 400);
  } catch (error) {
    console.error("Admin volunteers error", error);
    return json({ success: false, message: error instanceof Error ? error.message : "Request failed." }, 500);
  }
}
