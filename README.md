# ascii sharks

```
                            ;'
                             %%'
                              .t;.               .oooo
                               S;:S%              %8S8.
                                ;:tt%t '..        XX%%S
t'                            ''XSSS8SSX%XX8#.    %XSX%
 :;'               ;.''X8%8XX%%S%%S%SStt%tSX8S#X8't%ttt.
  ::%'       ''8XXXSSt%Stttttt%8@%%@%8@8%Sttt%%%%SSSSS%tt.
  'SXXtt%t%%%S%:;StS%ttSS%tSXSt88@@%8%@8%tStS%%X%SS%%S%;;t
 .@##88#@...'@@@@#@8@88X88#XXXSX8SX88SX8%SS%S%%S88St%t%%%.
  %;%t             :.    '.'##@###@X#888XX##8@@@#.X%XS%.
 .%t                            ;%%%#@@##@@@.     SXS%%
 t.                            .%;%%%.            %%XXS
                              '%t:t              .SXSS'
                             '::.                ooooo
                            .S'
                            .
```

A Chrome extension that puts an ocean of ASCII fish and sharks behind the pages you choose.
Out of the box: the home screens of Claude, ChatGPT and Google.

## Install

Works in Chrome, Edge, Brave and other Chromium browsers. No Node or terminal needed.

1. Download `ascii-sharks-extension.zip` from the
   [latest release](https://github.com/xmiolo/ascii-sharks/releases/latest).
2. Unzip it into a folder you'll keep around (the browser loads the extension from that folder,
   so deleting or moving it removes the extension).
3. Open `chrome://extensions` (Edge: `edge://extensions`, Brave: `brave://extensions`) and turn
   on **Developer mode** in the top right corner.
4. Click **Load unpacked** and pick the unzipped folder (the one that has `manifest.json` inside).
5. Open `claude.ai/new`, `chatgpt.com` or `google.com`.

To update, download the new zip, replace the folder's contents and hit the reload button on
the extension card. To remove it, click **Remove** on the same card.

## Choose the pages

Click the extension's icon in the toolbar (or **Details → Extension options**) and list the
pages, one URL per line:

```
https://claude.ai/new           exact page (query string and # are ignored)
https://chatgpt.com/            site root only, not the conversations
https://example.com/docs/*      anything under /docs/
https://*.example.com/          any subdomain
# lines starting with # are comments
```

On **Save**, the browser asks for access to any new site in the list; the extension only runs
on sites you granted. Reload open tabs to see the change. **Restore defaults** brings back:

| Site    | Pages                                                  |
| ------- | ------------------------------------------------------ |
| Claude  | `claude.ai/`, `claude.ai/new`                          |
| ChatGPT | `chatgpt.com/`                                         |
| Google  | `www.google.com/`, `www.google.com.br/` (and `/webhp`) |

Browsers can't wildcard a top-level domain, so each Google domain (`google.pt`, ...) needs its
own line.

## How it works

The ocean only lives on the listed pages: open a conversation or a search result and it is torn
down, so it costs nothing while you work. Single-page apps are followed as you navigate.

The canvas sits on top of the page with `pointer-events: none`, so every click still reaches
the site. It blends with the page instead of covering it: on dark pages the ocean's black
background drops out (`screen`), on light pages it is inverted and multiplied, so the sharks
show up dark on white. The theme is re-checked while the tab is open. Sharks follow the mouse,
and clicking splashes the water.

## Build from source

```sh
npm install
npm run build   # outputs dist/, load it with "Load unpacked"
npm run pack    # builds and zips it into ascii-sharks-extension.zip
```

After rebuilding, hit the reload button on the extension card.

```
src/ocean/        ocean engine: world simulation and ASCII renderer
src/content.ts    mounts the ocean on matching pages
src/background.ts registers the content script on the sites you chose
src/options.ts    options page logic
src/patterns.ts   URL list parsing and defaults
static/           manifest.json and options.html
build.mjs         esbuild bundling into dist/
```

## Credits

The extension is by Gregori Bedin ([@xmiolo](https://github.com/xmiolo)). The ocean engine
comes from [stackedlol/ascii-sharks](https://github.com/stackedlol/ascii-sharks) by drewdi and
contributors.

## License

MIT. See [LICENSE](LICENSE).
