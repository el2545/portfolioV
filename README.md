# El Ghali Sany — Portfolio

## Publish on GitHub Pages

1. Extract `portfolio-main.zip` on your computer.
2. Open the extracted folder and upload **its contents** to the root of the GitHub repository. Do not upload the ZIP itself and do not create another nested `portfolio-main` folder.
3. At minimum, replace `index.html`. Keep the five `*_heatmap.json` and five `*_simulation_geo.json` files in the same directory as `index.html`.
4. Keep the `vendor/maplibre/` folder. The map can use the online MapLibre package, but this folder provides a local fallback.
5. In GitHub, open **Settings → Pages** and confirm that the site is deployed from the `main` branch and `/ (root)` folder.
6. After the deployment finishes, hard-refresh the public page with `Ctrl + F5`.

The interactive map must be opened through GitHub Pages or another web server. Browsers block local JSON requests when `index.html` is opened directly with a `file://` address.
