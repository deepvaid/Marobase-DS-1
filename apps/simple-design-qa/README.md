# Simple Design QA (Chrome Extension - Manifest V3)

Minimal Chrome extension for capturing design/UX QA issues and exporting logs as ZIP.

## Files

- `manifest.json`
- `popup.html`, `popup.js`, `popup.css`
- `options.html`, `options.js`, `options.css`
- `background.js`
- `utils.js`

## Load As Unpacked Extension

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked**.
4. Select this folder: `apps/simple-design-qa`.

## How To Use

1. Open any page in your desktop web app.
2. Click the **Simple Design QA** extension icon.
3. The popup auto-fills page title and URL from the active tab.
4. Select severity (radio buttons) and feedback type, then enter feedback text.
5. (Optional) Click **Pick Area**, then click a container on the page (for example a form, table, card, or section).
6. (Optional) Click **Capture Area Screenshot**, drag on the page to select a region, then reopen popup.
7. Use **Clear Screenshot** if you want to retake it.
8. Optionally add a suggested reference URL.
9. Click **Save**.
10. Use **View Logs** to open the options page for filtering/searching/deleting entries and preview screenshot images in a modal.
11. Use **Export SDQA ZIP** to download one ZIP file:
    - `<SDQA_timestamp>.zip`
    - Inside ZIP: `sdqa-logs.csv`, `sdqa-logs.html`, `screenshots/*`
12. Use **Clear All** in the popup to remove all saved entries after confirmation.

## Data Storage

- Stored in `chrome.storage.local` under one key: `sdqa_logs`.
- Selected container names are stored per tab under `sdqa_selected_targets`.
- On first run after rename, legacy `uat_*` keys are migrated once into `sdqa_*` keys.
- Shape per entry:

```json
{
  "id": "uuid",
  "createdAt": "ISO datetime",
  "pageUrl": "string",
  "pageTitle": "string",
  "severity": "Blocker | Major | Minor",
  "feedbackType": "Table | Form | Dashboard Widget | Navigation | Content/Copy | Accessibility | Other",
  "feedback": "string",
  "containerName": "optional container selector-ish name",
  "referenceLink": "optional URL",
  "screenshotName": "optional screenshot file name",
  "screenshotDataUrl": "optional image data URL"
}
```

## Known Limitations

- Auto-fill depends on active tab metadata (`tabs` API); restricted pages (like some Chrome internal URLs) may not expose title/URL.
- Data is local to the current Chrome profile/device (not synced).
- Export downloads one ZIP file named `SDQA_YYYY-MM-DD_HH-mm-ss-SSS.zip` containing the Simple Design QA folder structure.
- Reference links can be entered without protocol (for example `example.com`); links are normalized to `http://example.com` and only `http/https` links are clickable in reports.
- Area picker uses temporary page highlighting and cannot run on restricted browser pages (`chrome://*`, extension pages, etc.).
- Screenshot capture selects from the currently visible viewport region.
- Large numbers of high-resolution screenshots can increase `chrome.storage.local` usage.

## Draft Behavior

- Unsaved popup feedback is cached when reopening the popup on the same page URL.
- Draft cache is cleared after successful **Save** or when the active page URL changes.

## How-To PDF

- Generated guide path: `docs/how-to-use/Simple-Design-QA-How-To.pdf`
- Regenerate guide (screenshots + PDF): from repo root run `pnpm sdqa:guide`
