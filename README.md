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

## Serving the replay

Serve through HTTP or GitHub Pages, not by double-clicking HTML. Upload all files at the repository root, including every traffic chunk, the five road networks, `road-motion.js`, `traffic-3d.js`, and `three.module.min.js`. There is no package installation or build step for deployment. Traffic chunks are plain JSON for browser compatibility; the release omits redundant compressed copies of these chunks. Individual files remain below 25 MB. Large uploads can be split into batches. Basemap tiles still require internet access.

## Validation scope

Automated checks cover lane paths, roundabout corridors, endpoint correspondence, fixed vehicle colours, streaming cache limits, playback and seeking, all five zones, responsive EN/FR/AR pages and the Leaflet fallback. Desktop Chrome was used with desktop, tablet and mobile viewport sizes; this does not establish physical-device, Safari, Firefox, screen-reader or production-host performance validation. No lint, typecheck, formatter or application build scripts are configured in this static project.

## Third-party software

Bundled third-party components retain their own licenses. See `THIRD_PARTY_LICENSES.txt` and `THREE-LICENSE.txt`.
