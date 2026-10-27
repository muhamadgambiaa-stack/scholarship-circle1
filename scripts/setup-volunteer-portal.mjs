// Run once from the project root:  node scripts/setup-volunteer-portal.mjs
import fs from "node:fs";

// 1) Register the new Sanity schema type
const indexPath = "sanity/schemaTypes/index.ts";
if (!fs.existsSync(indexPath)) {
  console.log(`! ${indexPath} not found. Add volunteerSubmission to your schema list manually.`);
} else {
  let s = fs.readFileSync(indexPath, "utf8");
  if (s.includes("volunteerSubmission")) {
    console.log("= schema already registered");
  } else {
    const lines = s.split("\n");
    let lastImport = -1;
    lines.forEach((l, i) => { if (/^import\s/.test(l)) lastImport = i; });
    if (lastImport >= 0) lines.splice(lastImport + 1, 0, 'import volunteerSubmission from "./volunteerSubmission";');
    s = lines.join("\n");

    const start = s.indexOf("schemaTypes");
    const close = start >= 0 ? s.indexOf("];", start) : -1;
    if (close < 0) {
      console.log('! Could not find the schemaTypes array. Add "volunteerSubmission," to it manually.');
    } else {
      const before = s.slice(0, close).replace(/\s*$/, "");
      const comma = before.endsWith(",") || before.endsWith("[") ? "" : ",";
      s = `${before}${comma}\n  volunteerSubmission,\n${s.slice(close)}`;
      fs.writeFileSync(indexPath, s);
      console.log("+ registered volunteerSubmission in sanity/schemaTypes/index.ts");
    }
  }
}

// 2) Document the new environment variables
const envPath = ".env.example";
const add = `
# Volunteer portal
VOLUNTEER_SESSION_SECRET=
ADMIN_KEY=
# Optional: defaults to no-reply@<domain of RESEND_FROM_EMAIL>
RESEND_NOREPLY_EMAIL=
# Added automatically when you connect Upstash Redis in Vercel > Storage
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
`;
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
if (!env.includes("VOLUNTEER_SESSION_SECRET")) {
  fs.writeFileSync(envPath, env.replace(/\s*$/, "\n") + add);
  console.log("+ added variables to .env.example");
}

console.log("\nDone. Next: add the environment variables to .env.local and Vercel (see instructions).");
