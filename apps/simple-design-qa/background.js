async function blobToDataUrl(blob) {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const slice = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...slice);
  }

  return `data:${blob.type};base64,${btoa(binary)}`;
}

async function cropAreaImage(dataUrl, rect, dpr) {
  if (typeof OffscreenCanvas === "undefined" || typeof createImageBitmap === "undefined") {
    return dataUrl;
  }

  const sourceBlob = await (await fetch(dataUrl)).blob();
  const sourceBitmap = await createImageBitmap(sourceBlob);
  const ratio = Number(dpr) > 0 ? Number(dpr) : 1;

  const sx = Math.min(
    Math.max(0, Math.round((rect.x || 0) * ratio)),
    Math.max(0, sourceBitmap.width - 1)
  );
  const sy = Math.min(
    Math.max(0, Math.round((rect.y || 0) * ratio)),
    Math.max(0, sourceBitmap.height - 1)
  );
  const sw = Math.max(1, Math.round((rect.width || 0) * ratio));
  const sh = Math.max(1, Math.round((rect.height || 0) * ratio));

  const maxWidth = sourceBitmap.width - sx;
  const maxHeight = sourceBitmap.height - sy;
  const cropWidth = Math.max(1, Math.min(sw, maxWidth));
  const cropHeight = Math.max(1, Math.min(sh, maxHeight));

  const MAX_EDGE = 1200;
  const largestEdge = Math.max(cropWidth, cropHeight);
  const scale = largestEdge > MAX_EDGE ? MAX_EDGE / largestEdge : 1;
  const outputWidth = Math.max(1, Math.round(cropWidth * scale));
  const outputHeight = Math.max(1, Math.round(cropHeight * scale));

  const canvas = new OffscreenCanvas(outputWidth, outputHeight);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(sourceBitmap, sx, sy, cropWidth, cropHeight, 0, 0, outputWidth, outputHeight);

  const croppedBlob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.78 });
  return blobToDataUrl(croppedBlob);
}

async function compressImage(dataUrl, maxEdge = 1600) {
  if (typeof OffscreenCanvas === "undefined" || typeof createImageBitmap === "undefined") {
    return dataUrl;
  }

  const sourceBlob = await (await fetch(dataUrl)).blob();
  const sourceBitmap = await createImageBitmap(sourceBlob);
  const largestEdge = Math.max(sourceBitmap.width, sourceBitmap.height);
  const scale = largestEdge > maxEdge ? maxEdge / largestEdge : 1;
  const outputWidth = Math.max(1, Math.round(sourceBitmap.width * scale));
  const outputHeight = Math.max(1, Math.round(sourceBitmap.height * scale));

  const canvas = new OffscreenCanvas(outputWidth, outputHeight);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(sourceBitmap, 0, 0, sourceBitmap.width, sourceBitmap.height, 0, 0, outputWidth, outputHeight);
  const compressedBlob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.8 });
  return blobToDataUrl(compressedBlob);
}

function downloadCsv(message, sendResponse) {
  const blob = new Blob([message.csv || ""], { type: "text/csv;charset=utf-8;" });
  const reader = new FileReader();

  reader.onload = () => {
    chrome.downloads.download(
      {
        url: reader.result,
        filename: message.filename,
        saveAs: true
      },
      (downloadId) => {
        if (chrome.runtime.lastError) {
          sendResponse({ ok: false, error: chrome.runtime.lastError.message });
          return;
        }
        sendResponse({ ok: true, downloadId });
      }
    );
  };

  reader.onerror = () => {
    sendResponse({ ok: false, error: "Could not generate CSV file." });
  };

  reader.readAsDataURL(blob);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) {
    return;
  }

  if (message.type === "DOWNLOAD_CSV") {
    downloadCsv(message, sendResponse);
    return true;
  }

  if (message.type === "CAPTURE_AREA") {
    const rect = message.rect;
    if (!rect || rect.width <= 0 || rect.height <= 0) {
      sendResponse({ ok: false, error: "Invalid selection area." });
      return true;
    }

    const windowId = sender?.tab?.windowId;
    chrome.tabs.captureVisibleTab(windowId, { format: "png" }, async (dataUrl) => {
      if (chrome.runtime.lastError || !dataUrl) {
        sendResponse({
          ok: false,
          error: chrome.runtime.lastError?.message || "Unable to capture the visible tab."
        });
        return;
      }

      try {
        const screenshotDataUrl = await cropAreaImage(dataUrl, rect, message.dpr);
        sendResponse({
          ok: true,
          screenshotDataUrl,
          screenshotName: `screenshot_${Date.now()}.jpg`
        });
      } catch (error) {
        sendResponse({ ok: false, error: error.message || "Could not crop screenshot." });
      }
    });
    return true;
  }

  if (message.type === "CAPTURE_VISIBLE") {
    const windowId = sender?.tab?.windowId;
    chrome.tabs.captureVisibleTab(windowId, { format: "png" }, async (dataUrl) => {
      if (chrome.runtime.lastError || !dataUrl) {
        sendResponse({
          ok: false,
          error: chrome.runtime.lastError?.message || "Unable to capture the visible tab."
        });
        return;
      }

      try {
        const screenshotDataUrl = await compressImage(dataUrl, 1600);
        sendResponse({
          ok: true,
          screenshotDataUrl,
          screenshotName: `screenshot_${Date.now()}.jpg`
        });
      } catch (error) {
        sendResponse({ ok: false, error: error.message || "Could not process screenshot." });
      }
    });
    return true;
  }
});
