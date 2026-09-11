# El Ghali Sany — Portfolio

## Publish on GitHub Pages

1. Extract the supplied portfolio ZIP on your computer.
2. Open the extracted folder and upload **its contents** to the root of the GitHub repository. Do not upload the ZIP itself and do not create another nested `portfolio-main` folder.
3. Replace both `index.html` and `i18n.js`. Keep the five `*_heatmap.json` and five `*_simulation_geo.json` files in the same directory as `index.html`.
4. Keep all root-level `maplibre-gl*` files together. The 3D engine is loaded locally; the compatible 2D engine, base maps and fonts require internet access.
5. In GitHub, open **Settings → Pages** and confirm that the site is deployed from the `main` branch and `/ (root)` folder.
6. After the deployment finishes, hard-refresh the public page with `Ctrl + F5`.

The interactive map must be opened through GitHub Pages or another web server. Browsers block local JSON requests when `index.html` is opened directly with a `file://` address.

## September 2026 usability update

- Restored navigation contrast and constrained portrait proportions.
- Enlarged language, map and zoom controls; tablet menu and small-screen spacing.
- Escape closes the menu and returns focus. Navigation no longer waits for the map engine.
- Arabic control typography and directional isolation for email and timeline.
- Switching EN / FR / AR keeps the active simulation frame, playback and camera position.
- Data requests have a timeout, a visible busy state, retry and protection against stale responses.
- 3D startup has a timeout and a compatible 2D fallback. The 2D map does not intercept page-wheel scrolling.
- Playback pauses when the document is hidden. Simulation legends now match vehicle colours.
- Content remains visible if scroll-animation initialization is unavailable.

## Tests

Node.js 22 or later:

```sh
npm ci --ignore-scripts
npm test
```

The automated suite checks DOM behaviour with mocked map engines and requests, not GPU rendering. It also checks local links and the real simulation exports. No build step is needed for GitHub Pages.

Before publishing, verify the modified page in a real browser at 320, 768 and 1440 px: all languages, menu keyboard control, heatmap and simulation, five zones, play/pause, timeline, zoom, 3D-capable hardware, and offline/retry behaviour. These rendered checks are not covered by the DOM suite.

The delivered changes have not been pushed or published. Existing CV and experience statements have been preserved; confirm that they remain current before publication. Arabic uses the existing English PDF CV; no Arabic PDF is included.
