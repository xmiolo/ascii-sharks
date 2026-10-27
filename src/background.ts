import { loadUrls, sitesOf } from "./patterns";

const SCRIPT_ID = "ocean";

/**
 * The content script is registered at runtime, not in the manifest, so it follows
 * the URLs from the options page. Only sites the user granted access to are injected.
 */
async function syncContentScript() {
  const sites = sitesOf(await loadUrls());
  const granted: string[] = [];
  for (const site of sites) {
    if (await chrome.permissions.contains({ origins: [site] })) granted.push(site);
  }

  await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] }).catch(() => {});
  if (granted.length === 0) return;
  await chrome.scripting.registerContentScripts([
    { id: SCRIPT_ID, matches: granted, js: ["content.js"], runAt: "document_idle" },
  ]);
}

chrome.runtime.onInstalled.addListener(syncContentScript);
chrome.runtime.onStartup.addListener(syncContentScript);
chrome.permissions.onAdded.addListener(syncContentScript);
chrome.permissions.onRemoved.addListener(syncContentScript);
chrome.storage.onChanged.addListener((changes) => {
  if (changes.urls) syncContentScript();
});

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
