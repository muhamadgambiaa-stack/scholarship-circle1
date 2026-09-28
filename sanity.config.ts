import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import AnalyticsTool from "./sanity/tools/AnalyticsTool";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "the-scholarship-circle",
  title: "The Scholarship Circle",
  projectId,
  dataset,
  basePath: "/studio",
  auth: { loginMethod: "token" },
  plugins: [structureTool(), visionTool()],
  tools: [{ name: "analytics", title: "Analytics", component: AnalyticsTool }],
  schema: { types: schemaTypes },
});
