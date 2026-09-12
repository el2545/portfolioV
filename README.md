# El Ghali Sany — Portfolio

Static multilingual portfolio for El Ghali Sany, focused on economics, policy, finance and data analysis.

## Content

- English, French and Arabic pages, with native RTL layout for Arabic.
- Applied research on AI-MCDM smart-city investment scoring, including the study PDF and Zenodo replication link.
- Casablanca traffic, OOH/DOOH investment and financial-reporting case studies.
- Interactive SUMO-derived map views with local MapLibre and Leaflet fallback files.

## Repository layout

The site intentionally uses a flat repository layout so every deployable file can be uploaded directly through the GitHub web interface. There is no build step. `index.html`, `fr.html` and `ar.html` are the three public pages. Runtime assets and project files sit at the repository root.

## Deployment

The site is designed for GitHub Pages from the `main` branch and repository root. `.nojekyll` is included so GitHub Pages serves the static files as-is.

## Data note

The interactive traffic views use derived SUMO exports prepared for portfolio visualisation. The site states the limits of those exports and does not treat repeated vehicle positions as unique viewers or measured advertising impressions.

## Third-party software

Bundled third-party components retain their own licenses. See `THIRD_PARTY_LICENSES.txt`.
