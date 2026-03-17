(() => {
  const STORAGE_KEY = "sdqa_logs";
  const SELECTED_TARGETS_KEY = "sdqa_selected_targets";
  const DRAFT_KEY = "sdqa_popup_draft";

  const LEGACY_STORAGE_KEY = "uat_logs";
  const LEGACY_SELECTED_TARGETS_KEY = "uat_selected_targets";
  const LEGACY_DRAFT_KEY = "uat_popup_draft";
  const MIGRATION_DONE_KEY = "sdqa_migration_v1_done";

  function hasContent(value) {
    if (value == null) {
      return false;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "object") {
      return Object.keys(value).length > 0;
    }

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return true;
  }

  function hasChromeStorage() {
    return Boolean(
      globalThis.chrome &&
        chrome.storage &&
        chrome.storage.local &&
        typeof chrome.storage.local.get === "function" &&
        typeof chrome.storage.local.set === "function"
    );
  }

  function storageGet(keys) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(keys, (result) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(result || {});
      });
    });
  }

  function storageSet(data) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(data, () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve();
      });
    });
  }

  function storageRemove(keys) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(keys, () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve();
      });
    });
  }

  async function migrateLegacyStorageIfNeeded() {
    if (!hasChromeStorage()) {
      return false;
    }

    const readKeys = [
      MIGRATION_DONE_KEY,
      STORAGE_KEY,
      SELECTED_TARGETS_KEY,
      DRAFT_KEY,
      LEGACY_STORAGE_KEY,
      LEGACY_SELECTED_TARGETS_KEY,
      LEGACY_DRAFT_KEY
    ];
    const result = await storageGet(readKeys);

    if (result[MIGRATION_DONE_KEY]) {
      return false;
    }

    const keyPairs = [
      [LEGACY_STORAGE_KEY, STORAGE_KEY],
      [LEGACY_SELECTED_TARGETS_KEY, SELECTED_TARGETS_KEY],
      [LEGACY_DRAFT_KEY, DRAFT_KEY]
    ];

    const updates = {};
    const legacyKeysToRemove = [];

    keyPairs.forEach(([legacyKey, currentKey]) => {
      const legacyValue = result[legacyKey];
      const currentValue = result[currentKey];

      if (!hasContent(currentValue) && hasContent(legacyValue)) {
        updates[currentKey] = legacyValue;
      }

      if (legacyValue !== undefined) {
        legacyKeysToRemove.push(legacyKey);
      }
    });

    updates[MIGRATION_DONE_KEY] = true;
    await storageSet(updates);

    if (legacyKeysToRemove.length > 0) {
      await storageRemove(legacyKeysToRemove);
    }

    return true;
  }

  function generateUuid() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const randomValue = Math.floor(Math.random() * 16);
      const value = char === "x" ? randomValue : (randomValue & 0x3) | 0x8;
      return value.toString(16);
    });
  }

  function escapeCsv(value) {
    const text = value == null ? "" : String(value);
    return `"${text.replace(/"/g, "\"\"")}"`;
  }

  function normalizeReferenceLink(value) {
    const text = value == null ? "" : String(value).trim();
    if (!text) {
      return "";
    }

    if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(text)) {
      return text;
    }

    if (text.startsWith("//")) {
      return `http:${text}`;
    }

    return `http://${text}`;
  }

  function getSafeReferenceLink(value) {
    const normalized = normalizeReferenceLink(value);
    if (!normalized) {
      return "";
    }

    try {
      const parsed = new URL(normalized);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.toString();
      }
      return "";
    } catch (_error) {
      return "";
    }
  }

  function formatDownloadFilename(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `simple-design-qa-log_${year}-${month}-${day}_${hour}-${minute}.csv`;
  }

  function formatExportFolderName(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    const millisecond = String(date.getMilliseconds()).padStart(3, "0");
    return `SDQA_${year}-${month}-${day}_${hour}-${minute}-${second}-${millisecond}`;
  }

  function escapeHtml(value) {
    const text = value == null ? "" : String(value);
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getScreenshotPath(entry) {
    if (entry && entry.screenshotPath) {
      return entry.screenshotPath;
    }
    if (entry && entry.screenshotName) {
      return `screenshots/${entry.screenshotName}`;
    }
    return "";
  }

  function buildCsv(entries) {
    const header = [
      "Date",
      "Page Name",
      "URL",
      "Severity",
      "Feedback Type",
      "Feedback",
      "Container Name",
      "Reference Link",
      "Screenshot File"
    ];

    const rows = (entries || []).map((entry) => [
      entry.createdAt || "",
      entry.pageTitle || "",
      entry.pageUrl || "",
      entry.severity || "",
      entry.feedbackType || "",
      entry.feedback || "",
      entry.containerName || "",
      getSafeReferenceLink(entry.referenceLink) || (entry.referenceLink || ""),
      getScreenshotPath(entry)
    ]);

    return [header, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");
  }

  function buildHtmlReport(entries, generatedAtIso) {
    const rows = (entries || [])
      .map((entry) => {
        const referenceLink = getSafeReferenceLink(entry.referenceLink);
        const screenshotPath = getScreenshotPath(entry);
        return `
          <tr>
            <td>${escapeHtml(entry.createdAt || "")}</td>
            <td>${escapeHtml(entry.pageTitle || "")}</td>
            <td>${entry.pageUrl ? `<a href="${escapeHtml(entry.pageUrl)}" target="_blank">${escapeHtml(entry.pageUrl)}</a>` : ""}</td>
            <td>${escapeHtml(entry.severity || "")}</td>
            <td>${escapeHtml(entry.feedbackType || "")}</td>
            <td>${escapeHtml(entry.feedback || "")}</td>
            <td>${escapeHtml(entry.containerName || "")}</td>
            <td>${referenceLink ? `<a href="${escapeHtml(referenceLink)}" target="_blank">${escapeHtml(entry.referenceLink || referenceLink)}</a>` : ""}</td>
            <td>${screenshotPath ? `<a href="${escapeHtml(screenshotPath)}" target="_blank">Open Screenshot</a>` : ""}</td>
          </tr>
        `;
      })
      .join("");

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Simple Design QA Logs</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; color: #0f172a; }
      h1 { margin: 0 0 8px; }
      .meta { margin: 0 0 14px; color: #475569; font-size: 13px; }
      table { border-collapse: collapse; width: 100%; font-size: 13px; }
      th, td { border: 1px solid #cbd5e1; padding: 8px; vertical-align: top; text-align: left; }
      th { background: #eff6ff; }
      a { color: #1d4ed8; }
    </style>
  </head>
  <body>
    <h1>Simple Design QA Logs</h1>
    <p class="meta">Generated at ${escapeHtml(generatedAtIso || new Date().toISOString())}</p>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Page Name</th>
          <th>URL</th>
          <th>Severity</th>
          <th>Feedback Type</th>
          <th>Feedback</th>
          <th>Container Name</th>
          <th>Reference Link</th>
          <th>Screenshot</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
</html>`;
  }

  function dataUrlToBytes(dataUrl) {
    const value = dataUrl == null ? "" : String(dataUrl);
    if (!value.startsWith("data:")) {
      throw new Error("Invalid data URL.");
    }

    const commaIndex = value.indexOf(",");
    if (commaIndex < 0) {
      throw new Error("Malformed data URL.");
    }

    const metadata = value.slice(5, commaIndex);
    const payload = value.slice(commaIndex + 1);
    const isBase64 = /;base64/i.test(metadata);

    if (isBase64) {
      const binary = atob(payload);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    }

    const decoded = decodeURIComponent(payload.replace(/\+/g, "%20"));
    return new TextEncoder().encode(decoded);
  }

  const CRC32_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let value = n;
      for (let bit = 0; bit < 8; bit += 1) {
        value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
      }
      table[n] = value >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i += 1) {
      crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function toMsDosDateTime(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const dosTime = ((hour & 0x1f) << 11) | ((minute & 0x3f) << 5) | ((second / 2) & 0x1f);
    const dosDate = (((year - 1980) & 0x7f) << 9) | ((month & 0x0f) << 5) | (day & 0x1f);

    return { dosDate, dosTime };
  }

  function writeUInt16LE(view, offset, value) {
    view.setUint16(offset, value, true);
  }

  function writeUInt32LE(view, offset, value) {
    view.setUint32(offset, value >>> 0, true);
  }

  function concatUint8Arrays(chunks, totalLength) {
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  }

  function normalizeZipFileData(fileData) {
    if (fileData instanceof Uint8Array) {
      return fileData;
    }
    if (typeof fileData === "string") {
      return new TextEncoder().encode(fileData);
    }
    throw new Error("Unsupported ZIP file data type.");
  }

  function buildZipBlob(files, date = new Date()) {
    if (!Array.isArray(files) || !files.length) {
      throw new Error("No files to zip.");
    }

    const { dosDate, dosTime } = toMsDosDateTime(date);
    const encoder = new TextEncoder();
    const localChunks = [];
    const centralChunks = [];
    let localOffset = 0;

    for (const file of files) {
      const path = file && file.path ? String(file.path) : "";
      if (!path) {
        continue;
      }

      const nameBytes = encoder.encode(path);
      const dataBytes = normalizeZipFileData(file.data);
      const checksum = crc32(dataBytes);
      const dataSize = dataBytes.length;

      const localHeader = new ArrayBuffer(30 + nameBytes.length);
      const localView = new DataView(localHeader);

      writeUInt32LE(localView, 0, 0x04034b50);
      writeUInt16LE(localView, 4, 20);
      writeUInt16LE(localView, 6, 0);
      writeUInt16LE(localView, 8, 0);
      writeUInt16LE(localView, 10, dosTime);
      writeUInt16LE(localView, 12, dosDate);
      writeUInt32LE(localView, 14, checksum);
      writeUInt32LE(localView, 18, dataSize);
      writeUInt32LE(localView, 22, dataSize);
      writeUInt16LE(localView, 26, nameBytes.length);
      writeUInt16LE(localView, 28, 0);

      const localHeaderBytes = new Uint8Array(localHeader);
      localHeaderBytes.set(nameBytes, 30);
      localChunks.push(localHeaderBytes, dataBytes);

      const centralHeader = new ArrayBuffer(46 + nameBytes.length);
      const centralView = new DataView(centralHeader);

      writeUInt32LE(centralView, 0, 0x02014b50);
      writeUInt16LE(centralView, 4, 20);
      writeUInt16LE(centralView, 6, 20);
      writeUInt16LE(centralView, 8, 0);
      writeUInt16LE(centralView, 10, 0);
      writeUInt16LE(centralView, 12, dosTime);
      writeUInt16LE(centralView, 14, dosDate);
      writeUInt32LE(centralView, 16, checksum);
      writeUInt32LE(centralView, 20, dataSize);
      writeUInt32LE(centralView, 24, dataSize);
      writeUInt16LE(centralView, 28, nameBytes.length);
      writeUInt16LE(centralView, 30, 0);
      writeUInt16LE(centralView, 32, 0);
      writeUInt16LE(centralView, 34, 0);
      writeUInt16LE(centralView, 36, 0);
      writeUInt32LE(centralView, 38, 0);
      writeUInt32LE(centralView, 42, localOffset);

      const centralHeaderBytes = new Uint8Array(centralHeader);
      centralHeaderBytes.set(nameBytes, 46);
      centralChunks.push(centralHeaderBytes);

      localOffset += localHeaderBytes.length + dataBytes.length;
    }

    if (!centralChunks.length) {
      throw new Error("No valid files to zip.");
    }

    const localLength = localChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const centralLength = centralChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const centralOffset = localLength;
    const entryCount = centralChunks.length;

    const endRecord = new ArrayBuffer(22);
    const endView = new DataView(endRecord);
    writeUInt32LE(endView, 0, 0x06054b50);
    writeUInt16LE(endView, 4, 0);
    writeUInt16LE(endView, 6, 0);
    writeUInt16LE(endView, 8, entryCount);
    writeUInt16LE(endView, 10, entryCount);
    writeUInt32LE(endView, 12, centralLength);
    writeUInt32LE(endView, 16, centralOffset);
    writeUInt16LE(endView, 20, 0);

    const bytes = concatUint8Arrays(
      [...localChunks, ...centralChunks, new Uint8Array(endRecord)],
      localLength + centralLength + 22
    );
    return new Blob([bytes], { type: "application/zip" });
  }

  globalThis.SDQAUtils = {
    STORAGE_KEY,
    SELECTED_TARGETS_KEY,
    DRAFT_KEY,
    MIGRATION_DONE_KEY,
    generateUuid,
    migrateLegacyStorageIfNeeded,
    normalizeReferenceLink,
    getSafeReferenceLink,
    dataUrlToBytes,
    buildCsv,
    buildHtmlReport,
    buildZipBlob,
    formatDownloadFilename,
    formatExportFolderName
  };

})();
