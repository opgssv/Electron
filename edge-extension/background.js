let capturedUrls = new Map();

// Improved regex: Added googlevideo.com for YouTube detection
const VIDEO_REGEX = /(\.(m3u8|mp4|mpd|m4s|m4v|ts|flv|webm)($|\?))|(googlevideo\.com\/videoplayback)/i;

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Skip if not a main_frame or sub_frame to focus on media requests
    if (details.tabId === -1) return;

    const url = details.url;
    const isVideo = VIDEO_REGEX.test(url);
    
    if (isVideo) {
      const tabId = details.tabId;
      if (!capturedUrls.has(tabId)) {
        capturedUrls.set(tabId, new Set());
      }
      
      const prevSize = capturedUrls.get(tabId).size;
      // Also exclude common noise like small icons or tracking pixels if they happen to match
      if (!url.includes('analytics') && !url.includes('pixel')) {
        capturedUrls.get(tabId).add(url);
        
        if (capturedUrls.get(tabId).size > prevSize) {
          chrome.storage.local.set({ ["urls_" + tabId]: Array.from(capturedUrls.get(tabId)) });
        }
      }
    }
  },
  { urls: ["<all_urls>"] }
);

// Fallback: Check tab URL itself when updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const url = changeInfo.url;
    if (VIDEO_REGEX.test(url)) {
      if (!capturedUrls.has(tabId)) capturedUrls.set(tabId, new Set());
      capturedUrls.get(tabId).add(url);
      chrome.storage.local.set({ ["urls_" + tabId]: Array.from(capturedUrls.get(tabId)) });
    }
  }
});

// Clear storage when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  capturedUrls.delete(tabId);
  chrome.storage.local.remove(["urls_" + tabId]);
});
