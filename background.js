// Service worker: capture CSRF and anon_id headers from Vinted API requests

let latestCsrf = null;
let latestAnonId = null;

function upsertTokensFromHeaders(requestHeaders) {
  if (!Array.isArray(requestHeaders)) return;
  for (const h of requestHeaders) {
    if (!h || !h.name) continue;
    const name = h.name.toLowerCase();
    if (name === 'x-csrf-token' && h.value) {
      latestCsrf = h.value;
    } else if (name === 'x-anon-id' && h.value) {
      latestAnonId = h.value;
    }
  }
  // Persist for content scripts that load later
  try {
    chrome.storage.local.set({ vinted_csrf_token: latestCsrf, vinted_anon_id: latestAnonId });
  } catch (_) {
    // ignore
  }
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  details => {
    try { upsertTokensFromHeaders(details.requestHeaders || []); } catch (_) {}
  },
  { urls: [
      "https://www.vinted.fr/api/*",
      "https://www.vinted.de/api/*",
      "https://www.vinted.it/api/*",
      "https://www.vinted.es/api/*",
      "https://www.vinted.pt/api/*",
      "https://www.vinted.nl/api/*",
      "https://www.vinted.be/api/*",
      "https://www.vinted.pl/api/*",
      "https://www.vinted.cz/api/*",
      "https://www.vinted.sk/api/*",
      "https://www.vinted.hu/api/*",
      "https://www.vinted.ro/api/*",
      "https://www.vinted.bg/api/*",
      "https://www.vinted.lt/api/*",
      "https://www.vinted.lv/api/*",
      "https://www.vinted.ee/api/*",
      "https://www.vinted.gr/api/*",
      "https://www.vinted.si/api/*",
      "https://www.vinted.hr/api/*",
      "https://www.vinted.ie/api/*",
      "https://www.vinted.at/api/*",
      "https://www.vinted.ch/api/*",
      "https://www.vinted.dk/api/*",
      "https://www.vinted.se/api/*",
      "https://www.vinted.no/api/*",
      "https://www.vinted.fi/api/*",
      "https://www.vinted.co.uk/api/*",
      "https://www.vinted.com/api/*",
      // also nested paths containing /api/
      "https://www.vinted.fr/*/api/*",
      "https://www.vinted.de/*/api/*",
      "https://www.vinted.it/*/api/*",
      "https://www.vinted.es/*/api/*",
      "https://www.vinted.pt/*/api/*",
      "https://www.vinted.nl/*/api/*",
      "https://www.vinted.be/*/api/*",
      "https://www.vinted.pl/*/api/*",
      "https://www.vinted.cz/*/api/*",
      "https://www.vinted.sk/*/api/*",
      "https://www.vinted.hu/*/api/*",
      "https://www.vinted.ro/*/api/*",
      "https://www.vinted.bg/*/api/*",
      "https://www.vinted.lt/*/api/*",
      "https://www.vinted.lv/*/api/*",
      "https://www.vinted.ee/*/api/*",
      "https://www.vinted.gr/*/api/*",
      "https://www.vinted.si/*/api/*",
      "https://www.vinted.hr/*/api/*",
      "https://www.vinted.ie/*/api/*",
      "https://www.vinted.at/*/api/*",
      "https://www.vinted.ch/*/api/*",
      "https://www.vinted.dk/*/api/*",
      "https://www.vinted.se/*/api/*",
      "https://www.vinted.no/*/api/*",
      "https://www.vinted.fi/*/api/*",
      "https://www.vinted.co.uk/*/api/*",
      "https://www.vinted.com/*/api/*"
    ] },
  ["requestHeaders"]
);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'vinted:getTokens') {
    // Try storage first if memory is empty
    if (!latestCsrf) {
      chrome.storage.local.get(['vinted_csrf_token', 'vinted_anon_id'], data => {
        const csrf = data && data.vinted_csrf_token ? data.vinted_csrf_token : latestCsrf;
        const anonId = data && data.vinted_anon_id ? data.vinted_anon_id : latestAnonId;
        sendResponse({ csrf, anonId });
      });
      return true; // async response
    }
    sendResponse({ csrf: latestCsrf, anonId: latestAnonId });
    return true;
  }
  return false;
});
