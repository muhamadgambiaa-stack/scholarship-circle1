import "server-only";
import { sendApplicationReceived } from "./mail";
import { clientIp, normEmail, rlBlocked, rlHit } from "./store";

/**
 * Sends the "application received" email. It never throws and never blocks the application
 * from being saved. Limits stop the public form from being used to mail-bomb someone:
 * 5 receipts per IP per hour and 2 per address per day.
 */
export async function sendReceipt(request: Request, to: string, name: string, kind: "volunteer" | "partnership") {
  try {
    const ipKey = `receipt-ip:${clientIp(request)}`;
    const emailKey = `receipt-email:${normEmail(to)}`;
    if ((await rlBlocked(ipKey, 5)) || (await rlBlocked(emailKey, 2))) return;
    await rlHit(ipKey, 3600);
    await rlHit(emailKey, 86400);
    await sendApplicationReceived(to, name, kind);
  } catch (error) {
    console.error("Application receipt email failed", error instanceof Error ? error.message : error);
  }
}
