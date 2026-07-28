import { format, formatDistanceToNowStrict, isPast } from "date-fns";

export function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    return format(new Date(dateStr), "MMMM d, yyyy");
  } catch {
    return "";
  }
}

export function deadlineStatus(dateStr?: string) {
  if (!dateStr) return { label: "Rolling / Not specified", closed: false };
  const date = new Date(dateStr);
  if (isPast(date)) return { label: "Closed", closed: true };
  return { label: `Closes in ${formatDistanceToNowStrict(date)}`, closed: false };
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
