(() => {
  'use strict';

  const SUPPORTED = ['en', 'fr', 'ar'];
  const COPY = {
    fr: {
      'Retry map': 'Réessayer la carte',
      'Skip to main content': 'Aller au contenu principal',
      'Menu': 'Menu',
      'Close': 'Fermer',
      'Profile': 'Profil',
      'Research': 'Recherche',
      'Experience': 'Expérience',
      'Methods': 'Méthodes',
      'Contact': 'Contact',
      'American University of Sharjah · School of Business Administration': 'American University of Sharjah · School of Business Administration',
      'Evidence for better economic decisions.': 'Des données probantes pour de meilleures décisions économiques.',
      'M.Sc. Economics & Policy Candidate · Graduate Research Assistant': 'Étudiant au M.Sc. Economics and Policy · Assistant de recherche (GRA)',
      'I work across applied economics, policy analysis, financial modelling, and data analytics—turning complex evidence into clear, defensible decisions.': 'Je travaille à l’intersection de l’économie appliquée, de l’analyse des politiques publiques, de la modélisation financière et de l’analyse de données, afin de transformer des éléments complexes en décisions claires et défendables.',
      'View case studies': 'Voir les études de cas',
      'Academic CV': 'CV académique',
      'Sharjah, United Arab Emirates': 'Sharjah, Émirats arabes unis',
      'Economics · Policy · Decision Intelligence': 'Économie · Politiques publiques · Intelligence décisionnelle',
      'Economic Theory': 'Théorie économique',
      'Structure · Incentives · Equilibrium': 'Structure · Incitations · Équilibre',
      'Quantitative Methods': 'Méthodes quantitatives',
      'Identification · Estimation · Validation': 'Identification · Estimation · Validation',
      'Policy & Decision Analysis': 'Analyse des politiques publiques et de la décision',
      'Evidence · Trade-offs · Impact': 'Données probantes · Arbitrages · Impact',
      'Selected work': 'Travaux sélectionnés',
      'Research &': 'Recherche et',
      'case studies.': 'études de cas.',
      'Applied work that connects economic reasoning, structured analysis, and business evidence. Each case begins with a decision—not a tool.': 'Des travaux appliqués qui relient raisonnement économique, analyse structurée et données opérationnelles. Chaque étude part d’une décision — et non d’un outil.',
      '01 / Interactive analysis': '01 / Analyse interactive',
      'Casablanca Mobility Explorer': 'Explorateur de la mobilité à Casablanca',
      'Decision question:': 'Question décisionnelle :',
      'Where does simulated congestion concentrate, and how does vehicle flow change across five urban zones?': 'Où se concentre la congestion simulée et comment les flux de véhicules évoluent-ils dans cinq zones urbaines ?',
      'SUMO simulation': 'Simulation SUMO',
      'Spatial analytics': 'Analyse spatiale',
      'Scenario playback': 'Lecture de scénarios',
      'Analysis layer': 'Couche d’analyse',
      'Congestion heatmap': 'Carte de densité de la congestion',
      'Vehicle simulation': 'Simulation des véhicules',
      'vehicle simulation': 'simulation des véhicules',
      'Casablanca zone': 'Zone de Casablanca',
      'Heat samples': 'Échantillons de densité',
      'Vehicles this step': 'Véhicules à cette étape',
      'Displayed records': 'Observations affichées',
      'Average speed': 'Vitesse moyenne',
      'Simulation steps': 'Étapes de simulation',
      'Georeferenced SUMO/QGIS project output, reduced for the web. This is simulated evidence—not a live traffic feed. Tap a vehicle or density point to inspect it.': 'Données géoréférencées du projet SUMO/QGIS, allégées pour le Web. Il s’agit d’une simulation, et non d’un flux de trafic en direct. Touchez un véhicule ou un point de densité pour l’examiner.',
      'Read project paper': 'Lire l’étude du projet',
      'congestion heatmap': 'carte de densité de la congestion',
      'Preparing the map…': 'Préparation de la carte…',
      'Legend': 'Légende',
      'Lower density → higher density': 'Densité faible → densité élevée',
      'Map detail': 'Détail cartographique',
      'Play': 'Lecture',
      'Pause': 'Pause',
      'Speed': 'Vitesse',
      '02 / Performance analytics': '02 / Analyse de la performance',
      'Debt-Recovery Performance Analytics': 'Analyse de la performance du recouvrement',
      'How can a recovery portfolio be segmented so attention follows financial impact and collection urgency?': 'Comment segmenter un portefeuille de recouvrement afin d’orienter l’attention selon l’impact financier et l’urgence d’encaissement ?',
      'Monitor': 'Surveiller',
      'Review': 'Examiner',
      'Prioritise': 'Prioriser',
      'Portfolio segmentation': 'Segmentation de portefeuille',
      'KPI design': 'Conception des KPI',
      'Experience-based case study. Commercial figures are abstracted to protect client confidentiality.': 'Étude de cas fondée sur l’expérience. Les données commerciales sont volontairement abstraites afin de protéger la confidentialité du client.',
      'See related experience': 'Voir l’expérience associée',
      '03 / Investment appraisal': '03 / Évaluation d’investissement',
      'OOH vs DOOH Investment Appraisal': 'Évaluation de l’investissement OOH vs DOOH',
      'Which format creates stronger long-term value once capital, operating cost, and uncertainty are included?': 'Quel format crée le plus de valeur à long terme lorsque le capital, les coûts d’exploitation et l’incertitude sont pris en compte ?',
      'Capital intensity': 'Intensité capitalistique',
      'Compared': 'Comparée',
      'Operating model': 'Modèle opérationnel',
      'Five-year view': 'Horizon de cinq ans',
      'Uncertainty': 'Incertitude',
      'Sensitivity tested': 'Testée par analyse de sensibilité',
      'NPV': 'VAN (NPV)',
      'Sensitivity testing': 'Analyse de sensibilité',
      'View thesis analysis': 'Consulter l’analyse du mémoire',
      'Decision-first': 'Décision d’abord',
      'Frame the choice before the model': 'Définir le choix avant le modèle',
      'Traceable': 'Traçable',
      'Make assumptions visible': 'Rendre les hypothèses visibles',
      'Comparative': 'Comparatif',
      'Test alternatives and trade-offs': 'Tester les options et leurs arbitrages',
      'Communicable': 'Clair et exploitable',
      'Translate evidence into action': 'Transformer les données probantes en action',
      'From analysis': 'De l’analyse',
      'to action.': 'à l’action.',
      'A progression from financial reporting and performance analysis toward research-led economic and policy work.': 'Un parcours allant du reporting financier et de l’analyse de la performance vers des travaux économiques et de politiques publiques fondés sur la recherche.',
      '2026 — Present': '2026 — Aujourd’hui',
      'Graduate Research Assistant': 'Assistant de recherche (GRA)',
      'Supporting faculty research at the School of Business Administration while developing applied economic and quantitative research capabilities through the MSEP program.': 'Appui aux travaux de recherche du corps professoral de la School of Business Administration, tout en développant des compétences en recherche économique appliquée et quantitative dans le cadre du programme MSEP.',
      'Feb — Aug 2026': 'Févr. — août 2026',
      'Business Analyst · Financial Performance': 'Business Analyst · Performance financière',
      'Analysed recovery portfolios, monitored outstanding balances, and built reporting views to support case prioritisation and performance conversations.': 'Analyse de portefeuilles de recouvrement, suivi des encours et création de vues de reporting pour faciliter la priorisation des dossiers et le pilotage de la performance.',
      'May — Jul 2025': 'Mai — juill. 2025',
      'Business Analyst · Performance & Investment': 'Business Analyst · Performance et investissement',
      'Compared investment scenarios using financial models and structured market evidence, translating findings into decision-ready recommendations.': 'Comparaison de scénarios d’investissement au moyen de modèles financiers et de données de marché structurées, puis traduction des résultats en recommandations directement exploitables.',
      'Jul — Aug 2024': 'Juill. — août 2024',
      'Analysis & Reporting Intern': 'Stagiaire en analyse et reporting',
      'Supported recurring analysis and reporting, strengthened data quality checks, and helped turn operational information into clearer performance visibility.': 'Contribution aux analyses et reportings récurrents, renforcement des contrôles de qualité des données et transformation de l’information opérationnelle en indicateurs de performance plus lisibles.',
      'Education': 'Formation',
      'Built across disciplines.': 'Un parcours pluridisciplinaire.',
      '2026 — Present · Sharjah': '2026 — Aujourd’hui · Sharjah',
      'M.Sc. Economics and Policy': 'M.Sc. en économie et politiques publiques',
      '2025 — 2026 · Lyon': '2025 — 2026 · Lyon',
      'M.Sc. Procurement & Supply Chain Management': 'M.Sc. en achats et gestion de la chaîne logistique',
      '2022 — 2025 · Casablanca': '2022 — 2025 · Casablanca',
      'Bachelor in Management, Finance & Accounting': 'Licence en management, finance et comptabilité',
      'Université Internationale de Casablanca · High honors': 'Université Internationale de Casablanca · Mention Très bien',
      'Methods & tools': 'Méthodes et outils',
      'Rigour is': 'La rigueur est',
      'a working habit.': 'une habitude de travail.',
      'Tools matter when they make assumptions clearer, comparisons fairer, and conclusions more useful to the people making the decision.': 'Les outils sont utiles lorsqu’ils rendent les hypothèses plus explicites, les comparaisons plus équitables et les conclusions plus pertinentes pour les décideurs.',
      'Economic & policy reasoning': 'Raisonnement économique et politiques publiques',
      'Policy evaluation': 'Évaluation des politiques publiques',
      'Incentives and market structure': 'Incitations et structure de marché',
      'Scenario and sensitivity analysis': 'Analyse de scénarios et de sensibilité',
      'Investment appraisal': 'Évaluation des investissements',
      'Quantitative & data work': 'Analyse quantitative et données',
      'Python for analytical workflows': 'Python pour les flux d’analyse',
      'Data cleaning and validation': 'Nettoyage et validation des données',
      'KPI and dashboard design': 'Conception de KPI et de tableaux de bord',
      'Communication & delivery': 'Communication et restitution',
      'Research writing': 'Rédaction de travaux de recherche',
      'Executive-ready reporting': 'Reporting destiné aux décideurs',
      'Decision memos and recommendations': 'Notes de décision et recommandations',
      'Data visualisation': 'Visualisation de données',
      'Languages': 'Langues',
      'Arabic': 'Arabe',
      'Native': 'Langue maternelle',
      'French': 'Français',
      'C2 · Professional fluency': 'C2 · Maîtrise professionnelle',
      'English': 'Anglais',
      'Let’s examine the evidence.': 'Examinons les données probantes.',
      'Open to research collaborations and future analyst opportunities across applied economics, policy, finance, and decision intelligence.': 'Ouvert aux collaborations de recherche et aux futures opportunités d’analyste en économie appliquée, politiques publiques, finance et intelligence décisionnelle.',
      'Email': 'Courriel',
      'View profile': 'Voir le profil',
      'Curriculum vitae': 'Curriculum vitae',
      'Download CV': 'Télécharger le CV',
      'El Ghali Sany · Sharjah, UAE': 'El Ghali Sany · Sharjah, Émirats arabes unis',
      'Clear assumptions · Responsible analysis · Evidence before certainty': 'Hypothèses explicites · Analyse responsable · Les faits avant les certitudes',
      'Primary navigation': 'Navigation principale',
      'El Ghali Sany, home': 'El Ghali Sany, accueil',
      'Three research lenses': 'Trois axes de recherche',
      'Methods used': 'Méthodes utilisées',
      'Map controls': 'Commandes de la carte',
      'Current zone indicators': 'Indicateurs de la zone active',
      'Interactive 3D SUMO traffic map of Casablanca': 'Carte interactive 3D du trafic SUMO à Casablanca',
      'Map perspective': 'Perspective de la carte',
      'Map legend': 'Légende de la carte',
      'Close map detail': 'Fermer le détail cartographique',
      'Simulation timeline': 'Chronologie de la simulation',
      'Previous simulation step': 'Étape précédente de la simulation',
      'Play simulation': 'Lancer la simulation',
      'Pause simulation': 'Mettre la simulation en pause',
      'Next simulation step': 'Étape suivante de la simulation',
      'Simulation step': 'Étape de la simulation',
      'Playback speed': 'Vitesse de lecture',
      'Illustrative prioritisation chart comparing portfolio segments': 'Graphique illustratif comparant la priorité des segments du portefeuille',
      'Investment scenario comparison': 'Comparaison des scénarios d’investissement',
      'Research principles': 'Principes de recherche',
      'Portrait of El Ghali Sany': 'Portrait d’El Ghali Sany',
      'Language selection': 'Sélection de la langue',
      'View portfolio in English': 'Afficher le portfolio en anglais',
      'View portfolio in French': 'Afficher le portfolio en français',
      'View portfolio in Arabic': 'Afficher le portfolio en arabe'
    },
    ar: {
      'Retry map': 'إعادة تحميل الخريطة',
      'Skip to main content': 'الانتقال إلى المحتوى الرئيسي',
      'Menu': 'القائمة',
      'Close': 'إغلاق',
      'Profile': 'الملف الشخصي',
      'Research': 'الأبحاث',
      'Experience': 'الخبرة',
      'Methods': 'المنهجيات',
      'CV': 'السيرة الذاتية',
      'Contact': 'التواصل',
      'American University of Sharjah · School of Business Administration': 'الجامعة الأمريكية في الشارقة · كلية إدارة الأعمال',
      'Evidence for better economic decisions.': 'أدلة تدعم قرارات اقتصادية أفضل.',
      'M.Sc. Economics & Policy Candidate · Graduate Research Assistant': 'طالب ماجستير في الاقتصاد والسياسات · مساعد أبحاث للدراسات العليا',
      'I work across applied economics, policy analysis, financial modelling, and data analytics—turning complex evidence into clear, defensible decisions.': 'أعمل في مجالات الاقتصاد التطبيقي، وتحليل السياسات، والنمذجة المالية، وتحليل البيانات، لتحويل الأدلة المعقدة إلى قرارات واضحة وقابلة للدفاع عنها.',
      'View case studies': 'عرض دراسات الحالة',
      'Academic CV': 'السيرة الذاتية الأكاديمية (بالإنجليزية)',
      'Sharjah, United Arab Emirates': 'الشارقة، الإمارات العربية المتحدة',
      'Economics · Policy · Decision Intelligence': 'الاقتصاد · السياسات العامة · ذكاء اتخاذ القرار',
      'Economic Theory': 'النظرية الاقتصادية',
      'Structure · Incentives · Equilibrium': 'البنية · الحوافز · التوازن',
      'Quantitative Methods': 'الأساليب الكمية',
      'Identification · Estimation · Validation': 'التحديد · التقدير · التحقق',
      'Policy & Decision Analysis': 'تحليل السياسات والقرارات',
      'Evidence · Trade-offs · Impact': 'الأدلة · المفاضلات · الأثر',
      'Selected work': 'أعمال مختارة',
      'Research &': 'أبحاث و',
      'case studies.': 'دراسات حالة.',
      'Applied work that connects economic reasoning, structured analysis, and business evidence. Each case begins with a decision—not a tool.': 'أعمال تطبيقية تربط بين التفكير الاقتصادي والتحليل المنظم وأدلة الأعمال. تبدأ كل حالة بقرار، لا بأداة.',
      '01 / Interactive analysis': '01 / تحليل تفاعلي',
      'Casablanca Mobility Explorer': 'مستكشف التنقل في الدار البيضاء',
      'Decision question:': 'سؤال القرار:',
      'Where does simulated congestion concentrate, and how does vehicle flow change across five urban zones?': 'أين يتركز الازدحام المحاكى، وكيف يتغير تدفق المركبات عبر خمس مناطق حضرية؟',
      'SUMO simulation': 'محاكاة SUMO',
      'Spatial analytics': 'التحليل المكاني',
      'Scenario playback': 'إعادة تشغيل السيناريوهات',
      'Analysis layer': 'طبقة التحليل',
      'Congestion heatmap': 'خريطة حرارية للازدحام',
      'Vehicle simulation': 'محاكاة المركبات',
      'vehicle simulation': 'محاكاة المركبات',
      'Casablanca zone': 'منطقة الدار البيضاء',
      'Maârif': 'المعاريف',
      'Hay Hassani': 'الحي الحسني',
      'Ben M’Sick': 'ابن مسيك',
      'Sidi Maârouf': 'سيدي معروف',
      'Bd Mohammed V': 'شارع محمد الخامس',
      'Heat samples': 'عينات الكثافة',
      'Vehicles this step': 'المركبات في هذه الخطوة',
      'Displayed records': 'السجلات المعروضة',
      'Average speed': 'متوسط السرعة',
      'Simulation steps': 'خطوات المحاكاة',
      'Georeferenced SUMO/QGIS project output, reduced for the web. This is simulated evidence—not a live traffic feed. Tap a vehicle or density point to inspect it.': 'مخرجات مشروع SUMO/QGIS ذات إسناد جغرافي ومهيأة للويب. هذه بيانات محاكاة وليست بثاً مباشراً لحركة المرور. اضغط على مركبة أو نقطة كثافة لفحصها.',
      'Read project paper': 'قراءة ورقة المشروع',
      'congestion heatmap': 'خريطة حرارية للازدحام',
      'Preparing the map…': 'جارٍ تجهيز الخريطة…',
      'Legend': 'مفتاح الخريطة',
      'Lower density → higher density': 'من كثافة منخفضة إلى كثافة مرتفعة',
      'Map detail': 'تفاصيل الخريطة',
      'Play': 'تشغيل',
      'Pause': 'إيقاف مؤقت',
      'Speed': 'السرعة',
      '02 / Performance analytics': '02 / تحليل الأداء',
      'Debt-Recovery Performance Analytics': 'تحليل أداء تحصيل الديون',
      'How can a recovery portfolio be segmented so attention follows financial impact and collection urgency?': 'كيف يمكن تقسيم محفظة التحصيل بحيث يُوجَّه الاهتمام وفقاً للأثر المالي وأولوية التحصيل؟',
      'Monitor': 'مراقبة',
      'Review': 'مراجعة',
      'Prioritise': 'تحديد الأولوية',
      'Portfolio segmentation': 'تقسيم المحفظة',
      'KPI design': 'تصميم مؤشرات الأداء الرئيسية',
      'Experience-based case study. Commercial figures are abstracted to protect client confidentiality.': 'دراسة حالة مستندة إلى الخبرة. جرى تجريد الأرقام التجارية حفاظاً على سرية العميل.',
      'See related experience': 'عرض الخبرة ذات الصلة',
      '03 / Investment appraisal': '03 / تقييم الاستثمار',
      'OOH vs DOOH Investment Appraisal': 'تقييم الاستثمار في OOH مقابل DOOH',
      'Which format creates stronger long-term value once capital, operating cost, and uncertainty are included?': 'أي الصيغتين تحقق قيمة أقوى على المدى الطويل عند احتساب رأس المال وتكاليف التشغيل وعدم اليقين؟',
      'Capital intensity': 'كثافة رأس المال',
      'Compared': 'مقارنة',
      'Operating model': 'نموذج التشغيل',
      'Five-year view': 'أفق خمس سنوات',
      'Uncertainty': 'عدم اليقين',
      'Sensitivity tested': 'خضع لاختبار الحساسية',
      'NPV': 'صافي القيمة الحالية (NPV)',
      'Sensitivity testing': 'تحليل الحساسية',
      'View thesis analysis': 'عرض تحليل الرسالة',
      'Decision-first': 'القرار أولاً',
      'Frame the choice before the model': 'صياغة الاختيار قبل بناء النموذج',
      'Traceable': 'قابل للتتبع',
      'Make assumptions visible': 'إظهار الافتراضات بوضوح',
      'Comparative': 'مقارن',
      'Test alternatives and trade-offs': 'اختبار البدائل والمفاضلات',
      'Communicable': 'واضح وقابل للتطبيق',
      'Translate evidence into action': 'تحويل الأدلة إلى إجراءات',
      'From analysis': 'من التحليل',
      'to action.': 'إلى التنفيذ.',
      'A progression from financial reporting and performance analysis toward research-led economic and policy work.': 'مسار يبدأ من التقارير المالية وتحليل الأداء ويتجه نحو العمل الاقتصادي وتحليل السياسات القائم على البحث.',
      '2026 — Present': '2026 — حتى الآن',
      'Graduate Research Assistant': 'مساعد أبحاث للدراسات العليا',
      'American University of Sharjah': 'الجامعة الأمريكية في الشارقة',
      'Supporting faculty research at the School of Business Administration while developing applied economic and quantitative research capabilities through the MSEP program.': 'دعم أبحاث أعضاء هيئة التدريس في كلية إدارة الأعمال، مع تطوير قدرات البحث الاقتصادي التطبيقي والكمي ضمن برنامج MSEP.',
      'Feb — Aug 2026': 'فبراير — أغسطس 2026',
      'Business Analyst · Financial Performance': 'محلل أعمال · الأداء المالي',
      'SAN MAROC · Casablanca': 'SAN MAROC · الدار البيضاء',
      'Analysed recovery portfolios, monitored outstanding balances, and built reporting views to support case prioritisation and performance conversations.': 'تحليل محافظ التحصيل، ومتابعة الأرصدة المستحقة، وبناء تقارير تدعم ترتيب الحالات حسب الأولوية ونقاشات الأداء.',
      'May — Jul 2025': 'مايو — يوليو 2025',
      'Business Analyst · Performance & Investment': 'محلل أعمال · الأداء والاستثمار',
      '2ACOM · Casablanca': '2ACOM · الدار البيضاء',
      'Compared investment scenarios using financial models and structured market evidence, translating findings into decision-ready recommendations.': 'مقارنة سيناريوهات الاستثمار باستخدام نماذج مالية وأدلة سوق منظمة، وتحويل النتائج إلى توصيات جاهزة لاتخاذ القرار.',
      'Jul — Aug 2024': 'يوليو — أغسطس 2024',
      'Analysis & Reporting Intern': 'متدرب في التحليل وإعداد التقارير',
      'MAGHREBAIL · Casablanca': 'MAGHREBAIL · الدار البيضاء',
      'Supported recurring analysis and reporting, strengthened data quality checks, and helped turn operational information into clearer performance visibility.': 'المساهمة في التحليلات والتقارير الدورية، وتعزيز فحوص جودة البيانات، وتحويل المعلومات التشغيلية إلى رؤية أوضح للأداء.',
      'Education': 'التعليم',
      'Built across disciplines.': 'مسار متعدد التخصصات.',
      '2026 — Present · Sharjah': '2026 — حتى الآن · الشارقة',
      'M.Sc. Economics and Policy': 'ماجستير العلوم في الاقتصاد والسياسات',
      '2025 — 2026 · Lyon': '2025 — 2026 · ليون',
      'M.Sc. Procurement & Supply Chain Management': 'ماجستير العلوم في المشتريات وإدارة سلاسل الإمداد',
      '2022 — 2025 · Casablanca': '2022 — 2025 · الدار البيضاء',
      'Bachelor in Management, Finance & Accounting': 'بكالوريوس في الإدارة والمالية والمحاسبة',
      'Université Internationale de Casablanca · High honors': 'جامعة الدار البيضاء الدولية · بميزة ممتاز',
      'Methods & tools': 'المنهجيات والأدوات',
      'Rigour is': 'الدقة',
      'a working habit.': 'عادة في العمل.',
      'Tools matter when they make assumptions clearer, comparisons fairer, and conclusions more useful to the people making the decision.': 'تكتسب الأدوات قيمتها عندما توضح الافتراضات، وتجعل المقارنات أكثر إنصافاً، وتقدم استنتاجات أكثر فائدة لصنّاع القرار.',
      'Economic & policy reasoning': 'الاستدلال الاقتصادي وتحليل السياسات',
      'Policy evaluation': 'تقييم السياسات',
      'Incentives and market structure': 'الحوافز وهيكل السوق',
      'Scenario and sensitivity analysis': 'تحليل السيناريوهات والحساسية',
      'Investment appraisal': 'تقييم الاستثمارات',
      'Quantitative & data work': 'العمل الكمي وتحليل البيانات',
      'Python for analytical workflows': 'Python لمسارات العمل التحليلية',
      'Data cleaning and validation': 'تنظيف البيانات والتحقق منها',
      'KPI and dashboard design': 'تصميم مؤشرات الأداء ولوحات المتابعة',
      'Communication & delivery': 'التواصل وعرض النتائج',
      'Research writing': 'الكتابة البحثية',
      'Executive-ready reporting': 'تقارير جاهزة للإدارة التنفيذية',
      'Decision memos and recommendations': 'مذكرات القرار والتوصيات',
      'Data visualisation': 'تصور البيانات',
      'Languages': 'اللغات',
      'Arabic': 'العربية',
      'Native': 'اللغة الأم',
      'French': 'الفرنسية',
      'C2 · Professional fluency': 'C2 · إتقان مهني',
      'English': 'الإنجليزية',
      'Let’s examine the evidence.': 'لنحلّل الأدلة.',
      'Open to research collaborations and future analyst opportunities across applied economics, policy, finance, and decision intelligence.': 'متاح للتعاون البحثي وللفرص المستقبلية كمحلل في الاقتصاد التطبيقي والسياسات العامة والمالية وذكاء اتخاذ القرار.',
      'Email': 'البريد الإلكتروني',
      'View profile': 'عرض الملف الشخصي',
      'Curriculum vitae': 'السيرة الذاتية',
      'Download CV': 'تنزيل السيرة الذاتية (بالإنجليزية)',
      'El Ghali Sany · Sharjah, UAE': 'El Ghali Sany · الشارقة، الإمارات العربية المتحدة',
      'Clear assumptions · Responsible analysis · Evidence before certainty': 'افتراضات واضحة · تحليل مسؤول · الأدلة قبل اليقين',
      'Primary navigation': 'التنقل الرئيسي',
      'El Ghali Sany, home': 'El Ghali Sany، الصفحة الرئيسية',
      'Three research lenses': 'محاور البحث الثلاثة',
      'Methods used': 'المنهجيات المستخدمة',
      'Map controls': 'عناصر التحكم في الخريطة',
      'Current zone indicators': 'مؤشرات المنطقة الحالية',
      'Interactive 3D SUMO traffic map of Casablanca': 'خريطة تفاعلية ثلاثية الأبعاد لحركة مرور SUMO في الدار البيضاء',
      'Map perspective': 'منظور الخريطة',
      'Map legend': 'مفتاح الخريطة',
      'Close map detail': 'إغلاق تفاصيل الخريطة',
      'Simulation timeline': 'المخطط الزمني للمحاكاة',
      'Previous simulation step': 'خطوة المحاكاة السابقة',
      'Play simulation': 'تشغيل المحاكاة',
      'Pause simulation': 'إيقاف المحاكاة مؤقتاً',
      'Next simulation step': 'خطوة المحاكاة التالية',
      'Simulation step': 'خطوة المحاكاة',
      'Playback speed': 'سرعة التشغيل',
      'Illustrative prioritisation chart comparing portfolio segments': 'رسم توضيحي يقارن أولويات شرائح المحفظة',
      'Investment scenario comparison': 'مقارنة سيناريوهات الاستثمار',
      'Research principles': 'مبادئ البحث',
      'Portrait of El Ghali Sany': 'صورة El Ghali Sany',
      'Language selection': 'اختيار اللغة',
      'View portfolio in English': 'عرض ملف الأعمال بالإنجليزية',
      'View portfolio in French': 'عرض ملف الأعمال بالفرنسية',
      'View portfolio in Arabic': 'عرض ملف الأعمال بالعربية'
    }
  };

  const META = {
    en: {
      title: 'El Ghali Sany — Economics, Policy & Decision Intelligence',
      description: 'El Ghali Sany is an M.Sc. Economics and Policy candidate and Graduate Research Assistant at the American University of Sharjah, working across applied economics, policy analysis, financial modelling, and data analytics.',
      social: 'Applied economics, policy analysis, financial modelling, and data analytics — built to turn evidence into better decisions.',
      locale: 'en_US'
    },
    fr: {
      title: 'El Ghali Sany — Économie, politiques publiques et intelligence décisionnelle',
      description: 'El Ghali Sany est étudiant en M.Sc. Economics and Policy et assistant de recherche à l’American University of Sharjah. Ses travaux couvrent l’économie appliquée, l’analyse des politiques publiques, la modélisation financière et l’analyse de données.',
      social: 'Économie appliquée, politiques publiques, modélisation financière et analyse de données au service de meilleures décisions.',
      locale: 'fr_FR'
    },
    ar: {
      title: 'El Ghali Sany — الاقتصاد والسياسات العامة وذكاء اتخاذ القرار',
      description: 'El Ghali Sany طالب ماجستير في الاقتصاد والسياسات ومساعد أبحاث في الجامعة الأمريكية في الشارقة، ويعمل في الاقتصاد التطبيقي وتحليل السياسات والنمذجة المالية وتحليل البيانات.',
      social: 'الاقتصاد التطبيقي وتحليل السياسات والنمذجة المالية وتحليل البيانات من أجل قرارات أفضل.',
      locale: 'ar_AE'
    }
  };

  const ZONES = {
    en: {
      maarif: 'Maârif',
      hay_hassani: 'Hay Hassani',
      ben_msick: 'Ben M’Sick',
      sidi_maarouf: 'Sidi Maârouf',
      bd_mohammed_v: 'Bd Mohammed V'
    },
    fr: {
      maarif: 'Maârif',
      hay_hassani: 'Hay Hassani',
      ben_msick: 'Ben M’Sick',
      sidi_maarouf: 'Sidi Maârouf',
      bd_mohammed_v: 'Bd Mohammed V'
    },
    ar: {
      maarif: 'المعاريف',
      hay_hassani: 'الحي الحسني',
      ben_msick: 'ابن مسيك',
      sidi_maarouf: 'سيدي معروف',
      bd_mohammed_v: 'شارع محمد الخامس'
    }
  };

  const VEHICLE_STATES = {
    en: { slow: 'slow', medium: 'medium', fast: 'fast', unknown: 'unknown' },
    fr: { slow: 'lente', medium: 'modérée', fast: 'rapide', unknown: 'inconnue' },
    ar: { slow: 'بطيئة', medium: 'متوسطة', fast: 'سريعة', unknown: 'غير معروفة' }
  };

  const DYNAMIC = {
    en: {
      densityTitle: 'Density sample',
      densityBody: (intensity, zone) => `Relative intensity ${intensity} · ${zone} · simulated project output`,
      vehicleTitle: (id) => `Vehicle ${id}`,
      vehicleBody: (speed, state, time) => `${speed} m/s · ${state} speed · ${time}`,
      heatLegend: 'Blue: lower density · red: higher density',
      vehicleLegend: 'Red: slow · gold: moderate · blue: faster vehicle',
      loadingHeat: (zone) => `Loading ${zone} density samples…`,
      loadingSimulation: (zone) => `Loading ${zone} simulation frames…`,
      compatibleBase: 'compatible 2D map',
      vectorBase: '3D vector city context',
      rasterBase: 'raster basemap fallback',
      leafletHint: 'drag, pinch, zoom, or inspect a point',
      maplibreHint: 'drag, pinch, rotate, or inspect a point',
      loaded: (zone, base, hint) => `Loaded ${zone} · ${base} · ${hint}`,
      dataError: 'The project data could not be loaded. Check your connection, then select Retry map.',
      fallbackActive: 'Compatible 2D map active · vehicle playback remains available',
      mapUnavailable: 'The map engines could not start. Confirm that JavaScript is enabled and open the portfolio through GitHub Pages.',
      mapUnavailableStatus: 'Interactive map unavailable',
      webglRequired: '3D requires WebGL2; compatible 2D mode is active.'
    },
    fr: {
      densityTitle: 'Échantillon de densité',
      densityBody: (intensity, zone) => `Intensité relative ${intensity} · ${zone} · résultat simulé du projet`,
      vehicleTitle: (id) => `Véhicule ${id}`,
      vehicleBody: (speed, state, time) => `${speed} m/s · vitesse ${state} · ${time}`,
      heatLegend: 'Bleu : densité faible · rouge : densité élevée',
      vehicleLegend: 'Rouge : lent · or : modéré · bleu : plus rapide',
      loadingHeat: (zone) => `Chargement des échantillons de densité de ${zone}…`,
      loadingSimulation: (zone) => `Chargement des images de simulation de ${zone}…`,
      compatibleBase: 'carte 2D compatible',
      vectorBase: 'contexte urbain vectoriel 3D',
      rasterBase: 'fond de carte raster de secours',
      leafletHint: 'faites glisser, pincez, zoomez ou inspectez un point',
      maplibreHint: 'faites glisser, pincez, pivotez ou inspectez un point',
      loaded: (zone, base, hint) => `${zone} chargé · ${base} · ${hint}`,
      dataError: 'Les données du projet n’ont pas pu être chargées. Vérifiez votre connexion, puis sélectionnez Réessayer la carte.',
      fallbackActive: 'Carte 2D compatible active · la lecture des véhicules reste disponible',
      mapUnavailable: 'Les moteurs cartographiques n’ont pas pu démarrer. Vérifiez que JavaScript est activé et ouvrez le portfolio via GitHub Pages.',
      mapUnavailableStatus: 'Carte interactive indisponible',
      webglRequired: 'La 3D nécessite WebGL2 ; le mode 2D compatible est actif.'
    },
    ar: {
      densityTitle: 'عينة كثافة',
      densityBody: (intensity, zone) => `الكثافة النسبية ${intensity} · ${zone} · مخرجات مشروع محاكاة`,
      vehicleTitle: (id) => `المركبة ${id}`,
      vehicleBody: (speed, state, time) => `${speed} م/ث · سرعة ${state} · ${time}`,
      heatLegend: 'الأزرق: كثافة منخفضة · الأحمر: كثافة مرتفعة',
      vehicleLegend: 'أحمر: بطيئة · ذهبي: متوسطة · أزرق: أسرع',
      loadingHeat: (zone) => `جارٍ تحميل عينات الكثافة لمنطقة ${zone}…`,
      loadingSimulation: (zone) => `جارٍ تحميل إطارات المحاكاة لمنطقة ${zone}…`,
      compatibleBase: 'خريطة ثنائية الأبعاد متوافقة',
      vectorBase: 'سياق حضري متجهي ثلاثي الأبعاد',
      rasterBase: 'خريطة نقطية احتياطية',
      leafletHint: 'اسحب أو قرّب أو كبّر أو افحص نقطة',
      maplibreHint: 'اسحب أو قرّب أو أدر الخريطة أو افحص نقطة',
      loaded: (zone, base, hint) => `تم تحميل ${zone} · ${base} · ${hint}`,
      dataError: 'تعذر تحميل بيانات المشروع. تحقق من اتصالك، ثم اختر إعادة تحميل الخريطة.',
      fallbackActive: 'الخريطة الثنائية الأبعاد المتوافقة نشطة · تشغيل حركة المركبات متاح',
      mapUnavailable: 'تعذر تشغيل محركات الخرائط. تأكد من تفعيل JavaScript وافتح ملف الأعمال عبر GitHub Pages.',
      mapUnavailableStatus: 'الخريطة التفاعلية غير متاحة',
      webglRequired: 'يتطلب العرض الثلاثي الأبعاد WebGL2؛ الوضع الثنائي المتوافق نشط.'
    }
  };

  Object.assign(COPY.fr, {
    'Weighted SUMO samples': 'Échantillons SUMO pondérés',
    'Play SUMO vehicles': 'Lire les véhicules SUMO',
    'Exported position records': 'Positions dans l’export',
    'Frame mean speed': 'Vitesse moyenne de l’image',
    'Exported frames': 'Images exportées',
    'What these maps measure': 'Ce que mesurent ces cartes',
    'Download heat samples': 'Télécharger les échantillons pondérés',
    'Download vehicle records': 'Télécharger les positions des véhicules',
    'Read the OOH/DOOH thesis': 'Lire le mémoire OOH/DOOH',
    'How can simulated traffic inform OOH/DOOH location analysis, alongside audience, costs and regulation?': 'Comment le trafic simulé peut-il éclairer l’analyse des emplacements OOH/DOOH, avec l’audience, les coûts et la réglementation ?',
    'Archived SUMO output from the OOH/DOOH study. Vehicle positions are sampled every 8 seconds, with up to 450 vehicles per exported frame. Repeated positions are not unique viewers or measured advertising impressions.': 'Résultats SUMO archivés de l’étude OOH/DOOH. Les positions sont échantillonnées toutes les 8 secondes, avec jusqu’à 450 véhicules par image exportée. Les positions répétées ne sont ni des personnes uniques ni des impressions publicitaires mesurées.',
    'The heat layer uses all 12,000 supplied coordinate/weight samples for the selected zone. The export does not document the weight formula. Colour indicates smoothed weighted sample concentration, not a calibrated congestion rate or an investment score.': 'La couche utilise les 12 000 échantillons de coordonnées et de poids fournis pour la zone choisie. La formule des poids n’est pas documentée dans l’export. La couleur représente une concentration pondérée et lissée des échantillons, pas un taux de congestion calibré ni un score d’investissement.',
    'Vehicle playback uses the supplied IDs, coordinates, timestamps and speeds without invented routes. Stationary vehicles remain stationary. The mean speed is recalculated for the displayed frame; it is not the original full-run average.': 'La lecture reprend les identifiants, coordonnées, horodatages et vitesses fournis, sans inventer de trajectoires. Les véhicules à l’arrêt restent immobiles. La vitesse moyenne est recalculée pour l’image affichée ; ce n’est pas la moyenne de la simulation complète d’origine.',
    'Traffic is one input to the thesis, alongside audience, CAPEX/OPEX and regulation. The archive does not contain detector coordinates, billboard visibility geometry or the original SUMO network and route files, so this map cannot calculate advertising exposure or reproduce the complete simulation.': 'Le trafic est une composante du mémoire, avec l’audience, les CAPEX/OPEX et la réglementation. L’archive ne contient ni les coordonnées des capteurs, ni la géométrie de visibilité des panneaux, ni les fichiers SUMO originaux du réseau et des itinéraires. Cette carte ne peut donc ni calculer l’exposition publicitaire ni reproduire la simulation complète.'
  });
  Object.assign(COPY.ar, {
    'Weighted SUMO samples': 'عينات SUMO الموزونة',
    'Play SUMO vehicles': 'تشغيل مركبات SUMO',
    'Exported position records': 'سجلات المواقع المصدّرة',
    'Frame mean speed': 'متوسط سرعة الإطار',
    'Exported frames': 'الإطارات المصدّرة',
    'What these maps measure': 'ما الذي تقيسه هذه الخرائط؟',
    'Download heat samples': 'تنزيل العينات الموزونة',
    'Download vehicle records': 'تنزيل سجلات المركبات',
    'Read the OOH/DOOH thesis': 'قراءة بحث OOH/DOOH',
    'How can simulated traffic inform OOH/DOOH location analysis, alongside audience, costs and regulation?': 'كيف يمكن لحركة المرور المحاكاة أن تدعم تحليل مواقع OOH/DOOH إلى جانب الجمهور والتكاليف والتنظيم؟',
    'Archived SUMO output from the OOH/DOOH study. Vehicle positions are sampled every 8 seconds, with up to 450 vehicles per exported frame. Repeated positions are not unique viewers or measured advertising impressions.': 'مخرجات SUMO مؤرشفة من دراسة OOH/DOOH. أُخذت عينات المواقع كل 8 ثوانٍ، بما يصل إلى 450 مركبة في كل إطار مصدّر. المواقع المتكررة لا تمثل مشاهدين فريدين أو مرات ظهور إعلانية مقاسة.',
    'The heat layer uses all 12,000 supplied coordinate/weight samples for the selected zone. The export does not document the weight formula. Colour indicates smoothed weighted sample concentration, not a calibrated congestion rate or an investment score.': 'تستخدم الطبقة جميع عينات الإحداثيات والأوزان البالغ عددها 12,000 للمنطقة المختارة. لا يوثّق ملف التصدير معادلة الأوزان. يشير اللون إلى تركّز موزون ومُنعّم للعينات، وليس إلى معدل ازدحام مُعاير أو درجة استثمار.',
    'Vehicle playback uses the supplied IDs, coordinates, timestamps and speeds without invented routes. Stationary vehicles remain stationary. The mean speed is recalculated for the displayed frame; it is not the original full-run average.': 'يستخدم التشغيل المعرّفات والإحداثيات والأوقات والسرعات المرفقة دون اختلاق مسارات. تبقى المركبات المتوقفة ثابتة. يُعاد حساب متوسط السرعة للإطار المعروض؛ وهو ليس متوسط المحاكاة الأصلية الكاملة.',
    'Traffic is one input to the thesis, alongside audience, CAPEX/OPEX and regulation. The archive does not contain detector coordinates, billboard visibility geometry or the original SUMO network and route files, so this map cannot calculate advertising exposure or reproduce the complete simulation.': 'المرور أحد مدخلات البحث إلى جانب الجمهور وCAPEX/OPEX والتنظيم. لا يتضمن الأرشيف إحداثيات الكواشف أو هندسة رؤية اللوحات أو ملفات شبكة SUMO ومساراتها الأصلية. لذلك لا يمكن لهذه الخريطة حساب التعرّض الإعلاني أو إعادة إنتاج المحاكاة الكاملة.'
  });
  DYNAMIC.en.heatLegend = 'Lower → higher weighted sample concentration; colour depends on zoom';
  DYNAMIC.fr.heatLegend = 'Concentration pondérée faible → élevée ; la couleur dépend du zoom';
  DYNAMIC.ar.heatLegend = 'تركّز موزون منخفض إلى مرتفع؛ يعتمد اللون على التكبير';
  DYNAMIC.en.densityTitle = 'Original weighted sample';
  DYNAMIC.fr.densityTitle = 'Échantillon pondéré original';
  DYNAMIC.ar.densityTitle = 'عينة موزونة أصلية';
  DYNAMIC.en.densityBody = (weight, zone) => `Export weight ${weight} · ${zone} · weight formula not supplied`;
  DYNAMIC.fr.densityBody = (weight, zone) => `Poids dans l’export : ${weight} · ${zone} · formule non fournie`;
  DYNAMIC.ar.densityBody = (weight, zone) => `وزن التصدير ${weight} · ${zone} · المعادلة غير مرفقة`;
  DYNAMIC.en.vehicleLegend = 'Speed: red < 3 m/s · gold 3–<8 m/s · blue ≥ 8 m/s';
  DYNAMIC.fr.vehicleLegend = 'Vitesse : rouge < 3 m/s · or 3–<8 m/s · bleu ≥ 8 m/s';
  DYNAMIC.ar.vehicleLegend = 'السرعة: أحمر < 3 m/s · ذهبي 3–<8 m/s · أزرق ≥ 8 m/s';

  const normalize = (value) => value.replace(/\s+/g, ' ').trim();
  const textEntries = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest('script, style')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  let node;
  while ((node = walker.nextNode())) {
    textEntries.push({
      node,
      original: node.nodeValue,
      key: normalize(node.nodeValue)
    });
  }

  const attributeEntries = [];
  document.querySelectorAll('[aria-label], [alt]').forEach((element) => {
    ['aria-label', 'alt'].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      attributeEntries.push({
        element,
        attribute,
        original: element.getAttribute(attribute)
      });
    });
  });

  const queryLanguage = new URLSearchParams(window.location.search).get('lang');
  let storedLanguage = null;
  try {
    storedLanguage = window.localStorage.getItem('portfolio-language');
  } catch (error) {
    // Language selection still works when storage is unavailable.
  }
  const browserLanguage = String(navigator.language || 'en').slice(0, 2).toLowerCase();
  let currentLanguage = SUPPORTED.includes(queryLanguage)
    ? queryLanguage
    : (SUPPORTED.includes(storedLanguage) ? storedLanguage : (SUPPORTED.includes(browserLanguage) ? browserLanguage : 'en'));
  const listeners = new Set();

  const translate = (source) => {
    if (currentLanguage === 'en') return source;
    return COPY[currentLanguage]?.[source] || source;
  };

  const message = (key, ...values) => {
    const entry = DYNAMIC[currentLanguage]?.[key] ?? DYNAMIC.en[key];
    return typeof entry === 'function' ? entry(...values) : entry;
  };

  const updateMetadata = () => {
    const metadata = META[currentLanguage];
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', metadata.social);
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', metadata.locale);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', metadata.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', metadata.social);
  };

  const applyLanguage = (language, options = {}) => {
    if (!SUPPORTED.includes(language)) language = 'en';
    currentLanguage = language;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.language = language;

    textEntries.forEach(({ node: textNode, original, key }) => {
      if (!textNode.isConnected) return;
      const value = language === 'en' ? key : (COPY[language]?.[key] || key);
      // Preserve surrounding whitespace, including when source copy spans lines.
      textNode.nodeValue = language === 'en' ? original : original.replace(/\S[\s\S]*\S|\S/, value);
    });

    attributeEntries.forEach(({ element, attribute, original }) => {
      if (!element.isConnected) return;
      element.setAttribute(attribute, language === 'en' ? original : (COPY[language]?.[original] || original));
    });

    document.querySelectorAll('button[data-language]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });

    document.querySelectorAll('a[href^="CV_El_Ghali_Sany_"]').forEach((link) => {
      link.setAttribute('href', language === 'fr' ? 'CV_El_Ghali_Sany_FR.pdf' : 'CV_El_Ghali_Sany_EN.pdf');
    });

    updateMetadata();
    try {
      window.localStorage.setItem('portfolio-language', language);
    } catch (error) {
      // Persistence is optional.
    }

    if (options.updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', language);
      window.history.replaceState({}, '', url);
    }
    listeners.forEach((listener) => listener(language));
  };

  document.querySelectorAll('button[data-language]').forEach((button) => {
    button.addEventListener('click', () => applyLanguage(button.dataset.language, { updateUrl: true }));
  });

  window.addEventListener('popstate', () => {
    const requested = new URLSearchParams(window.location.search).get('lang');
    applyLanguage(SUPPORTED.includes(requested) ? requested : 'en');
  });

  window.PORTFOLIO_I18N = {
    t: translate,
    hasTranslation(source, language = currentLanguage) {
      return language === 'en' || Object.prototype.hasOwnProperty.call(COPY[language] || {}, source);
    },
    message,
    applyLanguage,
    onChange(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    zoneLabel(zone) {
      return ZONES[currentLanguage]?.[zone] || ZONES.en[zone] || zone;
    },
    vehicleState(state) {
      return VEHICLE_STATES[currentLanguage]?.[state] || VEHICLE_STATES[currentLanguage]?.unknown || state;
    },
    numberFormatter() {
      const locale = currentLanguage === 'ar' ? 'ar-AE' : (currentLanguage === 'fr' ? 'fr-FR' : 'en');
      return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 });
    },
    get language() {
      return currentLanguage;
    }
  };

  applyLanguage(currentLanguage);
})();
