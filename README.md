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

Fish and sharks drawn as ASCII on a canvas. Zero dependencies.

Ships two ways:

- **Chrome extension**: sharks swim behind the home screens of Claude, ChatGPT and Google.
- **Library**: drop the ocean into any page or React app.

## Chrome extension

The ocean shows up only on each site's empty home screen and is torn down as soon as you
open a conversation or a search result, so it costs nothing while you work.

| Site    | Pages                                                       |
| ------- | ----------------------------------------------------------- |
| Claude  | `claude.ai/`, `claude.ai/new`                               |
| ChatGPT | `chatgpt.com/`                                              |
| Google  | `www.google.com/`, `www.google.com.br/` (and `/webhp`)      |

The canvas sits on top of the page with `pointer-events: none`, so every click still reaches
the site. It blends with the page instead of covering it: on dark pages the ocean's black
background drops out (`screen`), on light pages it is inverted and multiplied, so the sharks
show up dark on white. The theme is re-checked while the tab is open.

### Install (just the extension, no build)

Works in Chrome, Edge, Brave and other Chromium browsers. No Node or terminal needed.

1. Download `ascii-sharks-extension.zip` from the
   [latest release](https://github.com/xmiolo/ascii-sharks/releases/latest).
2. Unzip it into a folder you'll keep around (Chrome loads the extension from that folder,
   so deleting or moving it removes the extension).
3. Open `chrome://extensions` (Edge: `edge://extensions`, Brave: `brave://extensions`) and turn
   on **Developer mode** in the top right corner.
4. Click **Load unpacked** and pick the unzipped folder (the one that has `manifest.json` inside).
5. Open `claude.ai/new`, `chatgpt.com` or `google.com`.

To update, download the new zip, replace the folder's contents and hit the reload button on
the extension card. To remove it, click **Remove** on the same card.

### Build from source

```sh
npm install
npm run build:extension   # outputs dist-extension/
npm run pack:extension    # builds and zips it into ascii-sharks-extension.zip
```

Load `dist-extension/` with **Load unpacked** as above. After rebuilding, hit the reload
button on the extension card.

### Customize

- **More sites or Google domains**: add the host to `matches` in
  `extension/public/manifest.json` and its home paths to `HOME_PATHS` in `extension/content.ts`.
  Chrome match patterns can't wildcard a TLD, so each Google domain (`google.pt`, ...) is listed
  on its own.
- **Intensity**: tweak the opacities in `applyTheme` (`extension/content.ts`).

## Library

```sh
npm install && npm run dev
```

```ts
import { OceanEngine } from "./src";

const engine = new OceanEngine(canvas, [{ kind: "hammerhead", size: 1 }]);
```

The demo takes `?sharks=thresher,hammerhead,mako,nurse`: the first is the biggest, the rest step down.

React:

```tsx
import { AsciiOcean } from "./src/react";

<AsciiOcean sharks={[{ kind: "tiger", size: 1 }]} />;
```

Glyphs come from the canvas's `font-family`, so give it (or a parent) a monospace font.

## Project layout

```
src/          ocean engine (world simulation + ASCII renderer) and the React wrapper
extension/    Chrome extension: content script + manifest (MV3)
demo.ts       standalone demo page
```

## Credits

The Chrome extension is by Gregori Bedin ([@xmiolo](https://github.com/xmiolo)). The ocean engine comes from
[stackedlol/ascii-sharks](https://github.com/stackedlol/ascii-sharks) by drewdi and contributors.

## License

MIT. See [LICENSE](LICENSE).
