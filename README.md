# El Ghali Sany — Portfolio

## Publish on GitHub Pages

1. Extract the supplied portfolio ZIP on your computer.
2. Open the extracted folder and upload **its contents** to the root of the GitHub repository. Do not upload the ZIP itself and do not create another nested `portfolio-main` folder.
3. Upload the complete archive contents, including `index.html`, `i18n.js`, `mobility-data.js`, `vendor/leaflet/`, and all `.json.gz` files. Keep the five `*_heatmap.json` and five `*_simulation_geo.json` originals in the same directory as `index.html`.
4. Keep all root-level `maplibre-gl*` files together. Both map engines and the heatmap plugin are bundled locally; base maps and fonts still require internet access.
5. In GitHub, open **Settings → Pages** and confirm that the site is deployed from the `main` branch and `/ (root)` folder.
6. After the deployment finishes, hard-refresh the public page with `Ctrl + F5`.

The interactive map must be opened through GitHub Pages or another web server. Browsers block local JSON requests when `index.html` is opened directly with a `file://` address.

## September 2026 usability update

The source-grounding repair in `DATA_REVIEW.md` supersedes the earlier visual review. The heatmap is a rendering of weighted SUMO samples, not a calibrated congestion measure. Artificial density extrusions were removed. All original data files are preserved.

Vehicle mode starts playback after explicit selection (unless reduced motion is enabled). Controls are above the map. The 20× default shows the archived 8-second steps every 400 ms; 1× uses 8 seconds per step. Playback stops at the last frame; pressing Play there restarts at the first. Previous/next and timeline scrubbing pause playback.

The visible frame determines vehicle count and mean speed. Full-run metadata are not presented as if they describe the reduced export. Heat mode has no frame speed or frame count because its points have no timestamps or speeds.

Lossless gzip copies reduce transfer size. Browsers with `DecompressionStream` load them; otherwise the unchanged JSON files are used. Rebuild them after any source-data change with `python3 scripts/prepare-mobility.py`.

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
