import { createCarSprites } from "./vehicle-renderer.js";
import { TrafficReplay, paintIndex, toLngLat } from "./road-motion.js";
import { AdvertisingExplorer, initAdvertisingCalculator } from "./advertising.js";

(async () => {
  const i18n = window.PORTFOLIO_I18N;
  const t = (source) => i18n?.t(source) || source;
  const message = (key, ...values) => i18n?.message(key, ...values) || "";
  const mobility = window.PORTFOLIO_DATA;
  initAdvertisingCalculator();

  const supportsWebGL2 = (() => {
    try {
      const canvas = document.createElement("canvas");
      return Boolean(
        canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }),
      );
    } catch (error) {
      return false;
    }
  })();

  // Navigation must never wait for a map engine or network request.
  let maplibregl = null;
  const menuButton = document.querySelector(".di-menu-button");
  const menu = document.querySelector(".di-nav__links");
  const closeMenu = () => {
    menu?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    if (menuButton) {
      menuButton.textContent = t("Menu");
      menuButton.setAttribute("aria-label", t("Open navigation"));
    }
  };
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu?.classList.contains("is-open")) {
      closeMenu();
      menuButton?.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".di-nav")) closeMenu();
  });

  menuButton?.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? t("Close") : t("Menu");
    menuButton.setAttribute(
      "aria-label",
      t(isOpen ? "Close navigation" : "Open navigation"),
    );
    if (isOpen) menu.querySelector("a")?.focus();
  });

  document.querySelectorAll(".di-nav__links a, .di-mark").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
      if (menuButton) menuButton.textContent = t("Menu");
    });
  });

  document.querySelector(".di-nav").addEventListener("focusout", (event) => {
    if (
      event.relatedTarget &&
      !event.currentTarget.contains(event.relatedTarget)
    )
      closeMenu();
  });
  const sections = [...document.querySelectorAll("main > [id]")];
  const navLinks = [
    ...document.querySelectorAll('.di-nav__links a[href^="#"]'),
  ];
  const setCurrentSection = () => {
    const marker = window.scrollY + 150;
    let active = sections[0]?.id || "";
    sections.forEach((section) => {
      if (section.offsetTop <= marker) active = section.id;
    });
    navLinks.forEach((link) => {
      const current = link.getAttribute("href") === "#" + active;
      if (current) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };
  window.addEventListener("scroll", setCurrentSection, { passive: true });
  setCurrentSection();

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const year = document.querySelector("#di-year");
  if (year) year.textContent = String(new Date().getFullYear());

  const mapContainer = document.querySelector("#case-map");
  if (!mapContainer) return;

  const ZONES = {
    maarif: {
      label: "Maârif",
      center: [-7.6377, 33.5822],
      heatmap: "maarif_heatmap.json",
      simulation: "maarif_simulation_geo.json",
    },
    hay_hassani: {
      label: "Hay Hassani",
      center: [-7.6761, 33.5671],
      heatmap: "hay_hassani_heatmap.json",
      simulation: "hay_hassani_simulation_geo.json",
    },
    ben_msick: {
      label: "Ben M’Sick",
      center: [-7.571, 33.5495],
      heatmap: "ben_msick_heatmap.json",
      simulation: "ben_msick_simulation_geo.json",
    },
    sidi_maarouf: {
      label: "Sidi Maârouf",
      center: [-7.6511, 33.5188],
      heatmap: "sidi_maarouf_heatmap.json",
      simulation: "sidi_maarouf_simulation_geo.json",
    },
    bd_mohammed_v: {
      label: "Bd Mohammed V",
      center: [-7.6088, 33.5884],
      heatmap: "bd_mohammed_v_heatmap.json",
      simulation: "bd_mohammed_v_simulation_geo.json",
    },
  };

  const EMPTY_COLLECTION = { type: "FeatureCollection", features: [] };
  let numberFormatter = i18n.numberFormatter();
  const cache = new Map();
  const controls = {
    modeButtons: [...document.querySelectorAll("[data-map-mode]")],
    zoneButtons: [...document.querySelectorAll("[data-map-zone]")],
    viewButtons: [...document.querySelectorAll("[data-map-view]")],
    zoneLabel: document.querySelector("#mapZoneLabel"),
    modeLabel: document.querySelector("#mapModeLabel"),
    status: document.querySelector("#mapStatus"),
    legend: document.querySelector("#mapLegendText"),
    kpiPoints: document.querySelector("#mapKpiPoints"),
    kpiPointsLabel: document.querySelector("#mapKpiPointsLabel"),
    kpiRecords: document.querySelector("#mapKpiRecords"),
    kpiSpeed: document.querySelector("#mapKpiSpeed"),
    kpiSteps: document.querySelector("#mapKpiSteps"),
    previous: document.querySelector("#mapPrevious"),
    play: document.querySelector("#mapPlay"),
    next: document.querySelector("#mapNext"),
    timeline: document.querySelector("#mapTimeline"),
    currentTime: document.querySelector("#mapTimeCurrent"),
    totalTime: document.querySelector("#mapTimeTotal"),
    speed: document.querySelector("#mapPlaybackSpeed"),
    inspector: document.querySelector("#mapInspector"),
    inspectorTitle: document.querySelector("#mapInspectorTitle"),
    inspectorBody: document.querySelector("#mapInspectorBody"),
    inspectorClose: document.querySelector("#mapInspectorClose"),
  };

  const state = {
    zone: "maarif",
    mode: "simulation",
    perspective: "3d",
    engine: maplibregl ? "maplibre" : "leaflet",
    frames: [],
    step: 0,
    timer: null,
    request: 0,
    basemap: "vector",
    data: null,
    loading: false,
    error: false,
    playWhenReady: false,
    seeking: false,
    exportStats: null,
  };

  let recordPage = 0;
  const recordDetails = document.querySelector(".di-records");
  const recordRows = document.querySelector("#recordRows");
  const recordStatus = document.querySelector("#recordStatus");
  function renderRecords() {
    recordRows.replaceChildren();
    if (!recordDetails?.open) return;
    const entries =
      state.mode === "heatmap"
        ? state.data?.points || []
        : state.frames[state.step]?.vehicles || [];
    const start = recordPage * 25;
    document.querySelector("#recordValue").textContent = t(
      state.mode === "heatmap" ? "Source weight" : "Speed (m/s)",
    );
    entries.slice(start, start + 25).forEach((entry, i) => {
      const values =
        state.mode === "heatmap"
          ? [
              String(start + i + 1),
              i18n.number(entry[0], 5),
              i18n.number(entry[1], 5),
              i18n.number(entry[2]),
            ]
          : [
              String(entry.id),
              i18n.number(entry.lat, 5),
              i18n.number(entry.lng, 5),
              i18n.number(entry.speed),
            ];
      const tr = document.createElement("tr");
      values.forEach((value) => {
        const td = document.createElement("td");
        const bdi = document.createElement("bdi");
        bdi.dir = "ltr";
        bdi.textContent = value;
        td.append(bdi);
        tr.append(td);
      });
      recordRows.append(tr);
    });
    recordStatus.textContent = entries.length
      ? message(
          "recordRange",
          i18n.number(start + 1, 0),
          i18n.number(Math.min(start + 25, entries.length), 0),
          i18n.number(entries.length, 0),
        )
      : t("Load a layer to view its records.");
    document.querySelector("#recordPrevious").disabled = start === 0;
    document.querySelector("#recordNext").disabled =
      start + 25 >= entries.length;
  }
  recordDetails?.addEventListener("toggle", () => {
    if (recordDetails.open) {
      stopPlayback();
      renderRecords();
    }
  });
  document.querySelector("#recordPrevious")?.addEventListener("click", () => {
    recordPage = Math.max(0, recordPage - 1);
    renderRecords();
  });
  document.querySelector("#recordNext")?.addEventListener("click", () => {
    recordPage++;
    renderRecords();
  });
  const controlLabels = {
    ".maplibregl-ctrl-zoom-in, .leaflet-control-zoom-in": "Zoom in",
    ".maplibregl-ctrl-zoom-out, .leaflet-control-zoom-out": "Zoom out",
    ".maplibregl-ctrl-compass": "Reset bearing to north",
    ".maplibregl-ctrl-fullscreen": "Enter fullscreen",
    ".maplibregl-ctrl-shrink": "Exit fullscreen",
    ".maplibregl-ctrl-attrib-button": "Toggle attribution",
    ".maplibregl-canvas": "Map",
  };
  function localizeMapControls() {
    for (const [selector, label] of Object.entries(controlLabels)) {
      mapContainer.querySelectorAll(selector).forEach((el) => {
        el.setAttribute("aria-label", t(label));
        el.setAttribute("title", t(label));
      });
    }
    controls.viewButtons.forEach((button) => {
      if (button.disabled) button.title = message("webglRequired");
    });
    mapContainer
      .querySelectorAll(".maplibregl-desktop-message")
      .forEach((el) => {
        const isMac = el.textContent.includes("⌘");
        el.textContent = t(
          isMac
            ? "Use ⌘ + scroll to zoom the map"
            : "Use Ctrl + scroll to zoom the map",
        );
      });
    mapContainer
      .querySelectorAll(".maplibregl-mobile-message")
      .forEach((el) => {
        el.textContent = t("Use two fingers to move the map");
      });
  }
  function mapLocale() {
    return {
      "NavigationControl.ZoomIn": t("Zoom in"),
      "NavigationControl.ZoomOut": t("Zoom out"),
      "NavigationControl.ResetBearing": t("Reset bearing to north"),
      "FullscreenControl.Enter": t("Enter fullscreen"),
      "FullscreenControl.Exit": t("Exit fullscreen"),
      "AttributionControl.ToggleAttribution": t("Toggle attribution"),
      "Map.Title": t("Map"),
      "CooperativeGesturesHandler.WindowsHelpText": t(
        "Use Ctrl + scroll to zoom the map",
      ),
      "CooperativeGesturesHandler.MacHelpText": t(
        "Use ⌘ + scroll to zoom the map",
      ),
      "CooperativeGesturesHandler.MobileHelpText": t(
        "Use two fingers to move the map",
      ),
    };
  }
  document.addEventListener("fullscreenchange", () =>
    window.requestAnimationFrame(localizeMapControls),
  );

  let map;
  let leafletMap;
  let leafletLayer;
  let leafletHeat;
  const vehicleMarkers = new Map();
  const carSprites = createCarSprites();
  let traffic = null;
  let trafficLayer = null;
  let adExplorer = null;
  let activeScenes = [];
  let seekRequest = 0;
  let playbackToken = 0;
  let displayedVehicles = [];
  let streetCameraTarget = null;
  let pausedFraction = 0;
  let mapReady = false;
  if ("ResizeObserver" in window) {
    new window.ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        map?.resize();
        leafletMap?.invalidateSize({ pan: false });
      });
    }).observe(mapContainer);
  }
  const retryButton = document.querySelector("#mapRetry");
  const setBusy = (busy) => {
    state.loading = busy;
    mapContainer.parentElement.classList.toggle("is-loading", busy);
    mapContainer.setAttribute("aria-busy", String(busy));
    updateReplayNotice();
    document
      .querySelector(".di-map-kpis")
      .setAttribute("aria-busy", String(busy));
  };

  function updateReplayNotice() {
    const element=document.querySelector('#replayState'),hint=document.querySelector('#replayHint');
    const ad=key=>i18n.ad(key);
    document.querySelector('.di-playback').hidden=state.mode==='heatmap';
    document.querySelector('#mapStreet').hidden=state.mode==='heatmap';
    document.querySelector('#activeScene').hidden=state.mode==='heatmap';
    const sceneAction=document.querySelector('#activeScene');
    sceneAction.textContent=state.error?retryButton.textContent.trim():ad('activeScene')+' ↗';
    sceneAction.disabled=state.loading||(!state.error&&!activeScenes.length);
    if(state.loading){element.textContent=ad('loadingScene');hint.textContent='';return;}
    if(state.mode==='heatmap'){element.textContent=ad('densityTab');hint.textContent=ad('staticHint');return;}
    if(state.error){element.textContent=ad('loadFailure');hint.textContent='';return;}
    if(state.seeking){element.textContent=ad('buffering');hint.textContent='';return;}
    const playing=controls.play.getAttribute('aria-pressed')==='true';
    element.textContent=ad(state.step===state.frames.length-1?'ended':playing?'playing':'paused');
    const zoom=map?.getZoom()??leafletMap?.getZoom()??0;
    if(zoom<16){hint.textContent=ad('overviewHint');return;}
    let visible=displayedVehicles;
    if(map){const c=map.getCanvas();visible=visible.filter(v=>{const pt=map.project([v.lng,v.lat]);return pt.x>=0&&pt.y>=0&&pt.x<=c.clientWidth&&pt.y<=c.clientHeight;});}
    else if(leafletMap)visible=visible.filter(v=>leafletMap.getBounds().contains([v.lat,v.lng]));
    hint.textContent=ad(!visible.length?'emptyView':visible.every(v=>v.speed<.1)?'stoppedView':!playing?'resumeHint':'sceneNoteShort');
  }

  const zoneName = (zone = state.zone) => i18n.zoneLabel(zone);

  const setStatus = (message) => {
    if (controls.status) controls.status.textContent = message;
  };

  const formatTime = (seconds = 0) => {
    const safeSeconds = Math.max(0, Math.round(Number(seconds) || 0));
    const minutes = Math.floor(safeSeconds / 60);
    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(safeSeconds % 60).padStart(2, "0")
    );
  };

  const fetchJSON = async (path) => {
    if (!cache.has(path)) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 45000);
      cache.set(
        path,
        mobility
          .readJSON(i18n.asset(path), controller.signal)
          .catch((error) => {
            cache.delete(path);
            throw error;
          })
          .finally(() => window.clearTimeout(timeout)),
      );
      // Two heavy datasets plus the small teaching/navigation manifests.
      while (cache.size > 4) cache.delete(cache.keys().next().value);
    }
    return cache.get(path);
  };

  const loadLeaflet = async () => {
    if (!document.querySelector("link[data-leaflet-fallback]")) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = i18n.asset("leaflet.css");
      stylesheet.dataset.leafletFallback = "true";
      document.head.appendChild(stylesheet);
    }
    const loadScript = (src, name) =>
      new Promise((resolve, reject) => {
        document.querySelector("script[data-" + name + "]")?.remove();
        const script = document.createElement("script");
        script.src = i18n.asset(src);
        script.setAttribute("data-" + name, "true");
        script.onload = resolve;
        script.onerror = () => {
          script.remove();
          reject(new Error("Local map dependency failed: " + src));
        };
        document.head.appendChild(script);
      });
    if (!window.L)
      await loadScript("leaflet.js", "leaflet-fallback");
    if (!window.L?.heatLayer)
      await loadScript("leaflet-heat.js", "leaflet-heat");
    if (!window.L?.heatLayer)
      throw new Error("Local heatmap engine unavailable");
    return window.L;
  };

  const rasterStyle = {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors",
      },
    },
    layers: [
      {
        id: "night-background",
        type: "background",
        paint: { "background-color": "#0a1b2d" },
      },
      {
        id: "osm",
        type: "raster",
        source: "osm",
        paint: {
          "raster-saturation": -0.85,
          "raster-brightness-max": 0.62,
          "raster-contrast": 0.22,
        },
      },
    ],
  };

  const resolveStyle = async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4500);
    try {
      const response = await fetch(
        "https://tiles.openfreemap.org/styles/bright",
        { signal: controller.signal },
      );
      if (!response.ok) throw new Error("Vector style unavailable.");
      const { prepareStyle } = await import("./map-style.mjs");
      const style = prepareStyle(
        await response.json(),
        "https://tiles.openfreemap.org/styles/bright",
      );
      state.basemap = "vector";
      return style;
    } catch (error) {
      state.basemap = "raster";
      return rasterStyle;
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const toHeatGeoJSON = (points = []) => ({
    type: "FeatureCollection",
    features: points.map(([lat, lng, intensity], index) => ({
      type: "Feature",
      id: index,
      geometry: { type: "Point", coordinates: [lng, lat] },
      properties: { intensity: Number(intensity) || 0, index: index + 1 },
    })),
  });

  const toVehicleGeoJSON = (vehicles = []) => ({
    type: "FeatureCollection",
    features: vehicles.map((vehicle, index) => ({
      type: "Feature",
      id: index,
      geometry: { type: "Point", coordinates: [vehicle.lng, vehicle.lat] },
      properties: {
        id: String(vehicle.id),
        speed: Number(vehicle.speed) || 0,
        angle: Number(vehicle.angle) || 0,
        car: "car-" + paintIndex(vehicle.id),
        state: String(vehicle.state || "unknown"),
      },
    })),
  });

  const getBounds = (points = []) => {
    if (!points.length) return null;
    return points.reduce(
      (bounds, point) => {
        const lat = Number(point[0]);
        const lng = Number(point[1]);
        bounds[0][0] = Math.min(bounds[0][0], lng);
        bounds[0][1] = Math.min(bounds[0][1], lat);
        bounds[1][0] = Math.max(bounds[1][0], lng);
        bounds[1][1] = Math.max(bounds[1][1], lat);
        return bounds;
      },
      [
        [Infinity, Infinity],
        [-Infinity, -Infinity],
      ],
    );
  };

  const showInspector = (title, body) => {
    controls.inspectorTitle.textContent = title;
    controls.inspectorBody.textContent = body;
    controls.inspector.hidden = false;
  };
  const inspectVehicle = (id) => {
    const frame = state.frames[state.step];
    const vehicle = frame?.vehicles.find(vehicle => String(vehicle.id) === String(id));
    if (!vehicle) return;
    showInspector(message("vehicleTitle", vehicle.id), message("vehicleBody", i18n.number(vehicle.speed * 3.6), vehicle.state, formatTime(frame.time)));
  };

  const renderLeafletHeat = (points = []) => {
    if (!leafletMap || !leafletLayer || !window.L) return;
    leafletLayer.clearLayers();
    vehicleMarkers.clear();
    if (leafletHeat) leafletMap.removeLayer(leafletHeat);
    if (!window.L.heatLayer) throw new Error("Heatmap engine is unavailable");
    leafletHeat = window.L.heatLayer(points, {
      radius: 18,
      blur: 14,
      max: 1,
      maxZoom: 16,
      minOpacity: 0.08,
      gradient: {
        0.15: "#17364d",
        0.42: "#2e7d8f",
        0.69: "#d0a34b",
        1: "#b74922",
      },
    }).addTo(leafletMap);
  };

  const updateLeafletCar = (marker, vehicle) => {
    const sprite = marker.getElement()?.firstElementChild;
    if (!sprite) return;
    const metresPerPixel = 156543.03392 * Math.cos(vehicle.lat * Math.PI / 180) / 2 ** leafletMap.getZoom();
    const scale = Math.max(0.06, 5 / metresPerPixel / 38);
    sprite.style.backgroundImage = `url("${carSprites[paintIndex(vehicle.id)].url}")`;
    sprite.style.transform = `rotate(${Number(vehicle.angle) || 0}deg) scale(${scale})`;
  };

  const renderLeafletVehicles = (vehicles = []) => {
    if (!leafletMap || !leafletLayer || !window.L) return;
    if (leafletHeat) {
      leafletMap.removeLayer(leafletHeat);
      leafletHeat = null;
    }
    const active = new Set(vehicles.map((vehicle) => String(vehicle.id)));
    vehicleMarkers.forEach((marker, id) => {
      if (!active.has(id)) {
        leafletLayer.removeLayer(marker);
        vehicleMarkers.delete(id);
      }
    });
    vehicles.forEach((vehicle) => {
      const id = String(vehicle.id);
      const existing = vehicleMarkers.get(id);
      if (existing) {
        existing.currentVehicle = vehicle;
        existing.setLatLng([vehicle.lat, vehicle.lng]);
        updateLeafletCar(existing, vehicle);
        return;
      }
      const marker = window.L.marker([vehicle.lat, vehicle.lng], {
        icon: window.L.divIcon({
          className: "di-car-marker",
          html: '<span class="di-car-sprite" aria-hidden="true"></span>',
          iconSize: [24, 44],
          iconAnchor: [12, 22],
        }),
        title: message("vehicleTitle", id),
        keyboard: true,
        riseOnHover: true,
      });
      marker.currentVehicle = vehicle;
      marker.on("click", () => inspectVehicle(id));
      marker.addTo(leafletLayer);
      marker.getElement().setAttribute("role", "button");
      marker.getElement().setAttribute("aria-label", message("vehicleTitle", id));
      marker.on("keydown", ({ originalEvent }) => {
        if (originalEvent.key === "Enter" || originalEvent.key === " ") {
          originalEvent.preventDefault();
          originalEvent.stopPropagation();
          marker.fire("click");
        }
      });
      updateLeafletCar(marker, vehicle);
      vehicleMarkers.set(id, marker);
    });
  };

  let leafletRoads = null;
  const setRoadVisibility = (visible) => {
    ["sumo-road-surface", "sumo-road-edge"].forEach(id => setLayerVisibility(id, visible));
    if (leafletRoads && leafletMap) {
      if (visible && !leafletMap.hasLayer(leafletRoads)) leafletRoads.addTo(leafletMap);
      if (!visible && leafletMap.hasLayer(leafletRoads)) leafletMap.removeLayer(leafletRoads);
    }
  };
  const updateRoads = (network) => {
    const features = network.lanes.filter(lane => lane && lane.driveable !== false).map(lane => ({
      type: "Feature", properties: { width: lane.width, internal: lane.internal },
      geometry: { type: "LineString", coordinates: lane.shape.map(([x,y]) => toLngLat(x,y,network.origin,network.scale)) },
    }));
    const geojson = { type: "FeatureCollection", features };
    if (map) {
      map.getSource("sumo-roads").setData(geojson);
    } else if (leafletMap) {
      if (leafletRoads) leafletMap.removeLayer(leafletRoads);
      leafletRoads = window.L.geoJSON(geojson, { interactive: false, style: { color: "#536777", weight: 2, opacity: .35 } }).addTo(leafletMap);
    }
  };
  const focusStreet = () => {
    const focus = state.data?.focus;
    if (!focus) return;
    if (map) {
      map.stop();
      streetCameraTarget = { center: focus, zoom: window.innerWidth < 760 ? 18.8 : 18.6 };
      map.easeTo({ ...streetCameraTarget, pitch: state.perspective === "3d" ? 58 : 0, bearing: -18, duration: prefersReducedMotion ? 0 : 850 });
      map.once("moveend", () => { streetCameraTarget = null; });
    }
    else leafletMap?.setView([focus[1],focus[0]],18,{ animate: !prefersReducedMotion });
  };
  document.querySelector("#mapStreet")?.addEventListener("click", focusStreet);
  document.querySelector("#adStart")?.addEventListener("click", () => {
    if(state.mode !== "simulation" || !mapReady) document.querySelector('[data-map-mode="simulation"]').click();
    else {adExplorer?.select(adExplorer.selected,true);startPlayback();}
    mapContainer.scrollIntoView({block:"center"});
  });
  document.querySelector("#activeScene")?.addEventListener("click", async () => {
    if(state.error){retryButton.click();return;}
    if(!activeScenes.length||state.loading)return;
    const request=state.request;stopPlayback();
    const next=activeScenes.find(entry=>entry.time>state.step+5)||activeScenes[0];
    const pending=renderStep(next.time),seek=seekRequest;
    await pending;if(request!==state.request||seek!==seekRequest||state.error)return;
    focusStreet();if(!prefersReducedMotion)startPlayback();
  });
  document.querySelector("#mapOverview")?.addEventListener("click", () => focusBounds(state.data?.bounds || getBounds(state.data?.points || [])));

  const setLayerVisibility = (id, visible) => {
    if (state.engine === "maplibre" && map?.getLayer(id)) {
      map.setLayoutProperty(id, "visibility", visible ? "visible" : "none");
    }
  };

  const setPerspective = (perspective, animate = true) => {
    if (state.engine === "leaflet" || state.mode === "heatmap") perspective = "2d";
    state.perspective = perspective;
    controls.viewButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.mapView === perspective),
      );
      if (button.dataset.mapView === "3d") {
        button.disabled = state.engine === "leaflet" || state.mode === "heatmap";
        button.title =
          state.engine === "leaflet" ? message("webglRequired") : "";
      }
    });
    if (state.engine === "maplibre" && map) {
      const camera = {
        ...(streetCameraTarget || {}),
        pitch: perspective === "3d" ? 58 : 0,
        bearing: perspective === "3d" ? -18 : 0,
      };
      if (animate)
        map.easeTo({ ...camera, duration: prefersReducedMotion ? 0 : 850 });
      else map.jumpTo(camera);
      setLayerVisibility("city-buildings-3d", perspective === "3d");
    }
  };

  const stopPlayback = () => {
    if (state.timer !== null) window.cancelAnimationFrame(state.timer);
    state.timer = null;
    playbackToken++;
    controls.play.textContent = t("Play");
    controls.play.setAttribute("aria-pressed", "false");
    controls.play.setAttribute("aria-label", t("Play simulation"));
    updateReplayNotice();
  };

  const renderVehicles = (vehicles) => {
    displayedVehicles = vehicles;
    trafficLayer?.update(state.mode === "simulation" ? vehicles : []);
    if (state.engine === "maplibre") {
      const vehicleSource = map?.getSource("vehicles");
      if (!vehicleSource) return;
      if (!trafficLayer) vehicleSource.setData(toVehicleGeoJSON(vehicles));
    } else {
      renderLeafletVehicles(vehicles);
    }
  };

  const renderStep = async (requestedStep) => {
    if (!state.frames.length) return;
    const seek = ++seekRequest;
    const target = Math.max(0, Math.min(requestedStep, state.frames.length - 1));
    traffic?.pin(target);
    state.seeking=true;updateReplayNotice();
    try {
      if (traffic) await Promise.all([traffic.frame(target), traffic.frame(Math.min(target + 1, state.frames.length - 1))]);
    } catch (error) {
      if (seek === seekRequest) { state.seeking=false;state.error=true;stopPlayback(); controls.timeline.value = String(state.step); setStatus(message("dataError")); retryButton.hidden = false;updateReplayNotice(); }
      return;
    }
    if (seek !== seekRequest) return;
    state.seeking=false;state.error=false;retryButton.hidden=true;
    pausedFraction = 0;
    state.step = Math.max(0, Math.min(requestedStep, state.frames.length - 1));
    const frame = state.frames[state.step];
    recordPage = 0;
    renderRecords();
    renderVehicles(frame.vehicles);
    adExplorer?.frame(frame);
    trafficLayer?.setAdvertisingTime(frame.time);
    updateReplayNotice();
    controls.timeline.value = String(state.step);
    controls.currentTime.textContent = formatTime(frame.time);
    controls.timeline.setAttribute(
      "aria-valuetext",
      formatTime(frame.time) + " / " + formatTime(state.frames.at(-1)?.time),
    );
    controls.kpiPoints.textContent = numberFormatter.format(
      frame.vehicles.length,
    );
    controls.kpiPointsLabel.textContent = t("Vehicles this step");
    const stats = mobility.frameStats(frame.vehicles);
    controls.kpiSpeed.textContent =
      stats.meanSpeed === null ? "—" : i18n.number(stats.meanSpeed * 3.6) + " km/h";
  };

  const startPlayback = async () => {
    if (state.loading || state.seeking || state.error || state.mode !== "simulation" || !state.frames.length) return;
    stopPlayback();
    const token = playbackToken;
    if (state.step === state.frames.length - 1) await renderStep(0);
    if (token !== playbackToken) return;
    controls.play.textContent = t("Pause");
    controls.play.setAttribute("aria-pressed", "true");
    controls.play.setAttribute("aria-label", t("Pause simulation"));
    updateReplayNotice();
    const speed = Number(controls.speed.value) || 1;
    let started = performance.now() - pausedFraction * 1000 / speed, lastDraw = 0;
    const tick = async (now) => {
      if (token !== playbackToken) return;
      const frame = state.frames[state.step], next = state.frames[state.step + 1];
      if (!next) { stopPlayback(); return; }
      const fraction = Math.min(1, (now - started) * speed / 1000);
      if (fraction >= 1) {
        await renderStep(state.step + 1);
        if (token !== playbackToken) return;
        started = performance.now();
        if (state.step === state.frames.length - 1) { stopPlayback(); return; }
      } else if (!prefersReducedMotion && now - lastDraw >= 1000 / 30) {
        pausedFraction = fraction;
        renderVehicles(traffic.between(frame, next, fraction)); lastDraw = now;
      }
      if (token === playbackToken) state.timer = requestAnimationFrame(tick);
    };
    state.timer = requestAnimationFrame(tick);
  };

  const setPlaybackEnabled = (enabled) => {
    [
      controls.previous,
      controls.play,
      controls.next,
      controls.timeline,
      controls.speed,
    ].forEach((control) => {
      control.disabled = !enabled;
    });
    if (!enabled) stopPlayback();
  };

  const updateKPIs = (data, pointCount) => {
    controls.kpiPoints.textContent = numberFormatter.format(pointCount || 0);
    controls.kpiPointsLabel.textContent = t(
      state.mode === "heatmap" ? "Heat samples" : "Vehicles this step",
    );
    controls.kpiRecords.textContent = numberFormatter.format(
      state.exportStats?.records || 0,
    );
    const stats =
      state.mode === "simulation"
        ? mobility.frameStats(state.frames[state.step]?.vehicles || [])
        : null;
    controls.kpiSpeed.textContent =
      stats?.meanSpeed != null ? i18n.number(stats.meanSpeed * 3.6) + " km/h" : "—";
    controls.kpiSteps.textContent =
      state.mode === "simulation"
        ? numberFormatter.format(state.frames.length)
        : "—";
  };

  const simulationBounds = (data) => {
    let bounds = null;
    (data.timesteps || []).forEach((frame) => {
      (frame.vehicles || []).forEach(({ lat, lng }) => {
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
        if (!bounds)
          bounds = [
            [lng, lat],
            [lng, lat],
          ];
        bounds[0][0] = Math.min(bounds[0][0], lng);
        bounds[0][1] = Math.min(bounds[0][1], lat);
        bounds[1][0] = Math.max(bounds[1][0], lng);
        bounds[1][1] = Math.max(bounds[1][1], lat);
      });
    });
    return bounds;
  };

  const focusBounds = (bounds) => {
    if (!bounds) return;
    if (state.engine === "leaflet" && leafletMap) {
      leafletMap.fitBounds(
        [
          [bounds[0][1], bounds[0][0]],
          [bounds[1][1], bounds[1][0]],
        ],
        { padding: [35, 35], maxZoom: 15, animate: !prefersReducedMotion },
      );
      return;
    }
    if (!map) return;
    const camera = map.cameraForBounds(bounds, {
      padding: window.innerWidth < 760 ? 44 : 72,
      maxZoom: 15.25,
    });
    if (camera)
      map.easeTo({
        ...camera,
        pitch: state.perspective === "3d" ? 58 : 0,
        bearing: state.perspective === "3d" ? -18 : 0,
        duration: prefersReducedMotion ? 0 : 1000,
      });
  };

  const updateControls = () => {
    document.querySelector(".di-map-legend").dataset.mode = state.mode;
    controls.modeButtons.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.mapMode === state.mode),
      ),
    );
    controls.zoneButtons.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.mapZone === state.zone),
      ),
    );
    controls.zoneLabel.textContent = zoneName();
    controls.modeLabel.textContent = i18n.ad(state.mode === "heatmap" ? "densityTab" : "trafficTab");
    updateReplayNotice();
    controls.inspector.hidden = true;
    document.querySelector("#mapSourceHeat").href = i18n.asset(
      ZONES[state.zone].heatmap,
    );
    document.querySelector("#mapSourceSimulation").href = i18n.asset(
      state.zone + "_traffic.json",
    );
  };

  const loadActiveData = async () => {
    updateControls();
    if (!mapReady) return;
    seekRequest++;
    const request = ++state.request;
    const zone = ZONES[state.zone];
    const path = state.mode === "heatmap" ? zone.heatmap : zone.simulation;
    setPlaybackEnabled(false);
    state.data = null;
    state.frames = [];
    traffic = null;
    displayedVehicles=[];activeScenes=[];state.seeking=false;
    trafficLayer?.update([]);
    adExplorer?.clear();
    state.exportStats = null;
    recordPage = 0;
    renderRecords();
    [
      controls.kpiPoints,
      controls.kpiRecords,
      controls.kpiSpeed,
      controls.kpiSteps,
    ].forEach((element) => {
      element.textContent = "—";
    });
    if (state.engine === "leaflet") {
      leafletLayer.clearLayers();
      vehicleMarkers.clear();
      if (leafletHeat) {
        leafletMap.removeLayer(leafletHeat);
        leafletHeat = null;
      }
      if (leafletRoads) leafletMap.removeLayer(leafletRoads);
    } else {
      map.getSource("heat-points")?.setData(EMPTY_COLLECTION);
      map.getSource("vehicles")?.setData(EMPTY_COLLECTION);
      setRoadVisibility(false);
    }
    state.error = false;
    retryButton.hidden = true;
    setBusy(true);
    setStatus(
      message(
        state.mode === "heatmap" ? "loadingHeat" : "loadingSimulation",
        zoneName(),
      ),
    );
    try {
      let data;
      if (state.mode === "simulation") {
        const manifest = await fetchJSON(state.zone + "_traffic.json");
        const network = await fetchJSON(manifest.network);
        const adSites = await fetchJSON("advertising-sites.json");
        const scenes = await fetchJSON("active-scenes.json");
        if (request !== state.request) return;
        const readChunk = async (file) => {
          const response = await fetch(i18n.asset(file), { signal: AbortSignal.timeout(45000) });
          if (!response.ok) throw new Error("Traffic chunk unavailable");
          return response.json();
        };
        const candidate = new TrafficReplay(manifest, network, readChunk);
        candidate.pin(manifest.initialTime);
        await Promise.all([candidate.frame(manifest.initialTime), candidate.frame(manifest.initialTime + 1)]);
        if (request !== state.request) return;
        traffic=candidate;activeScenes=scenes.zones[manifest.zone]||[];
        trafficLayer?.setNetwork(manifest);
        updateRoads(network);
        adExplorer?.setSites(adSites.zones[manifest.zone], manifest);
        data = { ...manifest, timesteps: traffic.frames };
      } else data = await fetchJSON(path);
      if (request !== state.request) return;
      if (data.zone !== state.zone)
        throw new Error("Export zone does not match selected zone");
      state.exportStats = state.mode === "simulation" ? { records: data.records, frames: data.timesteps.length } : mobility.validate(data, state.mode);
      state.data = data;
      if (state.engine === "leaflet") {
        leafletLayer.clearLayers();
        vehicleMarkers.clear();
      }

      if (state.mode === "heatmap") {
        const points = data.points || [];
        if (state.engine === "maplibre") {
          map.getSource("heat-points").setData(toHeatGeoJSON(points));
          map.getSource("vehicles").setData(EMPTY_COLLECTION);
          setLayerVisibility("traffic-heat", true);
          setLayerVisibility("heat-samples", false);
          setLayerVisibility("vehicles", false);
          setRoadVisibility(false);
        } else {
          renderLeafletHeat(points);
        }
        state.frames = [];
        state.step = 0;
        controls.timeline.max = "0";
        controls.timeline.value = "0";
        controls.currentTime.textContent = "00:00";
        controls.totalTime.textContent = "00:00";
        controls.legend.textContent = message("heatLegend");
        updateKPIs(data, points.length);
        setPlaybackEnabled(false);
        focusBounds(getBounds(points));
      } else {
        state.frames = data.timesteps || [];
        state.step = data.initialTime || 0;
        if (state.engine === "maplibre") {
          map.getSource("heat-points").setData(EMPTY_COLLECTION);
          setLayerVisibility("traffic-heat", false);
          setLayerVisibility("heat-samples", false);
          setLayerVisibility("vehicles", !trafficLayer);
          setRoadVisibility(true);
        }
        controls.timeline.max = String(Math.max(0, state.frames.length - 1));
        controls.totalTime.textContent = formatTime(
          state.frames.at(-1)?.time || 0,
        );
        controls.legend.textContent = message("vehicleLegend");
        updateKPIs(data, state.frames[state.step]?.vehicles?.length || 0);
        setPlaybackEnabled(state.frames.length > 0);
        await renderStep(state.step);
        if(request!==state.request)return;
        focusStreet();
      }

      renderRecords();
      const baseMode =
        state.engine === "leaflet"
          ? message("compatibleBase")
          : state.basemap === "vector"
            ? message("vectorBase")
            : message("rasterBase");
      const interactionHint =
        state.mode === "heatmap" ? i18n.ad("staticHint") : state.engine === "leaflet"
          ? message("leafletHint")
          : message("maplibreHint");
      setStatus(message("loaded", zoneName(), baseMode, interactionHint));
    } catch (error) {
      if (request !== state.request) return;
      cache.delete(path);
      state.data = null;
      state.frames = [];
      state.error = true;
      retryButton.hidden = false;
      setStatus(message("dataError"));
      setPlaybackEnabled(false);
    } finally {
      if (request === state.request) {
        setBusy(false);
        if (
          state.playWhenReady &&
          state.mode === "simulation" &&
          state.data &&
          !prefersReducedMotion
        )
          startPlayback();
        state.playWhenReady = false;
      }
    }
  };

  const themeBaseMap = () => {
    if (state.basemap !== "vector") return;
    (map.getStyle().layers || []).forEach((layer) => {
      try {
        const id = layer.id.toLowerCase();
        if(layer.type==="symbol" && /poi|housenumber|transit|road_shield/.test(id))map.setLayoutProperty(layer.id,"visibility","none");
        if (layer.type === "background")
          map.setPaintProperty(layer.id, "background-color", "#0a1b2d");
        if (layer.type === "fill" && id.includes("water"))
          map.setPaintProperty(layer.id, "fill-color", "#0c3044");
        if (layer.type === "fill" && id.includes("building"))
          map.setPaintProperty(layer.id, "fill-color", "#203546");
        if (layer.type === "line" && /(road|transport|highway)/.test(id)) {
          map.setPaintProperty(
            layer.id,
            "line-color",
            /(motorway|trunk|primary)/.test(id) ? "#9a543b" : "#465866",
          );
        }
      } catch (error) {
        // Style layers differ between providers; unsupported cosmetic changes are safely skipped.
      }
    });
  };

  const addCityBuildings = () => {
    const sources = map.getStyle().sources || {};
    const source = sources.openmaptiles
      ? "openmaptiles"
      : sources.openfreemap
        ? "openfreemap"
        : null;
    if (!source) return;
    const labelLayer = (map.getStyle().layers || []).find(
      (layer) => layer.type === "symbol" && layer.layout?.["text-field"],
    );
    try {
      map.addLayer(
        {
          id: "city-buildings-3d",
          source,
          "source-layer": "building",
          type: "fill-extrusion",
          minzoom: 14,
          layout: {
            visibility: state.perspective === "3d" ? "visible" : "none",
          },
          paint: {
            "fill-extrusion-color": "#263d4e",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              14,
              0,
              15,
              ["coalesce", ["get", "render_height"], ["get", "height"], 0],
            ],
            "fill-extrusion-base": [
              "coalesce",
              ["get", "render_min_height"],
              ["get", "min_height"],
              0,
            ],
            "fill-extrusion-opacity": 0.24,
          },
        },
        labelLayer?.id,
      );
    } catch {
      // Some vector basemaps do not expose a building source.
    }
  };

  const addProjectLayers = () => {
    map.addSource("heat-points", { type: "geojson", data: EMPTY_COLLECTION });
    map.addSource("vehicles", { type: "geojson", data: EMPTY_COLLECTION });

    map.addLayer({
      id: "traffic-heat",
      type: "heatmap",
      source: "heat-points",
      maxzoom: 24,
      paint: {
        "heatmap-weight": ["get", "intensity"],
        "heatmap-intensity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          11,
          0.9,
          16,
          2.25,
        ],
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 11, 12, 16, 32, 20, 80],
        "heatmap-opacity": 0.76,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(10,27,45,0)",
          0.18,
          "#17364d",
          0.42,
          "#2e7d8f",
          0.69,
          "#d0a34b",
          1,
          "#b74922",
        ],
      },
    });

    map.addLayer({
      id: "heat-samples",
      type: "circle",
      source: "heat-points",
      minzoom: 15,
      layout: {visibility: "none"},
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 15, 2.2, 17, 5],
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", "intensity"],
          0.1,
          "#2e7d8f",
          0.28,
          "#d0a34b",
          0.45,
          "#b74922",
        ],
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 0.6,
        "circle-opacity": 0.75,
      },
    });

    Object.entries(carSprites).forEach(([key, sprite]) => {
      map.addImage("car-" + key, sprite.image, { pixelRatio: 2 });
    });
    map.addLayer({
      id: "vehicles",
      type: "symbol",
      source: "vehicles",
      layout: {
        visibility: "none",
        "icon-image": ["get", "car"],
        "icon-size": ["interpolate", ["linear"], ["zoom"], 12, 0.4, 15, 0.65, 17, 1, 19, 1.2],
        "icon-rotate": ["get", "angle"],
        "icon-rotation-alignment": "map",
        "icon-pitch-alignment": "map",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
    });
  };

  const bindMapInteractions = () => {
    ["vehicles", "heat-samples"].forEach((layer) => {
      map.on("mouseenter", layer, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", layer, () => {
        map.getCanvas().style.cursor = "";
      });
    });

    map.on("click", (event) => {
      if (state.mode !== "simulation" || !displayedVehicles.length) return;
      let closest = null, distance = 400;
      for (const vehicle of displayedVehicles) {
        const point = map.project([vehicle.lng,vehicle.lat]);
        const d = (point.x-event.point.x)**2 + (point.y-event.point.y)**2;
        if (d < distance) { closest = vehicle; distance = d; }
      }
      if (closest) inspectVehicle(closest.id);
    });

    const inspectDensity = (event) => {
      const properties = event.features?.[0]?.properties;
      if (!properties) return;
      showInspector(
        message("densityTitle"),
        message(
          "densityBody",
          i18n.number(Number(properties.intensity)),
          zoneName(),
        ),
      );
    };
    // Raw samples remain accessible in the table, not as point markers.
  };

  controls.modeButtons.forEach((button) =>
    button.addEventListener("click", () => {
      if (!mapReady) initialiseMap();
      if (button.dataset.mapMode === state.mode) { if(state.mode==="simulation") {if(mapReady){if(state.error)loadActiveData();else startPlayback();}else state.playWhenReady=true;} return; }
      state.mode = button.dataset.mapMode;
      if(state.mode === "heatmap")setPerspective("2d",false);
      if (state.mode === "simulation") {
        if (mapReady) setPerspective(state.engine === "maplibre" ? "3d" : "2d");
        else state.perspective = "3d";
      }
      state.playWhenReady = state.mode === "simulation";
      mapContainer.parentElement.scrollIntoView?.({
        block: "start",
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      loadActiveData();
    }),
  );

  controls.zoneButtons.forEach((button) =>
    button.addEventListener("click", () => {
      if (!mapReady) initialiseMap();
      if (button.dataset.mapZone === state.zone) return;
      state.zone = button.dataset.mapZone;
      state.playWhenReady = controls.play.getAttribute('aria-pressed') === 'true';
      loadActiveData();
    }),
  );

  controls.viewButtons.forEach((button) =>
    button.addEventListener("click", () =>
      setPerspective(button.dataset.mapView),
    ),
  );
  controls.previous.addEventListener("click", () => {
    stopPlayback();
    renderStep(state.step - 1);
  });
  controls.next.addEventListener("click", () => {
    stopPlayback();
    renderStep(state.step + 1);
  });
  controls.play.addEventListener("click", () =>
    state.timer ? stopPlayback() : startPlayback(),
  );
  controls.timeline.addEventListener("input", () => {
    stopPlayback();
    renderStep(Number(controls.timeline.value));
  });
  controls.speed.addEventListener("change", () => {
    if (state.timer) startPlayback();
  });
  controls.inspectorClose.addEventListener("click", () => {
    controls.inspector.hidden = true;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopPlayback();
  });
  retryButton.addEventListener("click", () => {
    retryButton.hidden = true;
    if (mapReady) loadActiveData();
    else initialiseMap();
  });

  const initialiseCompatibleMap = async () => {
    mapReady = false;
    state.engine = "leaflet";
    state.basemap = "raster";
    state.perspective = "2d";
    map?.remove();
    trafficLayer = null;
    map = undefined;
    leafletMap?.remove();
    leafletMap = undefined;
    mapContainer.replaceChildren();
    mapContainer.classList.remove("is-fallback");

    try {
      let fallbackTimeout;
      let Leaflet;
      try {
        Leaflet = await Promise.race([
          loadLeaflet(),
          new Promise((_, reject) => {
            fallbackTimeout = window.setTimeout(
              () => reject(new Error("Compatible map timeout")),
              15000,
            );
          }),
        ]);
      } finally {
        window.clearTimeout(fallbackTimeout);
      }
      leafletMap = Leaflet.map(mapContainer, {
        center: [ZONES[state.zone].center[1], ZONES[state.zone].center[0]],
        zoom: 13,
        preferCanvas: true,
        zoomControl: true,
        scrollWheelZoom: false,
        touchZoom: true,
        attributionControl: true,
      });
      Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(leafletMap);
      leafletLayer = Leaflet.layerGroup().addTo(leafletMap);
      leafletMap.on("moveend",updateReplayNotice);
      adExplorer?.destroy();
      adExplorer = new AdvertisingExplorer({leafletMap});
      leafletMap.on("zoomend", () => vehicleMarkers.forEach(marker => updateLeafletCar(marker, marker.currentVehicle)));
      leafletMap.on("click", (event) => {
        if (state.mode !== "heatmap" || !state.data) return;
        const target = leafletMap.latLngToContainerPoint(event.latlng);
        let nearest = null,
          best = 144;
        for (const point of state.data.points) {
          const screen = leafletMap.latLngToContainerPoint([
            point[0],
            point[1],
          ]);
          const distance =
            (screen.x - target.x) ** 2 + (screen.y - target.y) ** 2;
          if (distance < best) {
            best = distance;
            nearest = point;
          }
        }
        if (nearest)
          showInspector(
            message("densityTitle"),
            message("densityBody", i18n.number(nearest[2]), zoneName()),
          );
      });
      mapReady = true;
      localizeMapControls();
      setPerspective("2d", false);
      setStatus(message("fallbackActive"));
      await loadActiveData();
    } catch {
      mapReady = false;
      document.querySelector("script[data-leaflet-fallback]")?.remove();
      mapContainer.classList.add("is-fallback");
      mapContainer.textContent = message("mapUnavailable");
      setStatus(message("mapUnavailableStatus"));
      setPlaybackEnabled(false);
      retryButton.hidden = false;
    }
  };

  let initializing = false;
  const initialiseMap = async () => {
    if (initializing || mapReady) return;
    initializing = true;
    setBusy(true);setStatus(i18n.ad("loadingScene"));
    if (supportsWebGL2 && !maplibregl) {
      try {
        let engineTimeout;
        try {
          maplibregl = await Promise.race([
            import("./maplibre-gl.mjs"),
            new Promise((_, reject) => {
              engineTimeout = window.setTimeout(
                () => reject(new Error("Map engine timeout")),
                12000,
              );
            }),
          ]);
        } finally {
          window.clearTimeout(engineTimeout);
        }
      } catch {
        // The compatible map below handles browsers without the vector engine.
      }
    }
    state.engine = maplibregl ? "maplibre" : "leaflet";
    if (!maplibregl) {
      await initialiseCompatibleMap();
      initializing = false;
      return;
    }
    try {
      const { Traffic3D } = await import("./traffic-3d.js");
      const style = await resolveStyle();
      map = new maplibregl.Map({
        container: mapContainer,
        style,
        center: ZONES[state.zone].center,
        zoom: 13.2,
        pitch: 58,
        bearing: -18,
        antialias: true,
        cooperativeGestures: true,
        attributionControl: true,
        locale: mapLocale(),
      });
      map.addControl(
        new maplibregl.NavigationControl({ visualizePitch: true }),
        "top-right",
      );
      map.addControl(new maplibregl.FullscreenControl({ container: mapContainer.parentElement }), "top-right");
      map.addControl(
        new maplibregl.ScaleControl({ unit: "metric" }),
        "bottom-left",
      );
      map.touchZoomRotate.enable();
      map.touchZoomRotate.enableRotation();
      map.touchPitch?.enable();

      await new Promise((resolve, reject) => {
        const startupTimeout = window.setTimeout(
          () => reject(new Error("3D map startup timeout")),
          20000,
        );
        map.once("load", () => {
          window.clearTimeout(startupTimeout);
          try {
            themeBaseMap();
            addCityBuildings();
            addProjectLayers();
            map.addSource("sumo-roads", { type: "geojson", data: EMPTY_COLLECTION });
            const roadWidth = ["interpolate",["exponential",2],["zoom"],14,["*",["get","width"],0.126],20,["*",["get","width"],8.08]];
            const before = map.getLayer("city-buildings-3d") ? "city-buildings-3d" : "vehicles";
            map.addLayer({id:"sumo-road-edge",type:"line",source:"sumo-roads",minzoom:16,layout:{visibility:"none","line-join":"round","line-cap":"round"},paint:{"line-color":"#6c7b83","line-width":["interpolate",["exponential",2],["zoom"],14,["*",["+",["get","width"],.35],.126],20,["*",["+",["get","width"],.35],8.08]]}},before);
            map.addLayer({id:"sumo-road-surface",type:"line",source:"sumo-roads",minzoom:16,layout:{visibility:"none","line-join":"round","line-cap":"round"},paint:{"line-color":"#344551","line-width":roadWidth}},before);
            trafficLayer = new Traffic3D(maplibregl);
            map.addLayer(trafficLayer);
            adExplorer?.destroy();
            adExplorer = new AdvertisingExplorer({map,maplibre:maplibregl,layer:trafficLayer,onFocus:()=>{}});
            map.on("moveend",updateReplayNotice);
            bindMapInteractions();
            setPerspective(state.perspective, false);
            mapReady = true;
            localizeMapControls();
            loadActiveData();
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      await initialiseCompatibleMap();
    } finally {
      initializing = false;
    }
  };

  setPlaybackEnabled(false);
  if ("IntersectionObserver" in window) {
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          initialiseMap();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(mapContainer);
  } else {
    initialiseMap();
  }
})();
