const { STORAGE_KEY, migrateLegacyStorageIfNeeded, getSafeReferenceLink } = globalThis.SDQAUtils;

const severityFilter = document.getElementById("severityFilter");
const feedbackTypeFilter = document.getElementById("feedbackTypeFilter");
const searchInput = document.getElementById("searchInput");
const logsBody = document.getElementById("logsBody");
const summary = document.getElementById("summary");
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeImageModalBtn = document.getElementById("closeImageModal");
const modalHint = document.getElementById("modalHint");

let allLogs = [];
let storageReadyPromise = null;
let lastFocusedBeforeModal = null;

function ensureStorageReady() {
  if (!storageReadyPromise) {
    storageReadyPromise = migrateLegacyStorageIfNeeded().catch((error) => {
      storageReadyPromise = null;
      throw error;
    });
  }
  return storageReadyPromise;
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

function formatDate(iso) {
  if (!iso) {
    return "";
  }

  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return iso;
  }

  return `${parsed.toLocaleDateString()} ${parsed.toLocaleTimeString()}`;
}

function matchesFilters(entry) {
  if (severityFilter.value && entry.severity !== severityFilter.value) {
    return false;
  }

  if (feedbackTypeFilter.value && entry.feedbackType !== feedbackTypeFilter.value) {
    return false;
  }

  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    return true;
  }

  const haystack = `${entry.pageTitle || ""} ${entry.feedback || ""}`.toLowerCase();
  return haystack.includes(query);
}

function createSeverityBadge(value) {
  const badge = document.createElement("span");
  badge.className = "severityBadge";
  badge.textContent = value || "";

  if (!value) {
    return badge;
  }

  const safeValue = value.toLowerCase();
  if (safeValue === "blocker" || safeValue === "major" || safeValue === "minor") {
    badge.classList.add(`sev-${safeValue}`);
  }

  return badge;
}

function renderRows() {
  const filtered = allLogs.filter(matchesFilters);
  logsBody.innerHTML = "";

  if (!filtered.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 10;
    cell.className = "emptyCell";
    cell.textContent = "No logs found for the selected filters.";
    row.appendChild(cell);
    logsBody.appendChild(row);
  } else {
    filtered.forEach((entry) => {
      const row = document.createElement("tr");

      const dateCell = document.createElement("td");
      dateCell.textContent = formatDate(entry.createdAt);
      row.appendChild(dateCell);

      const pageCell = document.createElement("td");
      pageCell.textContent = entry.pageTitle || "";
      row.appendChild(pageCell);

      const urlCell = document.createElement("td");
      if (entry.pageUrl) {
        const link = document.createElement("a");
        link.href = entry.pageUrl;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = entry.pageUrl;
        urlCell.appendChild(link);
      }
      row.appendChild(urlCell);

      const severityCell = document.createElement("td");
      severityCell.appendChild(createSeverityBadge(entry.severity || ""));
      row.appendChild(severityCell);

      const typeCell = document.createElement("td");
      typeCell.textContent = entry.feedbackType || "";
      row.appendChild(typeCell);

      const feedbackCell = document.createElement("td");
      feedbackCell.textContent = entry.feedback || "";
      row.appendChild(feedbackCell);

      const containerCell = document.createElement("td");
      containerCell.textContent = entry.containerName || "";
      row.appendChild(containerCell);

      const referenceCell = document.createElement("td");
      if (entry.referenceLink) {
        const safeLink = getSafeReferenceLink(entry.referenceLink);
        if (safeLink) {
          const refLink = document.createElement("a");
          refLink.href = safeLink;
          refLink.target = "_blank";
          refLink.rel = "noreferrer";
          refLink.textContent = entry.referenceLink;
          referenceCell.appendChild(refLink);
        } else {
          referenceCell.textContent = entry.referenceLink;
        }
      }
      row.appendChild(referenceCell);

      const screenshotCell = document.createElement("td");
      if (entry.screenshotDataUrl) {
        const viewLink = document.createElement("a");
        viewLink.href = "#";
        viewLink.className = "btn btn-secondary btn-sm viewImageLink";
        viewLink.textContent = "Open Image";
        viewLink.dataset.id = entry.id;
        screenshotCell.appendChild(viewLink);
      } else {
        screenshotCell.textContent = "-";
      }
      row.appendChild(screenshotCell);

      const actionCell = document.createElement("td");
      actionCell.className = "actionsCell";
      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-destructive btn-sm delete";
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.dataset.id = entry.id;
      actionCell.appendChild(deleteButton);
      row.appendChild(actionCell);

      logsBody.appendChild(row);
    });
  }

  summary.textContent = `${filtered.length} of ${allLogs.length} entries shown`;
}

async function deleteEntry(entryId) {
  allLogs = allLogs.filter((entry) => entry.id !== entryId);
  await storageSetLogs(allLogs);
  renderRows();
}

function openImageModal(entryId) {
  const entry = allLogs.find((log) => log.id === entryId);
  if (!entry || !entry.screenshotDataUrl) {
    return;
  }

  lastFocusedBeforeModal = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modalHint.hidden = true;
  modalHint.textContent = "";
  modalImage.hidden = false;
  modalImage.src = entry.screenshotDataUrl;
  imageModal.hidden = false;
  closeImageModalBtn.focus();
}

function closeImageModal() {
  imageModal.hidden = true;
  modalHint.hidden = true;
  modalHint.textContent = "";
  modalImage.hidden = false;
  modalImage.removeAttribute("src");

  if (lastFocusedBeforeModal instanceof HTMLElement) {
    lastFocusedBeforeModal.focus();
  }
}

modalImage.addEventListener("error", () => {
  modalImage.hidden = true;
  modalHint.textContent =
    "Screenshot preview could not be displayed here. Download the ZIP report to open the image locally.";
  modalHint.hidden = false;
});

modalImage.addEventListener("load", () => {
  modalHint.hidden = true;
  modalHint.textContent = "";
  modalImage.hidden = false;
});

logsBody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.dataset.id) {
    return;
  }

  if (target.classList.contains("viewImageLink")) {
    event.preventDefault();
    openImageModal(target.dataset.id);
    return;
  }

  if (!(target instanceof HTMLButtonElement) || !target.classList.contains("delete")) {
    return;
  }

  if (!confirm("Delete this log entry?")) {
    return;
  }

  try {
    await deleteEntry(target.dataset.id);
  } catch (error) {
    summary.textContent = `Delete failed: ${error.message}`;
  }
});

closeImageModalBtn.addEventListener("click", closeImageModal);
imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) {
    closeImageModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !imageModal.hidden) {
    closeImageModal();
  }
});

severityFilter.addEventListener("change", renderRows);
feedbackTypeFilter.addEventListener("change", renderRows);
searchInput.addEventListener("input", renderRows);

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await ensureStorageReady();
    allLogs = await storageGetLogs();
    renderRows();
  } catch (error) {
    summary.textContent = `Could not load logs: ${error.message}`;
  }
});
