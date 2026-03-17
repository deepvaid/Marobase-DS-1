import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, createReadStream, mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const extensionDir = path.resolve(__dirname, "..");
const docsDir = path.join(extensionDir, "docs", "how-to-use");
const imagesDir = path.join(docsDir, "images");
const pdfPath = path.join(docsDir, "Simple-Design-QA-How-To.pdf");

mkdirSync(imagesDir, { recursive: true });

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf"
};

function serveStaticFile(req, res) {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const relativePath = urlPath === "/" ? "/popup.html" : urlPath;
  const safePath = path.normalize(relativePath).replace(/^\.{1,2}(\/|\\)/g, "");
  const filePath = path.join(extensionDir, safePath);

  if (!filePath.startsWith(extensionDir) || !existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });
  createReadStream(filePath).pipe(res);
}

function startServer() {
  const server = http.createServer(serveStaticFile);
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, port: address.port });
    });
  });
}

const sampleLogs = [
  {
    id: "demo-1",
    createdAt: "2026-02-16T17:00:00.000Z",
    pageUrl: "https://app.simpledesign.local/dashboard",
    pageTitle: "Campaign Dashboard",
    severity: "Major",
    feedbackType: "Dashboard Widget",
    feedback: "Revenue widget title overlaps value on smaller desktop widths.",
    containerName: "section#campaign-grid .widget-card",
    referenceLink: "simpledesignqa.com/guidelines",
    screenshotName: "screenshot_1.png",
    screenshotDataUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO4BfQAAAABJRU5ErkJggg=="
  },
  {
    id: "demo-2",
    createdAt: "2026-02-16T17:03:00.000Z",
    pageUrl: "https://app.simpledesign.local/contacts",
    pageTitle: "Contacts",
    severity: "Minor",
    feedbackType: "Table",
    feedback: "Header sort icon contrast is low against sticky header background.",
    containerName: "table.contacts-grid",
    referenceLink: "https://example.com/accessibility/contrast"
  }
];

async function createMockedPage(browser, selectedContainerName = "") {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.addInitScript(
    ({ logs, containerName }) => {
      const store = {
        sdqa_logs: logs,
        sdqa_selected_targets: { "321": containerName }
      };

      window.chrome = {
        storage: {
          local: {
            get(keys, callback) {
              const result = {};
              if (Array.isArray(keys)) {
                keys.forEach((key) => {
                  result[key] = store[key];
                });
              } else if (typeof keys === "string") {
                result[keys] = store[keys];
              } else if (keys && typeof keys === "object") {
                Object.keys(keys).forEach((key) => {
                  result[key] = store[key] ?? keys[key];
                });
              } else {
                Object.assign(result, store);
              }
              callback(result);
            },
            set(data, callback) {
              Object.assign(store, data);
              if (typeof callback === "function") {
                callback();
              }
            }
          }
        },
        tabs: {
          query(_queryInfo, callback) {
            callback([
              {
                id: 321,
                title: "Campaign Dashboard",
                url: "https://app.simpledesign.local/dashboard"
              }
            ]);
          }
        },
        runtime: {
          lastError: null,
          openOptionsPage() {},
          sendMessage(message, callback) {
            if (message && message.type === "CAPTURE_AREA") {
              callback({
                ok: true,
                screenshotDataUrl:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO4BfQAAAABJRU5ErkJggg==",
                screenshotName: "screenshot_mock.png"
              });
              return;
            }
            callback({ ok: true });
          }
        },
        scripting: {
          async executeScript() {
            return [];
          }
        },
        downloads: {
          download(_options, callback) {
            if (typeof callback === "function") {
              callback(1);
            }
          }
        }
      };

      window.confirm = () => true;
    },
    { logs: sampleLogs, containerName: selectedContainerName }
  );
  return page;
}

async function main() {
  const { server, port } = await startServer();
  const baseUrl = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ headless: true });

  try {
    const popupPage = await createMockedPage(browser);
    await popupPage.goto(`${baseUrl}/popup.html`, { waitUntil: "networkidle" });
    await popupPage.check('input[name="severity"][value="Major"]');
    await popupPage.selectOption("#feedbackType", "Dashboard Widget");
    await popupPage.fill("#feedback", "CTA button alignment is inconsistent in dashboard card footer.");
    await popupPage.fill("#referenceLink", "docs.simpledesignqa.local/cards");
    await popupPage.locator(".popup").screenshot({
      path: path.join(imagesDir, "popup-filled.png")
    });

    await popupPage.evaluate(() => {
      const target = document.getElementById("containerName");
      if (target) {
        target.value = "section#campaign-grid .widget-card";
      }
    });
    await popupPage.locator(".popup").screenshot({
      path: path.join(imagesDir, "popup-container.png")
    });

    await popupPage.click("#downloadCsvBtn");
    await popupPage.waitForFunction(() => {
      const status = document.getElementById("status");
      return status && status.textContent && status.textContent.startsWith("Exported SDQA_");
    });
    await popupPage.locator(".popup").screenshot({
      path: path.join(imagesDir, "popup-download.png")
    });
    await popupPage.close();

    const optionsPage = await createMockedPage(browser, "section#campaign-grid .widget-card");
    await optionsPage.goto(`${baseUrl}/options.html`, { waitUntil: "networkidle" });
    await optionsPage.fill("#searchInput", "dashboard");
    await optionsPage.selectOption("#severityFilter", "Major");
    await optionsPage.setViewportSize({ width: 1280, height: 820 });
    await optionsPage.screenshot({ path: path.join(imagesDir, "options-logs.png"), fullPage: true });
    await optionsPage.close();

    const guidePage = await browser.newPage({ viewport: { width: 1240, height: 1754 } });
    await guidePage.goto(`${baseUrl}/docs/how-to-use/guide.html`, { waitUntil: "networkidle" });
    await guidePage.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" }
    });
    await guidePage.close();

    console.log(`Generated: ${path.relative(extensionDir, pdfPath)}`);
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
