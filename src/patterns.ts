/**
 * Pages the ocean shows up on, one URL per line in the options page:
 *
 *   https://claude.ai/new          exact page (query and hash are ignored)
 *   https://chatgpt.com/           site root only
 *   https://*.example.com/docs/*   any subdomain, anything under /docs/
 *
 * `*` in the path matches anything. In the host it is only allowed as a
 * leading `*.`, because that's all Chrome's match patterns can express.
 */
export const DEFAULT_URLS = [
  "https://claude.ai/",
  "https://claude.ai/new",
  "https://chatgpt.com/",
  "https://www.google.com/",
  "https://www.google.com/webhp",
  "https://www.google.com.br/",
  "https://www.google.com.br/webhp",
];

export type PagePattern = {
  /** Chrome match pattern for the whole site, used for permissions and injection. */
  site: string;
  test(url: URL): boolean;
};

const URL_RE = /^(https?|\*):\/\/(\*|(?:\*\.)?[a-z0-9.-]+)(?::\d+)?(\/.*)?$/i;

const escape = (s: string) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");

export function parsePattern(raw: string): PagePattern | null {
  const m = raw.trim().match(URL_RE);
  if (!m) return null;
  const [, scheme, host, path = "/"] = m;
  const pathRe = new RegExp(`^${escape(path.split(/[?#]/)[0]).replace(/\*/g, ".*")}$`);
  const bareHost = host.replace(/^\*\./, "");
  return {
    site: `${scheme.toLowerCase()}://${host.toLowerCase()}/*`,
    test(url) {
      if (scheme !== "*" && url.protocol !== `${scheme.toLowerCase()}:`) return false;
      const h = url.hostname;
      if (host !== "*" && h !== bareHost && !(host.startsWith("*.") && h.endsWith(`.${bareHost}`))) return false;
      return pathRe.test(url.pathname);
    },
  };
}

export async function loadUrls(): Promise<string[]> {
  const { urls } = await chrome.storage.sync.get("urls");
  return Array.isArray(urls) ? urls : DEFAULT_URLS;
}

export const sitesOf = (urls: string[]) => [
  ...new Set(urls.map(parsePattern).flatMap((p) => (p ? [p.site] : []))),
];
