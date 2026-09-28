# Private website analytics

Open **Sanity Studio → Analytics** (`/studio/analytics`). This dashboard reads GA4 reports on the server. It does not write counters or duplicate scholarship fields in Sanity. Published titles/slugs are reused to label pages.

## What is included

- Site views, visitors (GA4 `totalUsers`), sessions and a daily chart/count table.
- Individual scholarship, blog, home, category, country and other page statistics.
- Today / 7 / 30 / 90 day and custom date ranges; type filters, title/path search, sorting, pagination and CSV export.
- Apply Now clicks, WhatsApp clicks, resolved native share requests and successful clipboard copies.
- Top 20 session source/medium combinations.
- Sanity login plus an explicit server-side administrator allowlist. An ordinary Studio login alone does not grant report access.

Public page images, design, existing sharing messages and CMS schemas are unchanged. The existing GTM container is reused. No second Google tag or page-view tracker is installed by this code.

## 1. Connect existing Google Analytics / Tag Manager

The site loads GTM container **GTM-MQL82SLQ**. Loading GTM alone does not prove that a GA4 tag is configured. Use the GA4 property that already collects this website's data, if one exists.

1. In GA4, find the web stream's **Measurement ID** (`G-...`). In Tag Manager, verify there is a single Google tag using that ID on public production pages. Do not add a duplicate if one exists.
2. In that GA4 web stream's Enhanced Measurement settings, enable page views on browser history changes. This covers Next.js client navigation. If another history/page_view tag already handles this, use only one strategy. In Tag Assistant verify exactly one page_view for an initial visit and each client navigation.
3. Restrict collection to hostname `thescholarshipcircle.com` or `www.thescholarshipcircle.com`. Exclude paths matching `^/(studio|admin|api|_next)(/|$)` from applicable GTM triggers. Keep your existing consent configuration; these events must use the same consent rules as other GA4 events.
4. Enable the built-in **Event** variable in GTM. Create two Data Layer Variables (version 2): `DLV - page_location` with name `page_location`, and `DLV - page_path` with name `page_path`.
5. Create a Custom Event trigger with **Use regex matching** enabled and this exact expression:

   ```text
   ^tsc_(apply_click|whatsapp_click|share_complete|copy_link)$
   ```

6. Create one **Google Analytics: GA4 Event** tag for the same Measurement ID. Event name: `{{Event}}`. Event parameters: `page_location` = `{{DLV - page_location}}`, `page_path` = `{{DLV - page_path}}`. Use the custom event trigger. No custom dimensions or key-event registration is needed for this dashboard.
7. Preview on the production website, click Apply and WhatsApp, complete a native share or clipboard copy, and check the corresponding events in Tag Assistant and GA4 DebugView. Publish the GTM changes once verified. The new custom events only exist once this code is deployed; previews intentionally do not collect actions.

Events are added to `window.dataLayer`; without the GA4 Event tag they will **not** appear in reports. A WhatsApp click does not prove a message was sent, an Apply click does not prove an application was submitted, and a resolved Web Share API request does not guarantee delivery. Canceled shares and unsuccessful/manual clipboard prompts are not counted as successful copies/shares.

## 2. Enable read-only reporting

1. In Google Cloud, create/select a project and enable **Google Analytics Data API**.
2. Create a dedicated service account and a JSON key. Keep the key private; do not paste it into a chat, commit it, or upload it to Sanity.
3. In GA4 → Admin → Property access management, add the service account's `client_email` with **Viewer** access to the correct property.
4. Find the numeric **Property ID** under GA4 Property details. This is different from the `G-...` Measurement ID.
5. In Vercel → Project → Settings → Environment Variables, add these server-only variables for the deployment environments you want to use:

   | Variable | Value |
   | --- | --- |
   | `GA4_PROPERTY_ID` | Numeric GA4 property ID |
   | `GA4_CLIENT_EMAIL` | `client_email` from the service-account JSON |
   | `GA4_PRIVATE_KEY` | `private_key` from the JSON; actual newlines or literal `\n` both work |
   | `ANALYTICS_ADMIN_USER_IDS` | Your Sanity user ID; comma-separated IDs for multiple approved admins |

   Existing `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` remain as configured. **Never** prefix the four new variables with `NEXT_PUBLIC_`.

6. To find your Sanity user ID, sign in, open Analytics, and read the ID in the setup error message. The Studio uses Sanity's supported token login mode so it can authenticate same-origin report requests. Existing users may need to sign out and back in once. This does not create another password or require a Sanity robot/write token.
7. Redeploy after adding/changing Vercel environment variables. Anyone not on the allowlist receives 403, and a missing allowlist disables the endpoint. No public report URLs or client-side service-account keys are used.

## 3. Verify before production

Run from the repository root (PowerShell or another terminal):

```text
npm ci
npm run test:analytics
npm run typecheck
npm run build
```

Use the GitHub feature branch / pull request for review; merge to `main` only after approving the changes. The linked Vercel project can then deploy from GitHub. A preview can validate the Studio and server reports with credentials configured for Preview, but custom action tracking only emits on the production domain.

- Signed-out `/api/admin/analytics` must return 401. A signed-in non-allowlisted user must receive 403. Test with a second account if available.
- With the approved Sanity user and GA credentials, select a date range and compare totals and a specific page to GA4 using the same property timezone and hostname/public-path filters. Use GA4 **Total users**, not **Active users**, for the visitors comparison.
- Test desktop and mobile Studio layouts, search and CSV export. Existing scholarship and article share behavior should remain intact.
- Verify events after the production release using Tag Assistant and GA4 DebugView. Then check standard reports after processing.

## Counts and limits

Dates use the GA4 property's timezone. Last 7 days includes today. Reports are cached server-side for 5 minutes only after authorization; Google processing may take 24–48 hours. This is not a live concurrent-users display. Consent, blockers and GA's measurement methods mean these are analytics estimates, not exact headcounts. Earlier views are available only if the existing property recorded them; action events cannot be backfilled.

Visitors are deduplicated by GA across the selected site/date range. They are never calculated by summing page visitors. Site summary cards stay site-wide when searching/filtering the page table. Pages without recorded activity do not appear. Query strings are excluded from per-page grouping. Page/action tables are capped at 10,000 rows each with a visible warning if exceeded; action cards then reflect those returned rows. Traffic sources show the top 20 only. Thresholding, sampling and high-cardinality grouping are surfaced when Google reports them.

The report endpoint fetches only public paths on the two production hostnames. Service-account authorization remains server-side, request tokens are not logged, reports are marked private/no-store, and each request verifies the current Sanity identity before accessing cached data. The in-memory cache and concurrent-load cap are per server instance, not a global rate limiter.

## References

- [GA4 Data API setup](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart)
- [Data API dimensions and metrics](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
- [Tag Manager data layer](https://developers.google.com/tag-platform/tag-manager/datalayer)
- [Single-page application measurement](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications)
- [GA4 data freshness](https://support.google.com/analytics/answer/11198161)
- [Sanity authentication options](https://www.sanity.io/docs/studio/custom-auth)

## Rollback

Revert the analytics pull-request commit and redeploy through GitHub/Vercel. Remove/disable the custom GA4 event tag if no longer needed. Existing GA4 history is unaffected. No Sanity document migration or data deletion is required.
