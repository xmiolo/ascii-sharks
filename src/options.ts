import { DEFAULT_URLS, loadUrls, parsePattern, sitesOf } from "./patterns";

const textarea = document.querySelector<HTMLTextAreaElement>("#urls")!;
const status = document.querySelector<HTMLParagraphElement>("#status")!;
const saveButton = document.querySelector<HTMLButtonElement>("#save")!;
const resetButton = document.querySelector<HTMLButtonElement>("#reset")!;

let saved: string[] = [];

function show(text: string, error = false) {
  status.textContent = text;
  status.classList.toggle("error", error);
}

const readLines = () =>
  textarea.value
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

function save(urls: string[]) {
  const invalid = urls.filter((u) => !parsePattern(u));
  if (invalid.length) {
    show(`Invalid URL: ${invalid.join(", ")}`, true);
    return;
  }
  const sites = sitesOf(urls);
  const dropped = sitesOf(saved).filter((s) => !sites.includes(s));

  // permissions.request needs the click's user gesture, so it must run before any await.
  chrome.permissions.request({ origins: sites }, async (granted) => {
    if (!granted) {
      show("Access to the sites was not granted, nothing saved.", true);
      return;
    }
    // Sites declared in the manifest can't be revoked; that's fine.
    if (dropped.length) await chrome.permissions.remove({ origins: dropped }).catch(() => {});
    await chrome.storage.sync.set({ urls });
    saved = urls;
    textarea.value = urls.join("\n");
    show("Saved. Reload open tabs to see the change.");
  });
}

saveButton.addEventListener("click", () => save(readLines()));
resetButton.addEventListener("click", () => save(DEFAULT_URLS));

loadUrls().then((urls) => {
  saved = urls;
  textarea.value = urls.join("\n");
});
