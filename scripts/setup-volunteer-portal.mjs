// Run once from the project root:  node scripts/setup-volunteer-portal.mjs
import fs from "node:fs";

// 1) The first version of the portal used a custom "volunteerSubmission" type.
//    Submissions now become real scholarship / post drafts, so that type is removed.
const indexPath = "sanity/schemaTypes/index.ts";
if (fs.existsSync(indexPath)) {
  const before = fs.readFileSync(indexPath, "utf8");
  const after = before
    .split("\n")
    .filter((l) => !l.includes("volunteerSubmission"))
    .join("\n");
  if (after !== before) {
    fs.writeFileSync(indexPath, after);
    console.log("- removed old volunteerSubmission from sanity/schemaTypes/index.ts");
  } else {
    console.log("= schema index already clean");
  }
}
const oldSchema = "sanity/schemaTypes/volunteerSubmission.ts";
if (fs.existsSync(oldSchema)) {
  fs.rmSync(oldSchema);
  console.log("- deleted " + oldSchema);
}

// 2) Document the environment variables
const envPath = ".env.example";
const add = `
# Volunteer portal
VOLUNTEER_SESSION_SECRET=
ADMIN_KEY=
# Optional: defaults to no-reply@<domain of RESEND_FROM_EMAIL>
RESEND_NOREPLY_EMAIL=
# Added automatically when you connect Upstash Redis in Vercel > Storage
KV_REST_API_URL=
KV_REST_API_TOKEN=
`;
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
if (!env.includes("VOLUNTEER_SESSION_SECRET")) {
  fs.writeFileSync(envPath, env.replace(/\s*$/, "\n") + add);
  console.log("+ added variables to .env.example");
}
console.log("\nDone.");
