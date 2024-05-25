let online = true;

chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.sync.set({ clearCookies: true, clearHistory: true, clearCache: true });
});

// Remove browsing data when a tab is closed
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (!removeInfo.isWindowClosing) {
    chrome.tabs.get(tabId, (tab) => {
      if (tab && tab.url) {
        const url = tab.url;
        chrome.storage.sync.get(['clearCookies', 'clearHistory', 'clearCache'], (data) => {
          if (data.clearHistory) {
            chrome.history.deleteUrl({ url }, () => {
              console.log('Removed URL from history:', url);
            });
          }
          if (data.clearCache) {
            chrome.browsingData.removeCache({ origin: url }, () => {
              console.log('Cache cleared for URL:', url);
            });
          }
          if (data.clearCookies) {
            chrome.cookies.getAll({ url }, (cookies) => {
              cookies.forEach((cookie) => {
                chrome.cookies.remove({ url: `http://${cookie.domain}${cookie.path}`, name: cookie.name });
                console.log('Cookie removed:', cookie.name);
              });
            });
          }
        });
      }
    });
  }
});

// Listen for extension toggle
chrome.storage.sync.get('enabled', (data) => {
  if (data.enabled === undefined) {
    chrome.storage.sync.set({ enabled: true });
  }
  online = data.enabled;
  updateStatus();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'runExtension') {
    // Add logic here to run the extension
    sendResponse({ message: 'Extension executed.' });
  }
});

// Function to update online/offline status
const updateStatus = () => {
  online ? console.log('Extension is online.') : console.log('Extension is offline.');
  chrome.runtime.sendMessage({ statusChange: true });
};

// Listen for toggle changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    online = changes.enabled.newValue;
    updateStatus();
  }
});
