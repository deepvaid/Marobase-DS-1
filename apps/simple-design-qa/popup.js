const {
  STORAGE_KEY,
  SELECTED_TARGETS_KEY,
  DRAFT_KEY,
  generateUuid,
  migrateLegacyStorageIfNeeded,
  getSafeReferenceLink,
  dataUrlToBytes,
  buildCsv,
  buildHtmlReport,
  buildZipBlob,
  formatExportFolderName
} = globalThis.SDQAUtils;

const DEFAULT_SEVERITY = "Blocker";
const DEFAULT_FEEDBACK_TYPE = "";

const pageTitleInput = document.getElementById("pageTitle");
const pageUrlInput = document.getElementById("pageUrl");
const createdAtInput = document.getElementById("createdAt");
const createdAtHumanInput = document.getElementById("createdAtHuman");
const severityRadios = Array.from(document.querySelectorAll('input[name="severity"]'));
const feedbackTypeSelect = document.getElementById("feedbackType");
const feedbackInput = document.getElementById("feedback");
const feedbackCount = document.getElementById("feedbackCount");
const autoFormatBtn = document.getElementById("autoFormatBtn");
const feedbackTypeField = document.getElementById("feedbackTypeField");
const feedbackTypeHelp = document.getElementById("feedbackTypeHelp");
const feedbackTypeError = document.getElementById("feedbackTypeError");
const feedbackField = document.getElementById("feedbackField");
const feedbackError = document.getElementById("feedbackError");
const referenceLinkInput = document.getElementById("referenceLink");
const notesInput = document.getElementById("notesInput");
const containerNameInput = document.getElementById("containerName");
const screenshotState = document.getElementById("screenshotState");
const screenshotPreviewLink = document.getElementById("screenshotPreviewLink");
const screenshotThumbWrap = document.getElementById("screenshotThumbWrap");
const screenshotThumb = document.getElementById("screenshotThumb");
const previewModal = document.getElementById("previewModal");
const previewImage = document.getElementById("previewImage");
const previewHint = document.getElementById("previewHint");
const closePreviewBtn = document.getElementById("closePreviewBtn");
const statusText = document.getElementById("status");
const openSettingsBtn = document.getElementById("openSettingsBtn");
const pickAreaBtn = document.getElementById("pickAreaBtn");
const captureScreenshotBtn = document.getElementById("captureScreenshotBtn");
const captureFullPageBtn = document.getElementById("captureFullPageBtn");
const clearScreenshotBtn = document.getElementById("clearScreenshotBtn");
const saveBtn = document.getElementById("saveBtn");
const viewLogsBtn = document.getElementById("viewLogsBtn");
const downloadCsvBtn = document.getElementById("downloadCsvBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const moreDetailsToggle = document.getElementById("moreDetailsToggle");
const moreDetailsContent = document.getElementById("moreDetailsContent");
const copyIsoBtn = document.getElementById("copyIsoBtn");
const clearConfirmModal = document.getElementById("clearConfirmModal");
const clearConfirmCheck = document.getElementById("clearConfirmCheck");
const clearConfirmBtn = document.getElementById("clearConfirmBtn");
const clearConfirmCancelBtn = document.getElementById("clearConfirmCancelBtn");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");
const toastActionBtn = document.getElementById("toastActionBtn");

let currentScreenshotDataUrl = "";
let currentScreenshotName = "";
let draftPersistWarningShown = false;
let activeTabId = null;
let storageReadyPromise = null;
let toastTimer = null;
let clearModalLastFocus = null;

function ensureStorageReady() {
  if (!storageReadyPromise) {
    storageReadyPromise = migrateLegacyStorageIfNeeded().catch((error) => {
      storageReadyPromise = null;
      throw error;
    });
  }
  return storageReadyPromise;
}

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.classList.remove("error", "success");
  if (!message) {
    return;
  }
  statusText.classList.add(isError ? "error" : "success");
}

function hideToast() {
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
  toast.hidden = true;
  toastActionBtn.hidden = true;
  toastActionBtn.onclick = null;
}

function showToast(message, options = {}) {
  hideToast();

  toastText.textContent = message;
  if (options.actionLabel && typeof options.action === "function") {
    toastActionBtn.textContent = options.actionLabel;
    toastActionBtn.hidden = false;
    toastActionBtn.onclick = () => {
      options.action();
      hideToast();
    };
  }

  toast.hidden = false;
  toastTimer = setTimeout(() => {
    hideToast();
  }, 2600);
}

function updateScreenshotUi() {
  if (currentScreenshotDataUrl) {
    screenshotState.textContent = `Captured: ${currentScreenshotName || "screenshot.jpg"}`;
    screenshotPreviewLink.hidden = false;
    screenshotThumbWrap.hidden = false;
    screenshotThumb.src = currentScreenshotDataUrl;
    return;
  }

  screenshotState.textContent = "No evidence captured yet.";
  screenshotPreviewLink.hidden = true;
  screenshotThumbWrap.hidden = true;
  screenshotThumb.removeAttribute("src");
}

function hasDraftContent(draft) {
  return Boolean(
    draft &&
      (draft.feedback ||
        draft.referenceLink ||
        draft.screenshotDataUrl ||
        draft.feedbackType ||
        (draft.severity && draft.severity !== DEFAULT_SEVERITY))
  );
}

function toDraftUrlKey(url) {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}${parsed.search}`;
  } catch (_error) {
    return url;
  }
}

async function clearCaptureStatusFromDraft(draft) {
  const updated = { ...draft };
  delete updated.captureStatus;
  delete updated.captureStatusType;

  if (!hasDraftContent(updated)) {
    await storageClearDraft();
    return;
  }

  await storageSetDraft(updated);
}

async function storageGetLogs() {
  await ensureStorageReady();
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      resolve(Array.isArray(result[STORAGE_KEY]) ? result[STORAGE_KEY] : []);
    });
  });
}

async function storageSetLogs(logs) {
  await ensureStorageReady();
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [STORAGE_KEY]: logs }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve();
    });
  });
}

async function storageGetDraft() {
  await ensureStorageReady();
  return new Promise((resolve) => {
    chrome.storage.local.get([DRAFT_KEY], (result) => {
      const draft = result[DRAFT_KEY];
      resolve(draft && typeof draft === "object" ? draft : null);
    });
  });
}

async function storageSetDraft(draft) {
  await ensureStorageReady();
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [DRAFT_KEY]: draft }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve();
    });
  });
}

async function storageClearDraft() {
  await ensureStorageReady();
  return new Promise((resolve) => {
    chrome.storage.local.remove(DRAFT_KEY, () => resolve());
  });
}

async function storageGetSelectedTargets() {
  await ensureStorageReady();
  return new Promise((resolve) => {
    chrome.storage.local.get([SELECTED_TARGETS_KEY], (result) => {
      const map = result[SELECTED_TARGETS_KEY];
      resolve(map && typeof map === "object" ? map : {});
    });
  });
}

function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs && tabs.length ? tabs[0] : null);
    });
  });
}

function isRestrictedPage(url) {
  return (
    !url ||
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("edge://") ||
    url.startsWith("about:")
  );
}

function getSelectedSeverity() {
  const selected = severityRadios.find((radio) => radio.checked);
  return selected ? selected.value : "";
}

function setSelectedSeverity(value) {
  const target = severityRadios.find((radio) => radio.value === value);
  if (target) {
    target.checked = true;
    return;
  }

  const fallback = severityRadios.find((radio) => radio.value === DEFAULT_SEVERITY);
  if (fallback) {
    fallback.checked = true;
  }
}

function formatCapturedAt(isoValue) {
  if (!isoValue) {
    return "";
  }

  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) {
    return isoValue;
  }

  const now = new Date();
  const isToday = parsed.toDateString() === now.toDateString();
  const timeText = parsed.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  if (isToday) {
    return `Today, ${timeText}`;
  }

  const dateText = parsed.toLocaleDateString();
  return `${dateText}, ${timeText}`;
}

function updateCapturedAtFields(isoValue) {
  createdAtInput.value = isoValue;
  createdAtHumanInput.value = formatCapturedAt(isoValue);
}

function clearValidationErrors() {
  feedbackTypeField.classList.remove("field-invalid");
  feedbackField.classList.remove("field-invalid");
  feedbackTypeError.hidden = true;
  feedbackError.hidden = true;
}

function showTypeValidationError(message) {
  feedbackTypeField.classList.add("field-invalid");
  feedbackTypeError.textContent = message;
  feedbackTypeError.hidden = false;
}

function showFeedbackValidationError(message) {
  feedbackField.classList.add("field-invalid");
  feedbackError.textContent = message;
  feedbackError.hidden = false;
}

function updateFeedbackCount() {
  feedbackCount.textContent = `${feedbackInput.value.length} chars`;
}

function updateTypeHelp() {
  feedbackTypeHelp.textContent = feedbackTypeSelect.value
    ? "Category selected for triage."
    : "Pick a category to help triage.";
}

function applyIssueTemplate() {
  const template = [
    "What happened:",
    "",
    "What did you expect:",
    "",
    "Steps to reproduce (optional):",
    "1. ",
    "2. "
  ].join("\n");

  if (!feedbackInput.value.trim()) {
    feedbackInput.value = template;
  } else if (!/what happened/i.test(feedbackInput.value)) {
    feedbackInput.value = `${template}\n\n${feedbackInput.value.trim()}`;
  }

  feedbackInput.focus();
  feedbackInput.selectionStart = feedbackInput.value.length;
  feedbackInput.selectionEnd = feedbackInput.value.length;
  updateFeedbackCount();
  void persistDraft();
}

function setMoreDetailsOpen(isOpen) {
  moreDetailsToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  moreDetailsContent.hidden = !isOpen;
}

function toggleMoreDetails() {
  const expanded = moreDetailsToggle.getAttribute("aria-expanded") === "true";
  setMoreDetailsOpen(!expanded);
}

async function copyTextValue(value, successMessage) {
  if (!value) {
    setStatus("Nothing to copy.", true);
    return;
  }

  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(value);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = value;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }

    setStatus(successMessage);
  } catch (_error) {
    setStatus("Copy failed.", true);
  }
}

function validateReferenceLink(value) {
  if (!value) {
    return true;
  }

  return Boolean(getSafeReferenceLink(value));
}

function validateRequiredFields() {
  clearValidationErrors();

  let valid = true;
  if (!getSelectedSeverity()) {
    setStatus("Severity is required.", true);
    valid = false;
  }

  if (!feedbackTypeSelect.value) {
    showTypeValidationError("Issue type is required.");
    valid = false;
  }

  if (!feedbackInput.value.trim()) {
    showFeedbackValidationError("Issue details are required.");
    valid = false;
  }

  if (!valid) {
    setStatus("Complete required fields before saving.", true);
  }

  return valid;
}

async function restoreDraftForUrl(currentUrl) {
  try {
    const draft = await storageGetDraft();
    const currentUrlKey = toDraftUrlKey(currentUrl);

    currentScreenshotDataUrl = "";
    currentScreenshotName = "";
    setSelectedSeverity(DEFAULT_SEVERITY);
    feedbackTypeSelect.value = DEFAULT_FEEDBACK_TYPE;
    feedbackInput.value = "";
    referenceLinkInput.value = "";
    notesInput.value = "";

    clearValidationErrors();

    if (!draft) {
      updateScreenshotUi();
      updateFeedbackCount();
      updateTypeHelp();
      return;
    }

    const draftUrlKey = draft.pageUrlKey || toDraftUrlKey(draft.pageUrl || "");
    const sameTab = draft.tabId == null || activeTabId == null || draft.tabId === activeTabId;
    if (!sameTab || draftUrlKey !== currentUrlKey) {
      await storageClearDraft();
      updateScreenshotUi();
      updateFeedbackCount();
      updateTypeHelp();
      return;
    }

    if (draft.severity) {
      setSelectedSeverity(draft.severity);
    }

    if (draft.feedbackType) {
      const knownTypes = Array.from(feedbackTypeSelect.options).map((option) => option.value);
      if (knownTypes.includes(draft.feedbackType)) {
        feedbackTypeSelect.value = draft.feedbackType;
      }
    }

    feedbackInput.value = draft.feedback || "";
    referenceLinkInput.value = draft.referenceLink || "";
    currentScreenshotDataUrl = draft.screenshotDataUrl || "";
    currentScreenshotName = draft.screenshotName || "";

    updateScreenshotUi();
    updateFeedbackCount();
    updateTypeHelp();

    if (draft.captureStatus) {
      const isError = draft.captureStatusType === "error";
      setStatus(draft.captureStatus, isError);
      if (draft.captureStatusType === "success") {
        showToast("Screenshot captured.");
      }
      await clearCaptureStatusFromDraft(draft);
    }
  } catch (_error) {
    updateScreenshotUi();
    updateFeedbackCount();
    updateTypeHelp();
  }
}

async function persistDraft() {
  try {
    const currentUrl = pageUrlInput.value;
    if (!currentUrl) {
      return;
    }

    const draft = {
      pageUrl: currentUrl,
      pageUrlKey: toDraftUrlKey(currentUrl),
      tabId: activeTabId,
      severity: getSelectedSeverity() || DEFAULT_SEVERITY,
      feedbackType: feedbackTypeSelect.value,
      feedback: feedbackInput.value,
      referenceLink: referenceLinkInput.value.trim(),
      screenshotDataUrl: currentScreenshotDataUrl,
      screenshotName: currentScreenshotName
    };

    const hasContent =
      draft.feedback.trim() ||
      draft.referenceLink ||
      draft.screenshotDataUrl ||
      draft.feedbackType !== DEFAULT_FEEDBACK_TYPE ||
      draft.severity !== DEFAULT_SEVERITY;

    if (!hasContent) {
      await storageClearDraft();
      draftPersistWarningShown = false;
      return;
    }

    await storageSetDraft(draft);
    draftPersistWarningShown = false;
  } catch (_error) {
    if (!draftPersistWarningShown) {
      setStatus("Draft could not be cached. Save soon to avoid losing unsaved work.", true);
      draftPersistWarningShown = true;
    }
  }
}

async function hydratePageDetails() {
  const activeTab = await getActiveTab();
  const currentUrl = (activeTab && activeTab.url) || "";
  activeTabId = activeTab && typeof activeTab.id === "number" ? activeTab.id : null;

  pageTitleInput.value = (activeTab && activeTab.title) || "";
  pageUrlInput.value = currentUrl;
  updateCapturedAtFields(new Date().toISOString());

  if (activeTab && typeof activeTab.id === "number") {
    const selectedTargets = await storageGetSelectedTargets();
    containerNameInput.value = selectedTargets[String(activeTab.id)] || "";
  } else {
    containerNameInput.value = "";
  }

  await restoreDraftForUrl(currentUrl);
}

async function saveEntry() {
  const feedback = feedbackInput.value.trim();
  const referenceLink = referenceLinkInput.value.trim();

  if (!validateRequiredFields()) {
    return;
  }

  if (!validateReferenceLink(referenceLink)) {
    setStatus("Reference link must be http(s) URL or a plain domain.", true);
    return;
  }

  try {
    const logs = await storageGetLogs();
    const createdAt = createdAtInput.value || new Date().toISOString();
    const selectedSeverity = getSelectedSeverity() || DEFAULT_SEVERITY;
    const selectedFeedbackType = feedbackTypeSelect.value;

    const entry = {
      id: generateUuid(),
      createdAt,
      pageUrl: pageUrlInput.value,
      pageTitle: pageTitleInput.value,
      severity: selectedSeverity,
      feedbackType: selectedFeedbackType,
      feedback,
      containerName: containerNameInput.value.trim(),
      referenceLink,
      screenshotDataUrl: currentScreenshotDataUrl,
      screenshotName: currentScreenshotName
    };

    logs.push(entry);
    await storageSetLogs(logs);
    await storageClearDraft();
    draftPersistWarningShown = false;

    feedbackInput.value = "";
    referenceLinkInput.value = "";
    notesInput.value = "";
    setSelectedSeverity(selectedSeverity);
    feedbackTypeSelect.value = selectedFeedbackType;
    currentScreenshotDataUrl = "";
    currentScreenshotName = "";
    updateScreenshotUi();

    updateCapturedAtFields(new Date().toISOString());
    updateFeedbackCount();
    updateTypeHelp();
    clearValidationErrors();
    setStatus("Saved.");
    showToast("Saved.", { actionLabel: "View", action: () => chrome.runtime.openOptionsPage() });
  } catch (error) {
    setStatus(`Save failed: ${error.message}`, true);
  }
}

function downloadBlob(blob, filename) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    chrome.downloads.download(
      {
        url: objectUrl,
        filename,
        saveAs: false,
        conflictAction: "uniquify"
      },
      (downloadId) => {
        URL.revokeObjectURL(objectUrl);
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(downloadId);
      }
    );
  });
}

function prepareExportEntries(logs) {
  const seenNames = new Set();

  return logs.map((entry, index) => {
    let screenshotName = entry.screenshotName || "";

    if (entry.screenshotDataUrl && !screenshotName) {
      screenshotName = `screenshot_${index + 1}.png`;
    }

    if (screenshotName && seenNames.has(screenshotName)) {
      const dotIndex = screenshotName.lastIndexOf(".");
      const base = dotIndex > -1 ? screenshotName.slice(0, dotIndex) : screenshotName;
      const ext = dotIndex > -1 ? screenshotName.slice(dotIndex) : ".png";
      screenshotName = `${base}_${index + 1}${ext}`;
    }

    if (screenshotName) {
      seenNames.add(screenshotName);
    }

    return {
      ...entry,
      screenshotName,
      screenshotPath: screenshotName ? `screenshots/${screenshotName}` : ""
    };
  });
}

async function exportPackage() {
  try {
    const logs = await storageGetLogs();

    if (!logs.length) {
      setStatus("No logs to export.", true);
      return;
    }

    const exportedAt = new Date();
    const folderName = formatExportFolderName(exportedAt);
    const exportEntries = prepareExportEntries(logs);
    const csv = buildCsv(exportEntries);
    const html = buildHtmlReport(exportEntries, exportedAt.toISOString());

    const zipFiles = [
      { path: `${folderName}/sdqa-logs.csv`, data: csv },
      { path: `${folderName}/sdqa-logs.html`, data: html }
    ];

    let skippedScreenshots = 0;

    for (const entry of exportEntries) {
      if (!entry.screenshotDataUrl || !entry.screenshotPath) {
        continue;
      }

      try {
        zipFiles.push({
          path: `${folderName}/${entry.screenshotPath}`,
          data: dataUrlToBytes(entry.screenshotDataUrl)
        });
      } catch (_error) {
        skippedScreenshots += 1;
      }
    }

    const zipBlob = buildZipBlob(zipFiles, exportedAt);
    await downloadBlob(zipBlob, `${folderName}.zip`);

    if (skippedScreenshots > 0) {
      setStatus(
        `Exported ${folderName}.zip (${skippedScreenshots} screenshot${skippedScreenshots > 1 ? "s" : ""} skipped).`
      );
      return;
    }

    setStatus(`Exported ${folderName}.zip`);
  } catch (error) {
    setStatus(`Export failed: ${error.message}`, true);
  }
}

function openClearConfirmModal() {
  clearModalLastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  clearConfirmCheck.checked = false;
  clearConfirmBtn.disabled = true;
  clearConfirmModal.hidden = false;
  clearConfirmCheck.focus();
}

function closeClearConfirmModal() {
  clearConfirmModal.hidden = true;
  clearConfirmCheck.checked = false;
  clearConfirmBtn.disabled = true;

  if (clearModalLastFocus instanceof HTMLElement) {
    clearModalLastFocus.focus();
  }
}

async function clearAllLogs() {
  try {
    await storageSetLogs([]);
    await storageClearDraft();
    setStatus("All logs cleared.");
    showToast("All logs cleared.");
    closeClearConfirmModal();
  } catch (error) {
    setStatus(`Clear failed: ${error.message}`, true);
  }
}

async function pickArea() {
  const activeTab = await getActiveTab();

  if (!activeTab || typeof activeTab.id !== "number") {
    setStatus("No active tab available.", true);
    return;
  }

  if (isRestrictedPage(activeTab.url)) {
    setStatus("Area picker is not allowed on this page.", true);
    return;
  }

  try {
    await persistDraft();
    await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: (tabId, selectedTargetsKey) => {
        if (window.__sdqaPickerActive) {
          return;
        }
        window.__sdqaPickerActive = true;

        const badge = document.createElement("div");
        badge.textContent = "SDQA Picker: click target container (Esc to cancel)";
        badge.style.position = "fixed";
        badge.style.top = "12px";
        badge.style.right = "12px";
        badge.style.zIndex = "2147483647";
        badge.style.padding = "8px 10px";
        badge.style.borderRadius = "6px";
        badge.style.background = "rgba(15, 23, 42, 0.95)";
        badge.style.color = "#fff";
        badge.style.font = "12px/1.4 -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
        badge.style.pointerEvents = "none";
        document.documentElement.appendChild(badge);

        let highlighted = null;
        let previousOutline = "";

        function describeElement(el) {
          if (!(el instanceof Element)) {
            return "";
          }

          const tag = el.tagName.toLowerCase();
          const id = el.id ? `#${el.id}` : "";
          const className =
            typeof el.className === "string" && el.className.trim()
              ? `.${el.className
                  .trim()
                  .split(/\s+/)
                  .slice(0, 3)
                  .join(".")}`
              : "";
          const dataTestId = el.getAttribute("data-testid") || el.getAttribute("data-test");

          let name = `${tag}${id}${className}`;
          if (!name) {
            name = tag;
          }
          if (dataTestId) {
            name += ` [data-testid=${dataTestId}]`;
          }
          return name.slice(0, 240);
        }

        function getContainer(start) {
          if (!(start instanceof Element)) {
            return null;
          }
          return (
            start.closest("section,main,article,nav,form,table,[data-testid],[id],[class]") || start
          );
        }

        function clearHighlight() {
          if (highlighted) {
            highlighted.style.outline = previousOutline;
            highlighted = null;
            previousOutline = "";
          }
        }

        function cleanup() {
          document.removeEventListener("mousemove", onMouseMove, true);
          document.removeEventListener("click", onClick, true);
          document.removeEventListener("keydown", onKeyDown, true);
          clearHighlight();
          badge.remove();
          window.__sdqaPickerActive = false;
        }

        function onMouseMove(event) {
          const target = getContainer(event.target);
          if (!target || target === highlighted) {
            return;
          }

          clearHighlight();
          highlighted = target;
          previousOutline = highlighted.style.outline;
          highlighted.style.outline = "2px solid #ef4444";
        }

        function onClick(event) {
          event.preventDefault();
          event.stopPropagation();

          const selected = getContainer(event.target);
          const containerName = describeElement(selected);
          chrome.storage.local.get([selectedTargetsKey], (result) => {
            const map =
              result[selectedTargetsKey] && typeof result[selectedTargetsKey] === "object"
                ? result[selectedTargetsKey]
                : {};
            map[String(tabId)] = containerName;
            chrome.storage.local.set({ [selectedTargetsKey]: map }, () => {});
          });

          cleanup();
        }

        function onKeyDown(event) {
          if (event.key === "Escape") {
            cleanup();
          }
        }

        document.addEventListener("mousemove", onMouseMove, true);
        document.addEventListener("click", onClick, true);
        document.addEventListener("keydown", onKeyDown, true);
      },
      args: [activeTab.id, SELECTED_TARGETS_KEY]
    });

    setStatus("Container picker enabled. Click target in the page, then reopen popup.");
    window.close();
  } catch (error) {
    setStatus(`Could not start picker: ${error.message}`, true);
  }
}

async function captureAreaScreenshot() {
  const activeTab = await getActiveTab();

  if (!activeTab || typeof activeTab.id !== "number") {
    setStatus("No active tab available.", true);
    return;
  }

  if (isRestrictedPage(activeTab.url)) {
    setStatus("Screenshot capture is not allowed on this page.", true);
    return;
  }

  try {
    await persistDraft();

    await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: (draftKey, pageUrl, tabId) => {
        if (window.__sdqaShotSelectorActive) {
          return;
        }

        window.__sdqaShotSelectorActive = true;

        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.zIndex = "2147483647";
        overlay.style.cursor = "crosshair";
        overlay.style.background = "rgba(15, 23, 42, 0.18)";

        const badge = document.createElement("div");
        badge.textContent = "Drag to capture screenshot area (Esc to cancel)";
        badge.style.position = "fixed";
        badge.style.top = "12px";
        badge.style.right = "12px";
        badge.style.zIndex = "2147483647";
        badge.style.padding = "8px 10px";
        badge.style.borderRadius = "6px";
        badge.style.background = "rgba(15, 23, 42, 0.95)";
        badge.style.color = "#fff";
        badge.style.font = "12px/1.4 -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
        badge.style.pointerEvents = "none";

        const box = document.createElement("div");
        box.style.position = "fixed";
        box.style.zIndex = "2147483647";
        box.style.border = "2px solid #1d4ed8";
        box.style.background = "rgba(29, 78, 216, 0.2)";
        box.style.display = "none";

        document.documentElement.appendChild(overlay);
        document.documentElement.appendChild(box);
        document.documentElement.appendChild(badge);

        let startX = 0;
        let startY = 0;
        let isDragging = false;

        function showToast(message, isError = false) {
          const existing = document.getElementById("__simpleDesignQaToast");
          if (existing) {
            existing.remove();
          }

          const toast = document.createElement("div");
          toast.id = "__simpleDesignQaToast";
          toast.textContent = message;
          toast.style.position = "fixed";
          toast.style.right = "12px";
          toast.style.bottom = "12px";
          toast.style.zIndex = "2147483647";
          toast.style.maxWidth = "360px";
          toast.style.padding = "10px 12px";
          toast.style.borderRadius = "8px";
          toast.style.font = "12px/1.4 -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
          toast.style.color = "#fff";
          toast.style.background = isError ? "rgba(180, 35, 24, 0.95)" : "rgba(11, 112, 45, 0.95)";
          toast.style.boxShadow = "0 10px 28px rgba(15, 23, 42, 0.35)";
          toast.style.pointerEvents = "none";
          toast.style.opacity = "0";
          toast.style.transform = "translateY(6px)";
          toast.style.transition = "opacity 120ms ease, transform 120ms ease";
          document.documentElement.appendChild(toast);

          requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";
          });

          setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(6px)";
            setTimeout(() => toast.remove(), 180);
          }, 2200);
        }

        function toUrlKey(url) {
          if (!url) {
            return "";
          }

          try {
            const parsed = new URL(url);
            return `${parsed.origin}${parsed.pathname}${parsed.search}`;
          } catch (_error) {
            return url;
          }
        }

        function readLastErrorMessage() {
          return chrome.runtime.lastError ? chrome.runtime.lastError.message : "";
        }

        function updateDraft(mutator, done) {
          chrome.storage.local.get([draftKey], (result) => {
            const existingDraft =
              result[draftKey] && typeof result[draftKey] === "object" ? result[draftKey] : {};
            const draft = {
              ...existingDraft,
              pageUrl: pageUrl || existingDraft.pageUrl || location.href
            };
            draft.pageUrlKey = toUrlKey(draft.pageUrl);
            draft.tabId = tabId;
            draft.severity = draft.severity || "Blocker";
            draft.feedbackType = draft.feedbackType || "";
            draft.feedback = draft.feedback || "";
            draft.referenceLink = draft.referenceLink || "";
            mutator(draft);

            chrome.storage.local.set({ [draftKey]: draft }, () => {
              const setError = readLastErrorMessage();
              if (!setError) {
                if (typeof done === "function") {
                  done(true, "");
                }
                return;
              }

              const compactDraft = {
                pageUrl: draft.pageUrl,
                pageUrlKey: draft.pageUrlKey,
                tabId: draft.tabId,
                severity: draft.severity,
                feedbackType: draft.feedbackType,
                feedback: draft.feedback,
                referenceLink: draft.referenceLink,
                captureStatus: `Screenshot could not be saved: ${setError}`,
                captureStatusType: "error"
              };

              chrome.storage.local.set({ [draftKey]: compactDraft }, () => {
                const fallbackError = readLastErrorMessage();
                if (typeof done === "function") {
                  done(!fallbackError, fallbackError || setError);
                }
              });
            });
          });
        }

        function markCaptureStatus(statusMessage, statusType, done) {
          updateDraft(
            (draft) => {
              draft.captureStatus = statusMessage;
              draft.captureStatusType = statusType;
            },
            done
          );
        }

        function cleanup() {
          overlay.removeEventListener("mousedown", onMouseDown, true);
          overlay.removeEventListener("mousemove", onMouseMove, true);
          document.removeEventListener("mouseup", onMouseUp, true);
          document.removeEventListener("keydown", onKeyDown, true);
          overlay.remove();
          box.remove();
          badge.remove();
          window.__sdqaShotSelectorActive = false;
        }

        function onMouseDown(event) {
          event.preventDefault();
          startX = event.clientX;
          startY = event.clientY;
          isDragging = true;

          box.style.display = "block";
          box.style.left = `${startX}px`;
          box.style.top = `${startY}px`;
          box.style.width = "0px";
          box.style.height = "0px";
        }

        function onMouseMove(event) {
          if (!isDragging) {
            return;
          }

          const x = Math.min(startX, event.clientX);
          const y = Math.min(startY, event.clientY);
          const width = Math.abs(event.clientX - startX);
          const height = Math.abs(event.clientY - startY);

          box.style.left = `${x}px`;
          box.style.top = `${y}px`;
          box.style.width = `${width}px`;
          box.style.height = `${height}px`;
        }

        function onMouseUp(event) {
          if (!isDragging) {
            return;
          }

          isDragging = false;

          const x = Math.min(startX, event.clientX);
          const y = Math.min(startY, event.clientY);
          const width = Math.abs(event.clientX - startX);
          const height = Math.abs(event.clientY - startY);

          if (width < 8 || height < 8) {
            markCaptureStatus("Screenshot capture canceled.", "info", cleanup);
            return;
          }

          chrome.runtime.sendMessage(
            {
              type: "CAPTURE_AREA",
              rect: { x, y, width, height },
              dpr: window.devicePixelRatio || 1
            },
            (response) => {
              if (chrome.runtime.lastError || !response || !response.ok || !response.screenshotDataUrl) {
                const errorMessage =
                  (chrome.runtime.lastError && chrome.runtime.lastError.message) ||
                  (response && response.error) ||
                  "Screenshot capture failed. Please try again.";
                showToast("Screenshot capture failed.", true);
                markCaptureStatus(errorMessage, "error", cleanup);
                return;
              }

              updateDraft(
                (draft) => {
                  draft.screenshotDataUrl = response.screenshotDataUrl;
                  draft.screenshotName = response.screenshotName;
                  draft.captureStatus = "Screenshot captured.";
                  draft.captureStatusType = "success";
                },
                (_saved, writeError) => {
                  if (writeError) {
                    console.warn("SDQA screenshot draft save warning:", writeError);
                    showToast("Screenshot captured, but could not be cached.", true);
                  } else {
                    showToast("Screenshot captured.");
                  }
                  cleanup();
                }
              );
            }
          );
        }

        function onKeyDown(event) {
          if (event.key === "Escape") {
            markCaptureStatus("Screenshot capture canceled.", "info", cleanup);
          }
        }

        overlay.addEventListener("mousedown", onMouseDown, true);
        overlay.addEventListener("mousemove", onMouseMove, true);
        document.addEventListener("mouseup", onMouseUp, true);
        document.addEventListener("keydown", onKeyDown, true);
      },
      args: [DRAFT_KEY, pageUrlInput.value, activeTab.id]
    });

    setStatus("Drag on page to capture area. Reopen popup to review evidence.");
    window.close();
  } catch (error) {
    setStatus(`Could not start screenshot capture: ${error.message}`, true);
  }
}

async function captureFullPageScreenshot() {
  const activeTab = await getActiveTab();

  if (!activeTab || typeof activeTab.id !== "number") {
    setStatus("No active tab available.", true);
    return;
  }

  if (isRestrictedPage(activeTab.url)) {
    setStatus("Screenshot capture is not allowed on this page.", true);
    return;
  }

  try {
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: "CAPTURE_VISIBLE" }, (message) => {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, error: chrome.runtime.lastError.message });
          return;
        }
        resolve(message || { ok: false, error: "No response from background." });
      });
    });

    if (!response.ok || !response.screenshotDataUrl) {
      throw new Error(response.error || "Could not capture visible page.");
    }

    currentScreenshotDataUrl = response.screenshotDataUrl;
    currentScreenshotName = response.screenshotName || `screenshot_${Date.now()}.jpg`;
    updateScreenshotUi();
    await persistDraft();
    setStatus("Full page screenshot captured.");
    showToast("Screenshot captured.");
  } catch (error) {
    setStatus(`Capture failed: ${error.message}`, true);
  }
}

function clearScreenshot() {
  currentScreenshotDataUrl = "";
  currentScreenshotName = "";
  updateScreenshotUi();
  void persistDraft();
  setStatus("Screenshot cleared.");
}

function openScreenshotPreview(event) {
  if (event) {
    event.preventDefault();
  }

  if (!currentScreenshotDataUrl) {
    setStatus("No screenshot available to preview.", true);
    return;
  }

  previewHint.hidden = true;
  previewHint.textContent = "";
  previewImage.hidden = false;
  previewImage.src = currentScreenshotDataUrl;
  previewModal.hidden = false;
}

function closeScreenshotPreview() {
  previewModal.hidden = true;
  previewHint.hidden = true;
  previewHint.textContent = "";
  previewImage.hidden = false;
  previewImage.removeAttribute("src");
}

openSettingsBtn.addEventListener("click", () => chrome.runtime.openOptionsPage());
moreDetailsToggle.addEventListener("click", toggleMoreDetails);
autoFormatBtn.addEventListener("click", applyIssueTemplate);

feedbackInput.addEventListener("input", () => {
  feedbackField.classList.remove("field-invalid");
  feedbackError.hidden = true;
  updateFeedbackCount();
  void persistDraft();
});

feedbackTypeSelect.addEventListener("change", () => {
  feedbackTypeField.classList.remove("field-invalid");
  feedbackTypeError.hidden = true;
  updateTypeHelp();
  void persistDraft();
});

referenceLinkInput.addEventListener("input", () => void persistDraft());
severityRadios.forEach((radio) => {
  radio.addEventListener("change", () => void persistDraft());
});

copyIsoBtn.addEventListener("click", () => {
  void copyTextValue(createdAtInput.value, "ISO timestamp copied.");
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-copy-target");
    if (!targetId) {
      return;
    }

    const input = document.getElementById(targetId);
    if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
      return;
    }

    const label = targetId === "pageTitle" ? "Page title" : "URL";
    void copyTextValue(input.value, `${label} copied.`);
  });
});

pickAreaBtn.addEventListener("click", pickArea);
captureScreenshotBtn.addEventListener("click", captureAreaScreenshot);
captureFullPageBtn.addEventListener("click", captureFullPageScreenshot);
clearScreenshotBtn.addEventListener("click", clearScreenshot);
screenshotPreviewLink.addEventListener("click", openScreenshotPreview);
screenshotThumbWrap.addEventListener("click", openScreenshotPreview);
closePreviewBtn.addEventListener("click", closeScreenshotPreview);

previewModal.addEventListener("click", (event) => {
  if (event.target === previewModal) {
    closeScreenshotPreview();
  }
});

previewImage.addEventListener("error", () => {
  previewImage.hidden = true;
  previewHint.textContent =
    "Screenshot preview is unavailable for this entry. Capture a new screenshot if needed.";
  previewHint.hidden = false;
});

previewImage.addEventListener("load", () => {
  previewHint.hidden = true;
  previewHint.textContent = "";
  previewImage.hidden = false;
});

saveBtn.addEventListener("click", () => {
  void saveEntry();
});

viewLogsBtn.addEventListener("click", () => chrome.runtime.openOptionsPage());
downloadCsvBtn.addEventListener("click", () => {
  void exportPackage();
});

clearAllBtn.addEventListener("click", openClearConfirmModal);
clearConfirmCancelBtn.addEventListener("click", closeClearConfirmModal);

clearConfirmCheck.addEventListener("change", () => {
  clearConfirmBtn.disabled = !clearConfirmCheck.checked;
});

clearConfirmBtn.addEventListener("click", () => {
  void clearAllLogs();
});

clearConfirmModal.addEventListener("click", (event) => {
  if (event.target === clearConfirmModal) {
    closeClearConfirmModal();
  }
});

toast.addEventListener("click", (event) => {
  if (event.target === toast) {
    hideToast();
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    if (!previewModal.hidden || !clearConfirmModal.hidden) {
      return;
    }
    event.preventDefault();
    void saveEntry();
    return;
  }

  if (event.key !== "Escape") {
    return;
  }

  if (!clearConfirmModal.hidden) {
    event.preventDefault();
    closeClearConfirmModal();
    return;
  }

  if (!previewModal.hidden) {
    event.preventDefault();
    closeScreenshotPreview();
    return;
  }

  window.close();
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await ensureStorageReady();
  } catch (error) {
    setStatus(`Storage migration failed: ${error.message}`, true);
  }

  setMoreDetailsOpen(false);
  await hydratePageDetails();
  updateScreenshotUi();
  updateFeedbackCount();
  updateTypeHelp();
});
