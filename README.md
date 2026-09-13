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

## Vehicle playback

The mobility explorer now replays the original FCD recordings for all five zones at one-second resolution, retaining every recorded vehicle. `road-motion.js` loads two-minute chunks and reconstructs movement along the original lane shapes and junction connections. It retains up to three chunks and four decoded frames in memory. The previous eight-second exports are preserved as legacy files and are no longer the source of playback.

`traffic-3d.js` uses bundled Three.js 0.169.0 with instanced solid geometry: body, sloped glass cabin, roof, mirrors, wheels, lamps and ground shadow. Models share MapLibre's camera and depth buffer. They are illustrative passenger cars, approximately 5 m long and 1.8 m wide, not vehicle models identified from the source. The FCD front-bumper reference is accounted for. Colours are fixed by vehicle ID, not speed. The Leaflet fallback is explicitly 2D.

Playback defaults to 1× at an active recorded moment near a roundabout. The timeline spans 00:00–59:59; its initial time is listed in each zone's manifest. Street view restores the local camera and Whole zone shows the wider network. Zooming and the 2D/3D controls remain available. Reduced-motion mode disables automatic playback and intermediate animation.

Pause freezes the current visual position; resume continues from it. Stepping or seeking returns to a recorded second. The speed indicator and vehicle inspector show km/h from the recorded sample; the raw-record table retains m/s. Fullscreen keeps playback controls visible.

This is a replay of archived SUMO output, not a fresh traffic simulation or a reconstruction of observed real traffic. Between-second lane changes and steering are visually reconstructed; original network or simulation anomalies may remain. Unresolved/discontinuous transitions are held until the next measured sample rather than connected across unrelated roads. Vehicle positions, stops, speeds and source-frame metrics retain the original observations. Car paint and headlight appearance do not encode congestion, braking, signals or observed vehicle characteristics.

The recovered `.net.xml` files provide lane geometry and directed junction connectivity. The `.rou.xml` files and the thesis (pages 36–38) establish the source workflow; replay uses the actual lane/position sequence in the FCD recordings. Each `*_traffic.json` manifest records source filenames, SHA-256 hashes, frame range, full observation count and chunk filenames. Geographic conversion uses the network's projection and offset. Coordinates match the legacy export at its rounded seven-decimal precision in the checked reference frame.

The site still cannot estimate measured advertising exposure without billboard visibility geometry and audience measurements.

## Advertising teaching layer

The five zones now include two illustrative roadside billboards: A, static OOH (gold), and B, digital DOOH (teal). `billboard-3d.js` creates physical 4 × 3 m faces, frames, poles and bases in the existing Three.js scene. Both faces are readable. The compatible Leaflet view uses labelled 2D markers. These are teaching placements beside the SUMO lanes, not surveyed, authorised, recommended or optimal advertising locations. Building footprints, property rights and actual sightlines are not validated.

Selecting A or B highlights a road segment and displays the number of distinct vehicles currently on that lane segment and their mean recorded speed. These are instantaneous archived SUMO values, not cumulative passages, unique people or advertising impressions. The sampled road segment is not a visibility field. Gold and teal identify billboard formats; car paint remains stable and unrelated to speed.

The section “From traffic to a decision” connects traffic conditions, audience estimation, selling CPM and operating costs. All text and controls are localised in English, French and Arabic. The interactive calculator runs independently of the map and is not altered by zone or replay time.

### Financial source and interpretation

Defaults come specifically from thesis table 27 (p. 93) and the revenue assumptions on pp. 94–95: 300,000 assumed monthly impressions; MAD 55 selling CPM; six slots; 70% fill; MAD 300,167 annual OPEX and MAD 150,000 initial CAPEX. These are thesis scenario assumptions, not verified market quotes or audience observations. Other cost variants and inconsistent ROI expressions later in the thesis are not combined with them.

The thesis multiplies monthly audience by six slots without explicitly stating whether that audience is screen-wide or per slot. The calculator exposes both interpretations:

- Screen-wide allocation (default): a fixed total audience is shared equally across slots. Annual revenue = monthly impressions / 1,000 × CPM × fill fraction × 12. Default revenue: MAD 138,600; operating balance: −MAD 161,567.
- Per-slot interpretation: annual revenue additionally multiplies by the slot count, reproducing the thesis's MAD 831,600 and operating balance of MAD 531,433. This interpretation needs an independently justified audience per slot; six display slots alone do not justify multiplying viewers by six.

Five-year balance = 5 × (annual revenue − annual OPEX) − initial CAPEX. Break-even monthly impressions = annual OPEX × 1,000 / (12 × CPM × fill fraction × audience multiplier). The result is undefined when costs are positive and either CPM or fill is zero. These are constant-assumption, undiscounted teaching calculations, excluding financing and additional taxation; they are not accounting net profit or observed investment returns.

`advertising-model.js` contains the pure arithmetic and segment selection; `advertising.js` binds the form and map; `advertising-sites.json` records the illustrative positions, lane indices and segment coordinates. `locale.js` centralises new UI translations. The archived traffic data and lane reconstruction are unchanged.

Run `node advertising-model.test.mjs` from the repository root to verify thesis arithmetic, audience allocation, break-even, invalid/zero cases and billboard-segment counts against the supplied recordings. No additional Node packages are required for that check.

## v4 — traffic-first navigation and readable advertising

The explorer opens on recorded vehicles. The density layer is explicitly static and top-down, with a continuous heat surface instead of individual point markers. Playback and the street-view button are hidden in this static mode. Raw samples remain in the source table and downloadable files.

The replay banner distinguishes loading, buffering, paused playback, running playback, the end of the recording, an empty viewport, and vehicles stopped in the source. “Active scene” navigates to a recorded instant with at least three vehicles above 1 m/s within 160 m of the default street camera. `active-scenes.json` indexes those instants at ten-second intervals; it changes neither trajectories nor audience assumptions. Fullscreen errors expose Retry through the same action button.

Rapid timeline scrubbing pins the selected and following frames while late responses finish, so obsolete requests cannot evict the pair used for playback. A newly loaded zone's replay is committed only after its initial frames are ready and its request is still current. The 3D renderer submits vehicles near the viewport rather than rebuilding instances for the entire zone; original records and metrics are retained. Below zoom 16, cars and billboard pins are hidden and the banner directs visitors back to street view. Billboard selection preserves 2D and uses a front-facing camera bearing in 3D.

The explanation sits below the map. `campaign-art.js` draws original, fictional teaching artwork both on the physical billboard and in a readable preview. OOH remains fixed. DOOH uses six ten-second slots in a sixty-second loop, driven by recorded simulation time. Pausing or seeking also pauses or seeks the illustrative ad loop. Layout changes and the slot indicator represent ad changes; vehicle colours remain fixed. This demonstrates scheduling, not measured advertising delivery. The CPM calculator remains independent of traffic time, camera and zone.

Additional check: `node replay-cache.test.mjs` verifies late-response cache protection and DOOH slot boundaries. Browser checks were repeated in Chrome at 1440, 768 and 390 px, including the Leaflet fallback, rapid zone/seek changes, empty frames, active-scene navigation, 2D/3D selection, fullscreen and the unchanged financial calculator. Lane reconstruction checks covered 33,262 transitions around the initial views in the five zones, not every transition in the hour. Full source traffic, road-network JSON, PDFs and existing data assets are byte-for-byte unchanged from v3.

## v5 — editable billboard and recorded passage counters

Open “Create my billboard and count crossings” below the map. Enter up to 60 characters; the text appears on the static OOH face and the selected ten-second DOOH slot, including the actual 3D texture. “Preview my slot” seeks to that slot in the current minute and pauses playback. The draft survives zone changes within the page; reloading the page resets it. It is not saved or published externally.

The selected billboard has a white counting gate on one SUMO lane. Choose the last simulated minute, last five simulated minutes, or the interval from 00:00 to the current replay time. The counters distinguish unique recorded vehicle IDs, confirmed crossings (including repeat crossings), and crossings during the chosen DOOH slot. OOH includes all confirmed crossings. Seeking, pausing and changing playback speed do not add duplicate events. The initial active scene may start at 10:00; the displayed interval makes the scope explicit.

`build-panel-crossings.mjs` reproducibly builds `panel-crossings.json` from the original one-second FCD chunks, lane networks and illustrative advertising sites. A crossing requires the same ID on the selected lane immediately before and after the segment midpoint, in consecutive one-second observations. A displacement guard excludes discontinuities. Crossings during lane changes, missing samples and first appearances are excluded, so this is a conservative count on one lane, not total road traffic. Crossing time is estimated linearly between samples and can be uncertain near a DOOH slot boundary. The displayed cars retain the original traffic records.

Estimated impressions = eligible crossings × assumed people per vehicle × assumed exposed fraction. Theoretical CPM value = estimated impressions / 1,000 × assumed CPM. Defaults of one person per vehicle and 50% exposed are illustrative, editable assumptions, not measurements or thesis audience estimates. MAD 55 CPM is a teaching assumption consistent with the separate thesis scenario. Values may be fractional expectations; they are not unique people, measured impressions, sold inventory or realised revenue. Changing assumptions or the chosen slot applies retrospectively to the entire selected interval. No monthly extrapolation or automatic transfer to the separate financial calculator is performed. Placements remain illustrative and do not establish actual sightlines.

Run `node build-panel-crossings.mjs` to regenerate the index, then `node panel-workshop.test.mjs` to check crossing boundaries, repeat IDs, periods, rewind, six-slot allocation, input limits and audience arithmetic. The existing advertising and replay-cache checks also pass. Chrome checks cover desktop, tablet, Arabic mobile viewport and forced Leaflet fallback: text editing, 3D texture revision, previewing a slot, exact counter comparison, seek/rewind, invalid assumptions, fullscreen, zone switching and density-mode isolation. Missing counter data leaves the editor and traffic replay available, with unavailable counters explicitly shown.

## v6 — original CVs and visitor shortcuts

The three supplied, one-page PDFs are included unchanged: `CV_SANY_El_Ghali_FR.pdf`, `CV_SANY_El_Ghali_ENG.pdf` and `CV_SANY_El_Ghali_AR.pdf`. The hero and desktop navigation download the current language's CV. The contact section provides view-in-new-tab and download links for all three languages, with actual file sizes. Native links continue to work without JavaScript.

Contact tools use the email and UAE telephone number in all three supplied CVs. The email link prepares a subject and greeting in the page language; the phone link uses `tel:`. `El-Ghali-Sany.vcf` contains only the supplied name, email and phone, for optional import by the visitor. `visitor-tools.js` adds email copying with a visible status and selectable manual fallback when clipboard access fails. It does not send messages or submit contact information to a server. No accounts, analytics, cookies, external API or dependency were added.

Each of the four project articles now has a direct-link copy button and an email link with its localised title and current deployment URL. Query parameters and unrelated anchors are omitted. The site prepares a message in the visitor's email app; it does not send it. In a local preview, these links correctly refer to the local preview, so copy published project links from the published site. Existing language switching preserves section anchors, including the new `#cv` section.

A back-to-top link appears after scrolling and returns keyboard focus to the main title. Motion respects the visitor's reduced-motion preference. A native footer link remains available without JavaScript. Arabic email display now isolates the complete address in one LTR span.

Validation: Chrome visitor-flow checks cover French desktop (1440 px), English tablet (768 px), Arabic mobile (390 px) and narrow French mobile (320 px). All CV responses and downloaded files were compared by SHA-256 with the supplied originals. Checks include PDF viewing, contact-card download, real clipboard copy, forced clipboard rejection and manual selection, project URL/message contents, keyboard menu closing, focus after back-to-top, language-anchor preservation and no-JavaScript access. Screenshots were visually reviewed. The existing workshop browser regression and Node checks were also rerun. Email sending, telephone calls and importing the contact card into a native address book were not executed. Physical mobile devices, other browsers and deployment remain unverified.

Changed files: the three HTML pages, `locale.js`, `styles.css` and this README. Added files: `visitor-tools.js`, `El-Ghali-Sany.vcf` and the three CV PDFs. All other v5 files, including simulation sources, rendering, panel counters and financial calculations, remain byte-for-byte unchanged.

Deployment note: the supplied CVs refer to `el2545.github.io/portfolio_UAE/`, while the site's existing canonical/social metadata refers to `el2545.github.io/portfolioV/`. Both were preserved; align the site's canonical/social URLs with the selected production repository when deploying. The CVs were not rewritten.

## v7 — read PDFs inside the site

“Read my CV” in the hero and desktop navigation now opens an integrated document reader. The CV library provides “Read here” for each language and retains separate download links. All same-origin PDF links without a `download` attribute, including project reports and citations such as `#page=36`, open the same reader. Ctrl/Cmd-click and other modified clicks retain native browser behavior. Without JavaScript or native dialog support, the original PDF links remain available.

`pdf-reader.js` lazily imports bundled PDF.js 5.6.205 only when a PDF is opened. It renders one page at a time, supports direct page entry, previous/next, page-width fitting and 100/150/200% zoom, and provides an expandable extracted-text alternative. Text extraction may not preserve the PDF's visual reading order. The canvas does not activate annotations, embedded links or PDF scripts. The original PDF can always be opened separately or downloaded using the reader's own links. The source files are not rewritten or sent to another document service. Reading transfers PDF data to the browser, but does not force a file download or require saving a copy.

The modal traps focus through native dialog behavior; Escape and Close return focus to the initiating link. Opening a PDF pauses active traffic playback. Closing cancels pending document/render work and releases the canvas. Rapid close/reopen uses request generations to prevent stale documents from replacing the selected one. Error states expose Retry and the native PDF link. The UI is localised in English, French and Arabic and supports narrow/mobile layouts. Browser/OS accessibility and native application behavior still require broader testing.

The reader uses the [official PDF.js document and canvas APIs](https://mozilla.github.io/pdf.js/examples/). The bundled library, worker, standard fonts and image-decoding resources retain their licences in `PDFJS-LICENSE.txt` and `PDFJS-LICENSE_*.txt`. No CDN or package installation is required for deployment. Every added runtime asset must be uploaded with the site.

Validation: Chrome at 1440, 768, 390 and 320 px rendered all three CVs, the AI-MCDM report and the 154-page PFE. Checks cover no PDF library/document requests before opening, no forced download or new tab, page 36 deep links, page entry/bounds, previous/next, zoom, extracted text, original download identity, Escape focus return, loading errors, Retry, rapid close/reopen and native links without JavaScript. The existing SUMO workshop browser regression and Node arithmetic/cache checks pass. PDFs, simulation data and existing rendering/calculation code remain byte-for-byte unchanged from v6. No public deployment, Safari/Firefox, physical-device or screen-reader validation was performed.

## v8 — published PDF repair and clearer project copy

The public site is https://el2545.github.io/portfolio_UAE/. Its PDF reader failed because the library, worker, fonts and decoder resources were missing from the deployed repository (HTTP 404); the three original CV PDFs were present and valid. Commit `ec774801ea13470d27730549a94aa5bfbeb6faff` restored the 29 missing runtime and licence files. Canonical, social, structured-data and sitemap URLs now use the verified public repository path.

If PDF rendering fails, each of the three CVs can display a local PNG preview rendered from the unchanged original PDF. This fallback supports zoom and keeps Retry, Open original and Download available. A failed dynamic import is retried with a fresh URL so a cached import failure does not prevent recovery. Longer reports retain the reader's explicit error and original-document link. The fallback image is a visual copy, not an accessible replacement for the original document or the working reader's extracted-text view.

The introduction, project summaries, context labels and contact copy use concise descriptions of the supplied work in all three languages. The portrait uses its original colours. Research titles, qualifications, numerical results, assumptions and simulation sources are preserved.

Validation: the reader and workshop browser regressions pass in Chrome across French desktop, English tablet and Arabic/French mobile viewports. Forced PDF-module failures, all three fallback previews and recovery through Retry pass. The three Node suites pass. Public Chrome checks confirm the three CVs render and the PFE opens at its cited page. PDF.js emits font-hint warnings for supplied documents; these did not prevent the checked pages from rendering. Physical devices, Safari, Firefox and screen-reader validation have not been performed. No package/build, lint, typecheck or formatter task is configured.

## Serving the replay

Serve through HTTP or GitHub Pages, not by double-clicking HTML. Upload all files at the repository root, including every traffic chunk, the five road networks, `road-motion.js`, `traffic-3d.js`, and `three.module.min.js`. There is no package installation or build step for deployment. Traffic chunks are plain JSON for browser compatibility; the release omits redundant compressed copies of these chunks. Individual files remain below 25 MB. Large uploads can be split into batches. Basemap tiles still require internet access.

## Validation scope

Automated checks cover lane paths, roundabout corridors, endpoint correspondence, fixed vehicle colours, streaming cache limits, playback and seeking, all five zones, responsive EN/FR/AR pages and the Leaflet fallback. Desktop Chrome was used with desktop, tablet and mobile viewport sizes; this does not establish physical-device, Safari, Firefox, screen-reader or production-host performance validation. No lint, typecheck, formatter or application build scripts are configured in this static project.

## Third-party software

Bundled third-party components retain their own licenses. See `THIRD_PARTY_LICENSES.txt` and `THREE-LICENSE.txt`.
