import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  existsSync,
  createReadStream,
  mkdirSync,
  rmSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { spawnSync } from "node:child_process";
import { chromium } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const extensionDir = path.resolve(__dirname, "..");
const cwsDir = path.join(extensionDir, "docs", "chrome-web-store");
const screenshotsDir = path.join(cwsDir, "screenshots");
const promoDir = path.join(cwsDir, "promo");
const artifactsDir = path.resolve(extensionDir, "..", "..", "artifacts");
const zipPath = path.join(artifactsDir, "simple-design-qa-cws-assets.zip");

const SHOT_WIDTH = 1280;
const SHOT_HEIGHT = 800;

const screenshotTargets = {
  popupCore: path.join(screenshotsDir, "01-popup-core.jpg"),
  popupEvidence: path.join(screenshotsDir, "02-popup-evidence.jpg"),
  optionsLogs: path.join(screenshotsDir, "03-options-logs.jpg")
};

const promoTargets = {
  small: path.join(promoDir, "small-promo-440x280.jpg"),
  marquee: path.join(promoDir, "marquee-promo-1400x560.jpg")
};

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
    referenceLink: "simpledesignqa.com/guidelines"
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

function resetOutputDirectories() {
  mkdirSync(cwsDir, { recursive: true });
  rmSync(screenshotsDir, { recursive: true, force: true });
  rmSync(promoDir, { recursive: true, force: true });
  mkdirSync(screenshotsDir, { recursive: true });
  mkdirSync(promoDir, { recursive: true });
  mkdirSync(artifactsDir, { recursive: true });
}

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

async function createMockedPage(browser, options = {}) {
  const {
    includeDraft = false,
    selectedContainerName = "",
    tabId = 321,
    tabTitle = "Campaign Dashboard",
    tabUrl = "https://app.simpledesign.local/dashboard"
  } = options;

  const page = await browser.newPage({ viewport: { width: SHOT_WIDTH, height: SHOT_HEIGHT } });
  await page.addInitScript(
    ({ logs, containerName, shouldIncludeDraft, activeTabId, activeTabTitle, activeTabUrl }) => {
      function buildMockScreenshot() {
        const canvas = document.createElement("canvas");
        canvas.width = 960;
        canvas.height = 540;
        const ctx = canvas.getContext("2d");

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#dbeafe");
        gradient.addColorStop(1, "#bfdbfe");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#1e3a8a";
        ctx.font = "bold 34px Arial";
        ctx.fillText("Simple Design QA", 40, 80);
        ctx.fillStyle = "#1e40af";
        ctx.font = "24px Arial";
        ctx.fillText("Captured evidence preview", 40, 128);

        ctx.strokeStyle = "#1d4ed8";
        ctx.lineWidth = 4;
        ctx.strokeRect(120, 180, 720, 240);
        ctx.fillStyle = "rgba(29, 78, 216, 0.15)";
        ctx.fillRect(120, 180, 720, 240);

        ctx.fillStyle = "#0f172a";
        ctx.font = "20px Arial";
        ctx.fillText("Issue area", 150, 225);
        ctx.font = "16px Arial";
        ctx.fillText("Table header overlaps summary badge", 150, 260);

        return canvas.toDataURL("image/jpeg", 0.9);
      }

      const screenshotDataUrl = buildMockScreenshot();
      const screenshotName = "screenshot_mock.jpg";

      const enrichedLogs = logs.map((entry, index) => ({
        ...entry,
        screenshotDataUrl: entry.screenshotDataUrl || screenshotDataUrl,
        screenshotName: entry.screenshotName || `screenshot_${index + 1}.jpg`
      }));

      const draft = shouldIncludeDraft
        ? {
            pageUrl: activeTabUrl,
            pageUrlKey: `${new URL(activeTabUrl).origin}${new URL(activeTabUrl).pathname}${new URL(activeTabUrl).search}`,
            tabId: activeTabId,
            severity: "Major",
            feedbackType: "Navigation",
            feedback: "Primary button spacing breaks on hover state.",
            referenceLink: "design.simpleqa.local/navigation-guidelines",
            screenshotDataUrl,
            screenshotName,
            captureStatus: "Screenshot captured.",
            captureStatusType: "success"
          }
        : undefined;

      const store = {
        sdqa_logs: enrichedLogs,
        sdqa_selected_targets: { [String(activeTabId)]: containerName }
      };

      if (draft) {
        store.sdqa_popup_draft = draft;
      }

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
            },
            remove(keys, callback) {
              const list = Array.isArray(keys) ? keys : [keys];
              list.forEach((key) => {
                delete store[key];
              });
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
                id: activeTabId,
                title: activeTabTitle,
                url: activeTabUrl
              }
            ]);
          }
        },
        runtime: {
          id: "mock-simple-design-qa",
          lastError: null,
          openOptionsPage() {},
          sendMessage(message, callback) {
            if (!message || !message.type) {
              callback({ ok: false, error: "Unknown message" });
              return;
            }

            if (message.type === "CAPTURE_AREA" || message.type === "CAPTURE_VISIBLE") {
              callback({
                ok: true,
                screenshotDataUrl,
                screenshotName
              });
              return;
            }

            if (message.type === "DOWNLOAD_CSV") {
              callback({ ok: true, downloadId: 7 });
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
      window.close = () => {};
    },
    {
      logs: sampleLogs,
      containerName: selectedContainerName,
      shouldIncludeDraft: includeDraft,
      activeTabId: tabId,
      activeTabTitle: tabTitle,
      activeTabUrl: tabUrl
    }
  );

  return page;
}

async function stylePopupForMarketing(page) {
  await page.addStyleTag({
    content: `
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background: radial-gradient(1200px 700px at 0% -10%, #dbeafe 0%, transparent 55%),
          radial-gradient(900px 600px at 95% 105%, #bfdbfe 0%, transparent 65%),
          #f1f5f9;
      }
      .popup {
        box-shadow: 0 26px 60px rgba(15, 23, 42, 0.2);
        border-radius: 20px;
        max-height: calc(100vh - 48px);
        overflow: auto;
      }
      .popup::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    `
  });
}

async function capturePopupCore(browser, baseUrl) {
  const page = await createMockedPage(browser, { includeDraft: false, selectedContainerName: "" });
  try {
    await page.goto(`${baseUrl}/popup.html`, { waitUntil: "networkidle" });
    await stylePopupForMarketing(page);
    await page.evaluate(() => {
      const radio = document.querySelector('input[name="severity"][value="Major"]');
      if (radio instanceof HTMLInputElement) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    await page.selectOption("#feedbackType", "Dashboard Widget");
    await page.fill("#feedback", "Revenue widget CTA wraps to a second line at 1280px layout.");
    await page.click("#moreDetailsToggle");
    await page.fill("#referenceLink", "design.simpleqa.local/dashboard/widgets");
    await page.screenshot({
      path: screenshotTargets.popupCore,
      type: "jpeg",
      quality: 92,
      fullPage: false
    });
  } finally {
    await page.close();
  }
}

async function capturePopupEvidence(browser, baseUrl) {
  const page = await createMockedPage(browser, {
    includeDraft: true,
    selectedContainerName: "section#campaign-grid .widget-card"
  });

  try {
    await page.goto(`${baseUrl}/popup.html`, { waitUntil: "networkidle" });
    await stylePopupForMarketing(page);

    await page.waitForSelector("#screenshotPreviewLink:not([hidden])", { timeout: 6000 });
    await page.click("#moreDetailsToggle");
    await page.screenshot({
      path: screenshotTargets.popupEvidence,
      type: "jpeg",
      quality: 92,
      fullPage: false
    });
  } finally {
    await page.close();
  }
}

async function captureOptionsLogs(browser, baseUrl) {
  const page = await createMockedPage(browser, {
    includeDraft: false,
    selectedContainerName: "section#campaign-grid .widget-card"
  });

  try {
    await page.goto(`${baseUrl}/options.html`, { waitUntil: "networkidle" });
    await page.fill("#searchInput", "dashboard");
    await page.selectOption("#severityFilter", "Major");
    await page.selectOption("#feedbackTypeFilter", "Dashboard Widget");
    await page.waitForTimeout(250);
    await page.screenshot({
      path: screenshotTargets.optionsLogs,
      type: "jpeg",
      quality: 92,
      fullPage: false
    });
  } finally {
    await page.close();
  }
}

function toImageDataUrl(filePath) {
  const bytes = readFileSync(filePath);
  return `data:image/jpeg;base64,${bytes.toString("base64")}`;
}

async function captureSmallPromo(browser) {
  const page = await browser.newPage({ viewport: { width: 440, height: 280 } });
  const popupCoreData = toImageDataUrl(screenshotTargets.popupCore);

  try {
    await page.setContent(
      `<!doctype html>
      <html>
        <head>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              width: 440px;
              height: 280px;
              overflow: hidden;
              font-family: "Avenir Next", "Segoe UI", sans-serif;
              background: linear-gradient(160deg, #eff6ff 0%, #dbeafe 60%, #bfdbfe 100%);
              color: #0f172a;
            }
            .tile {
              width: 100%;
              height: 100%;
              padding: 20px;
              display: grid;
              grid-template-columns: 1.1fr 1fr;
              gap: 14px;
              align-items: center;
            }
            .title {
              font-size: 26px;
              line-height: 1.05;
              margin: 0 0 10px;
              font-weight: 700;
              color: #1e3a8a;
            }
            .sub {
              margin: 0;
              font-size: 16px;
              line-height: 1.2;
              color: #1e293b;
            }
            .preview {
              height: 100%;
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid rgba(37, 99, 235, 0.3);
              box-shadow: 0 10px 24px rgba(15, 23, 42, 0.15);
              background: #fff;
            }
            .preview img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center;
              display: block;
            }
          </style>
        </head>
        <body>
          <main class="tile">
            <section>
              <h1 class="title">Simple Design QA</h1>
              <p class="sub">Capture UX feedback faster</p>
            </section>
            <section class="preview">
              <img src="${popupCoreData}" alt="Simple Design QA popup" />
            </section>
          </main>
        </body>
      </html>`,
      { waitUntil: "networkidle" }
    );

    await page.screenshot({
      path: promoTargets.small,
      type: "jpeg",
      quality: 92,
      fullPage: false
    });
  } finally {
    await page.close();
  }
}

async function captureMarqueePromo(browser) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 560 } });
  const popupEvidenceData = toImageDataUrl(screenshotTargets.popupEvidence);
  const optionsData = toImageDataUrl(screenshotTargets.optionsLogs);

  try {
    await page.setContent(
      `<!doctype html>
      <html>
        <head>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              width: 1400px;
              height: 560px;
              overflow: hidden;
              font-family: "Avenir Next", "Segoe UI", sans-serif;
              background:
                radial-gradient(1100px 560px at -5% -10%, #dbeafe 0%, transparent 55%),
                radial-gradient(1000px 560px at 100% 120%, #bfdbfe 0%, transparent 60%),
                #f8fafc;
              color: #0f172a;
            }
            .tile {
              width: 100%;
              height: 100%;
              display: grid;
              grid-template-columns: 1fr 1.2fr;
              gap: 24px;
              padding: 44px 48px;
              align-items: center;
            }
            .eyebrow {
              margin: 0;
              font-size: 18px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              color: #1d4ed8;
              font-weight: 700;
            }
            .title {
              margin: 14px 0;
              font-size: 62px;
              line-height: 0.95;
              color: #1e3a8a;
            }
            .sub {
              margin: 0;
              font-size: 30px;
              line-height: 1.2;
              color: #1e293b;
            }
            .frames {
              position: relative;
              height: 100%;
              min-height: 460px;
            }
            .frame {
              position: absolute;
              border-radius: 16px;
              overflow: hidden;
              border: 1px solid rgba(37, 99, 235, 0.3);
              box-shadow: 0 24px 40px rgba(15, 23, 42, 0.2);
              background: #fff;
            }
            .frame img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }
            .frame.one {
              right: 0;
              top: 20px;
              width: 500px;
              height: 300px;
            }
            .frame.two {
              left: 40px;
              bottom: 20px;
              width: 520px;
              height: 290px;
            }
          </style>
        </head>
        <body>
          <main class="tile">
            <section>
              <p class="eyebrow">Chrome Extension</p>
              <h1 class="title">Simple Design QA</h1>
              <p class="sub">Capture UX feedback faster</p>
            </section>
            <section class="frames">
              <figure class="frame one">
                <img src="${optionsData}" alt="Options logs view" />
              </figure>
              <figure class="frame two">
                <img src="${popupEvidenceData}" alt="Popup evidence capture" />
              </figure>
            </section>
          </main>
        </body>
      </html>`,
      { waitUntil: "networkidle" }
    );

    await page.screenshot({
      path: promoTargets.marquee,
      type: "jpeg",
      quality: 92,
      fullPage: false
    });
  } finally {
    await page.close();
  }
}

async function getImageSize(browser, filePath) {
  const page = await browser.newPage({ viewport: { width: 300, height: 180 } });
  const imageDataUrl = toImageDataUrl(filePath);

  try {
    await page.setContent(`<img id="asset" src="${imageDataUrl}" alt="asset" />`, {
      waitUntil: "domcontentloaded"
    });

    return await page.$eval("#asset", (img) => {
      return new Promise((resolve, reject) => {
        const done = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });

        if (img.complete && img.naturalWidth > 0) {
          done();
          return;
        }

        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", () => reject(new Error("Image decode failed.")), {
          once: true
        });
      });
    });
  } finally {
    await page.close();
  }
}

async function validateDimension(browser, filePath, expectedWidth, expectedHeight) {
  const { width, height } = await getImageSize(browser, filePath);
  if (width !== expectedWidth || height !== expectedHeight) {
    throw new Error(
      `Dimension mismatch for ${path.basename(filePath)}: got ${width}x${height}, expected ${expectedWidth}x${expectedHeight}`
    );
  }
}

async function validateOutputs(browser) {
  await validateDimension(browser, screenshotTargets.popupCore, SHOT_WIDTH, SHOT_HEIGHT);
  await validateDimension(browser, screenshotTargets.popupEvidence, SHOT_WIDTH, SHOT_HEIGHT);
  await validateDimension(browser, screenshotTargets.optionsLogs, SHOT_WIDTH, SHOT_HEIGHT);
  await validateDimension(browser, promoTargets.small, 440, 280);
  await validateDimension(browser, promoTargets.marquee, 1400, 560);
}

function createZipIfAvailable() {
  const zipCheck = spawnSync("zip", ["-v"], { stdio: "ignore" });
  if (zipCheck.status !== 0) {
    return null;
  }

  rmSync(zipPath, { force: true });
  const result = spawnSync("zip", ["-r", zipPath, "chrome-web-store"], {
    cwd: path.join(extensionDir, "docs"),
    encoding: "utf-8"
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "Failed to create CWS assets zip.");
  }

  return zipPath;
}

function writeUploadManifest(zipArtifactPath) {
  const lines = [
    "Simple Design QA - Chrome Web Store Upload Assets",
    "",
    "Screenshots (1280x800 JPEG):",
    `- ${path.relative(extensionDir, screenshotTargets.popupCore)}`,
    `- ${path.relative(extensionDir, screenshotTargets.popupEvidence)}`,
    `- ${path.relative(extensionDir, screenshotTargets.optionsLogs)}`,
    "",
    "Promo tiles:",
    `- Small (440x280 JPEG): ${path.relative(extensionDir, promoTargets.small)}`,
    `- Marquee (1400x560 JPEG): ${path.relative(extensionDir, promoTargets.marquee)}`
  ];

  if (zipArtifactPath) {
    lines.push("", `Optional ZIP package: ${zipArtifactPath}`);
  }

  writeFileSync(path.join(cwsDir, "ASSET-MAP.txt"), lines.join("\n"));
}

async function main() {
  resetOutputDirectories();

  const { server, port } = await startServer();
  const baseUrl = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ headless: true });

  try {
    await capturePopupCore(browser, baseUrl);
    await capturePopupEvidence(browser, baseUrl);
    await captureOptionsLogs(browser, baseUrl);
    await captureSmallPromo(browser);
    await captureMarqueePromo(browser);
    await validateOutputs(browser);

    const zipArtifactPath = createZipIfAvailable();
    writeUploadManifest(zipArtifactPath);

    console.log(`Generated screenshots in: ${path.relative(extensionDir, screenshotsDir)}`);
    console.log(`Generated promo tiles in: ${path.relative(extensionDir, promoDir)}`);
    if (zipArtifactPath) {
      console.log(`Generated zip: ${zipArtifactPath}`);
    } else {
      console.log("zip command not found; skipped zip packaging.");
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
