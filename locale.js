(() => {
  "use strict";

  const language = document.documentElement.lang || "en";
  const localeCode = { en: "en", fr: "fr-FR", ar: "ar-AE" }[language] || "en";
  const root = new URL("./", document.baseURI);

  const copy = {
    en: {
      "Menu": "Menu",
      "Open navigation": "Open navigation",
      "Close": "Close",
      "Close navigation": "Close navigation",
      "Source weight": "Source weight",
      "Speed (m/s)": "Speed (m/s)",
      "Load a layer to view its records.": "Load a layer to view its records.",
      "Zoom in": "Zoom in",
      "Zoom out": "Zoom out",
      "Reset bearing to north": "Reset bearing to north",
      "Enter fullscreen": "Enter fullscreen",
      "Exit fullscreen": "Exit fullscreen",
      "Toggle attribution": "Toggle attribution",
      "Map": "Map",
      "Use Ctrl + scroll to zoom the map": "Use Ctrl + scroll to zoom the map",
      "Use ⌘ + scroll to zoom the map": "Use ⌘ + scroll to zoom the map",
      "Use two fingers to move the map": "Use two fingers to move the map",
      "Vehicles this step": "Vehicles this step",
      "Play": "Play",
      "Pause": "Pause",
      "Play simulation": "Play simulation",
      "Pause simulation": "Pause simulation",
      "Heat samples": "Heat samples",
      "Weighted SUMO samples": "Weighted SUMO samples",
      "Play SUMO vehicles": "Play SUMO vehicles"
    },
    fr: {
      "Menu": "Menu",
      "Open navigation": "Ouvrir la navigation",
      "Close": "Fermer",
      "Close navigation": "Fermer la navigation",
      "Source weight": "Poids source",
      "Speed (m/s)": "Vitesse (m/s)",
      "Load a layer to view its records.": "Chargez une couche pour consulter ses observations.",
      "Zoom in": "Zoom avant",
      "Zoom out": "Zoom arrière",
      "Reset bearing to north": "Orienter vers le nord",
      "Enter fullscreen": "Plein écran",
      "Exit fullscreen": "Quitter le plein écran",
      "Toggle attribution": "Afficher les crédits",
      "Map": "Carte",
      "Use Ctrl + scroll to zoom the map": "Utilisez Ctrl + défilement pour zoomer sur la carte",
      "Use ⌘ + scroll to zoom the map": "Utilisez ⌘ + défilement pour zoomer sur la carte",
      "Use two fingers to move the map": "Utilisez deux doigts pour déplacer la carte",
      "Vehicles this step": "Véhicules à cette étape",
      "Play": "Lecture",
      "Pause": "Pause",
      "Play simulation": "Lancer la simulation",
      "Pause simulation": "Mettre la simulation en pause",
      "Heat samples": "Échantillons de densité",
      "Weighted SUMO samples": "Échantillons SUMO pondérés",
      "Play SUMO vehicles": "Lire les véhicules SUMO"
    },
    ar: {
      "Menu": "القائمة",
      "Open navigation": "فتح قائمة التنقل",
      "Close": "إغلاق",
      "Close navigation": "إغلاق قائمة التنقل",
      "Source weight": "وزن المصدر",
      "Speed (m/s)": "السرعة (م/ث)",
      "Load a layer to view its records.": "حمّل طبقة لعرض سجلاتها.",
      "Zoom in": "تكبير",
      "Zoom out": "تصغير",
      "Reset bearing to north": "توجيه الخريطة نحو الشمال",
      "Enter fullscreen": "ملء الشاشة",
      "Exit fullscreen": "الخروج من ملء الشاشة",
      "Toggle attribution": "عرض الإسناد",
      "Map": "الخريطة",
      "Use Ctrl + scroll to zoom the map": "استخدم Ctrl مع التمرير لتكبير الخريطة",
      "Use ⌘ + scroll to zoom the map": "استخدم ⌘ مع التمرير لتكبير الخريطة",
      "Use two fingers to move the map": "استخدم إصبعين لتحريك الخريطة",
      "Vehicles this step": "المركبات في هذه الخطوة",
      "Play": "تشغيل",
      "Pause": "إيقاف مؤقت",
      "Play simulation": "تشغيل المحاكاة",
      "Pause simulation": "إيقاف المحاكاة مؤقتًا",
      "Heat samples": "عينات الكثافة",
      "Weighted SUMO samples": "عينات SUMO الموزونة",
      "Play SUMO vehicles": "تشغيل مركبات SUMO"
    }
  };

  const zones = {
    en: { maarif: "Maârif", hay_hassani: "Hay Hassani", ben_msick: "Ben M’Sick", sidi_maarouf: "Sidi Maârouf", bd_mohammed_v: "Bd Mohammed V" },
    fr: { maarif: "Maârif", hay_hassani: "Hay Hassani", ben_msick: "Ben M’Sick", sidi_maarouf: "Sidi Maârouf", bd_mohammed_v: "Bd Mohammed V" },
    ar: { maarif: "المعاريف", hay_hassani: "الحي الحسني", ben_msick: "ابن مسيك", sidi_maarouf: "سيدي معروف", bd_mohammed_v: "شارع محمد الخامس" }
  };

  const vehicleStates = {
    en: { slow: "slow", medium: "medium", fast: "fast", unknown: "unknown" },
    fr: { slow: "lente", medium: "modérée", fast: "rapide", unknown: "inconnue" },
    ar: { slow: "بطيئة", medium: "متوسطة", fast: "سريعة", unknown: "غير معروفة" }
  };

  const messages = {
    en: {
      densityTitle: "Original weighted sample",
      densityBody: (weight, zone) => `Export weight ${weight} · ${zone} · weighting formula not supplied`,
      vehicleTitle: (id) => `Vehicle ${id}`,
      vehicleBody: (speed, state, time) => `${speed} m/s · ${state} speed · ${time}`,
      heatLegend: "Lower → higher weighted sample concentration; colour depends on zoom",
      vehicleLegend: "Speed: red < 3 m/s · gold 3–<8 m/s · blue ≥ 8 m/s",
      loadingHeat: (zone) => `Loading ${zone} density samples…`,
      loadingSimulation: (zone) => `Loading ${zone} simulation frames…`,
      compatibleBase: "compatible 2D map",
      vectorBase: "vector basemap",
      rasterBase: "raster basemap fallback",
      leafletHint: "drag, pinch, zoom, or inspect a point",
      maplibreHint: "drag, pinch, rotate, or inspect a point",
      loaded: (zone, base, hint) => `${zone} · ${base} · ${hint}`,
      dataError: "The project data could not be loaded. Check your connection, then select Retry map.",
      fallbackActive: "Compatible 2D map active · vehicle playback remains available",
      mapUnavailable: "The map engines could not start. Confirm that JavaScript is enabled and open the portfolio through GitHub Pages.",
      mapUnavailableStatus: "Interactive map unavailable",
      webglRequired: "3D requires WebGL2; compatible 2D mode is active.",
      recordRange: (start, end, total) => `Records ${start}–${end} of ${total}`
    },
    fr: {
      densityTitle: "Échantillon pondéré original",
      densityBody: (weight, zone) => `Poids dans l’export : ${weight} · ${zone} · formule non fournie`,
      vehicleTitle: (id) => `Véhicule ${id}`,
      vehicleBody: (speed, state, time) => `${speed} m/s · vitesse ${state} · ${time}`,
      heatLegend: "Concentration pondérée faible → élevée ; la couleur dépend du zoom",
      vehicleLegend: "Vitesse : rouge < 3 m/s · or 3–<8 m/s · bleu ≥ 8 m/s",
      loadingHeat: (zone) => `Chargement des échantillons de densité de ${zone}…`,
      loadingSimulation: (zone) => `Chargement des images de simulation de ${zone}…`,
      compatibleBase: "carte 2D compatible",
      vectorBase: "fond de carte vectoriel",
      rasterBase: "fond de carte raster de secours",
      leafletHint: "faites glisser, pincez, zoomez ou inspectez un point",
      maplibreHint: "faites glisser, pincez, pivotez ou inspectez un point",
      loaded: (zone, base, hint) => `${zone} chargé · ${base} · ${hint}`,
      dataError: "Les données du projet n’ont pas pu être chargées. Vérifiez votre connexion, puis sélectionnez Réessayer la carte.",
      fallbackActive: "Carte 2D compatible active · la lecture des véhicules reste disponible",
      mapUnavailable: "Les moteurs cartographiques n’ont pas pu démarrer. Vérifiez que JavaScript est activé et ouvrez le portfolio via GitHub Pages.",
      mapUnavailableStatus: "Carte interactive indisponible",
      webglRequired: "La 3D nécessite WebGL2 ; le mode 2D compatible est actif.",
      recordRange: (start, end, total) => `Observations ${start}–${end} sur ${total}`
    },
    ar: {
      densityTitle: "عينة موزونة أصلية",
      densityBody: (weight, zone) => `وزن التصدير ${weight} · ${zone} · المعادلة غير مرفقة`,
      vehicleTitle: (id) => `المركبة ${id}`,
      vehicleBody: (speed, state, time) => `${speed} م/ث · سرعة ${state} · ${time}`,
      heatLegend: "تركّز موزون منخفض إلى مرتفع؛ يعتمد اللون على التكبير",
      vehicleLegend: "السرعة: أحمر: \u2066< 3 m/s\u2069 · ذهبي: \u20663–<8 m/s\u2069 · أزرق: \u2066≥ 8 m/s\u2069",
      loadingHeat: (zone) => `جارٍ تحميل عينات الكثافة لمنطقة ${zone}…`,
      loadingSimulation: (zone) => `جارٍ تحميل إطارات المحاكاة لمنطقة ${zone}…`,
      compatibleBase: "خريطة ثنائية الأبعاد متوافقة",
      vectorBase: "خريطة أساس متجهية",
      rasterBase: "خريطة نقطية احتياطية",
      leafletHint: "اسحب أو قرّب أو كبّر أو افحص نقطة",
      maplibreHint: "اسحب أو قرّب أو أدر الخريطة أو افحص نقطة",
      loaded: (zone, base, hint) => `تم تحميل ${zone} · ${base} · ${hint}`,
      dataError: "تعذر تحميل بيانات المشروع. تحقق من اتصالك، ثم اختر إعادة تحميل الخريطة.",
      fallbackActive: "الخريطة الثنائية الأبعاد المتوافقة نشطة · تشغيل حركة المركبات متاح",
      mapUnavailable: "تعذر تشغيل محركات الخرائط. تأكد من تفعيل JavaScript وافتح ملف الأعمال عبر GitHub Pages.",
      mapUnavailableStatus: "الخريطة التفاعلية غير متاحة",
      webglRequired: "يتطلب العرض الثلاثي الأبعاد WebGL2؛ الوضع الثنائي المتوافق نشط.",
      recordRange: (start, end, total) => `السجلات ${start}–${end} من ${total}`
    }
  };

  const t = (source) => copy[language]?.[source] ?? source;
  const number = (value, digits = 2) => new Intl.NumberFormat(localeCode, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);

  window.PORTFOLIO_I18N = {
    t,
    message(key, ...args) {
      const value = messages[language]?.[key];
      return typeof value === "function" ? value(...args) : (value ?? "");
    },
    asset: (name) => new URL(name, root).href,
    zoneLabel: (zone) => zones[language]?.[zone] || zone,
    vehicleState: (state) => vehicleStates[language]?.[state] || vehicleStates[language]?.unknown || state,
    numberFormatter: () => new Intl.NumberFormat(localeCode, { notation: "compact", maximumFractionDigits: 1 }),
    number,
    get language() { return language; }
  };

  // Keep the visitor's current section when switching between the three static language pages.
  document.querySelectorAll('.di-language-switcher a[hreflang]').forEach((link) => {
    const base = link.getAttribute("href");
    link.addEventListener("click", () => {
      if (!location.hash) return;
      const target = new URL(base, document.baseURI);
      target.hash = location.hash;
      link.href = target.href;
    });
  });
})();
