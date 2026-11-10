/* =====================================================================
   DEMO / PROTOTYPE DATA
   Bütün brendlər, qiymətlər, stok sayları və filial məlumatları
   PROTOTİP üçün uydurulmuş nümunələrdir. Real məlumat deyil.
   Backend inteqrasiyası zamanı bu fayl API cavabları ilə əvəz olunmalıdır.
   ===================================================================== */
(function () {
  "use strict";
  const TP = (window.TP = window.TP || {});

  const SEASON = {
    summer: { label: "Yay", icon: "sun" },
    winter: { label: "Qış", icon: "snow" },
    all: { label: "4 fəsil", icon: "season" },
  };

  /* Model-level descriptions keep every size of a model consistent
     with its season (no "winter" copy on a summer tyre). */
  const MODELS = {
    "Polar Grip W": {
      season: "winter",
      text: "Sıx lamel şəbəkəsi və yumşaq qış qarışığı olan qış təkəri. +7 °C-dən aşağı temperaturda, yaş qar və buzlu səthdə tutuşu artırmaq üçün nəzərdə tutulub.",
      points: ["3PMSF qış nişanı (demo)", "Ziqzaq lamellər qarı və suyu tutub buraxır", "Soyuqda elastik qalan rezin qarışığı"],
    },
    "Aero S2": {
      season: "summer",
      text: "Asimmetrik protektorlu yay təkəri. Quru və yaş asfaltda dəqiq idarəetmə, aşağı yuvarlanma müqaviməti və sakit gediş üçün hazırlanıb.",
      points: ["Dörd uzununa kanal suyu sürətlə çıxarır", "Sərt çiyin blokları döngədə sabitlik verir", "Yanacaq qənaəti üçün aşağı müqavimət"],
    },
    "AllRoad 4S": {
      season: "all",
      text: "İl boyu istifadə üçün 4 fəsil təkəri. V-şəkilli protektor yağışda suyu, mülayim qışda isə yaş qarı effektiv çıxarır.",
      points: ["V-formalı istiqamətli protektor", "Mülayim iqlim üçün balanslı qarışıq", "Mövsümi dəyişmə ehtiyacını azaldır"],
    },
    "CityLine": {
      season: "summer",
      text: "Şəhər avtomobilləri üçün sərfəli yay təkəri. Gündəlik sürüşdə rahatlıq, aşağı səs və uzun xidmət müddəti önə çəkilir.",
      points: ["Şəhər sürüşü üçün optimallaşdırılmış profil", "Bərabər aşınma", "Aşağı səs səviyyəsi"],
    },
    "Sport RF": {
      season: "summer",
      text: "Run-flat texnologiyalı yüksək performanslı yay təkəri. Deşilmə zamanı da məhdud sürətlə sürüşü davam etdirməyə imkan verir.",
      points: ["Run-flat: təzyiq itəndə 80 km-ə qədər 80 km/s (istehsalçı şərtləri ilə)", "Gücləndirilmiş yan divar", "Yüksək sürətdə dəqiq reaksiya"],
    },
    "Winter Pro": {
      season: "winter",
      text: "Krossover və sedanlar üçün qış təkəri. Geniş blokları və çoxlu lamelləri qarlı yolda dartma və əyləc məsafəsinə fokuslanıb.",
      points: ["Qar üçün dərin protektor", "Buzda əyləc üçün 3D lamellər", "Soyuğa davamlı qarışıq"],
    },
    "E-Drive": {
      season: "summer",
      text: "Elektromobillər üçün yay təkəri. Aşağı yuvarlanma müqaviməti yürüş məsafəsini artırır, gücləndirilmiş karkas isə ağır batareya kütləsini daşıyır.",
      points: ["Aşağı yuvarlanma müqaviməti", "Səs udan köpük qatı", "Yüksək yük indeksi (XL)"],
    },
    "Cargo LT": {
      season: "all",
      text: "Mikroavtobus və yüngül yük maşınları üçün 4 fəsil təkəri. C işarəsi kommersiya istifadəsi üçün gücləndirilmiş konstruksiyanı göstərir.",
      points: ["Kommersiya (C) konstruksiyası", "Yük altında bərabər aşınma", "İl boyu istifadə"],
    },
    "Haul 22": {
      season: "all",
      text: "Yük maşınları və avtobuslar üçün universal ox təkəri. Uzun məsafəli marşrutlarda bərabər aşınma və bərpa (protektor yeniləmə) imkanı üçün nəzərdə tutulub.",
      points: ["Uzun məsafəli istifadə", "Protektor bərpasına uyğun karkas", "Bütün oxlar üçün"],
    },
    "Trail HT": {
      season: "all",
      text: "SUV və krossoverlər üçün 4 fəsil təkəri. Asfaltda sakit, yüngül torpaq yolda isə etibarlı davranış üçün balanslaşdırılıb.",
      points: ["SUV üçün gücləndirilmiş karkas", "Asfaltda sakit gediş", "Yüngül bezdorojye üçün yan bloklar"],
    },
  };

  const BRAND_ORIGIN = {
    Nordvik: "Finlandiya",
    Solenta: "Almaniya",
    Arcadia: "İtaliya",
    Terravia: "Türkiyə",
    Meridian: "Yaponiya",
    "Kaspi Grip": "Polşa",
  };

  /* Tyre segment (matches the site menu): sedan, suv, ev, lt, truck, industrial, agri, tube */
  const SUB_BY_ID = { t10: "suv", t11: "suv", t15: "ev", t16: "lt", t17: "truck" };

  // [id, brand, model, width, profile, diameter, load, speed, runflat, fuel, wet, noise, price, oldPrice, stock, popularity, addedOrder]
  const TYRES = [
    ["t1", "Nordvik", "Polar Grip W", 205, 55, 16, 94, "T", false, "C", "B", 71, 142, 158, 12, 96, 9],
    ["t2", "Solenta", "Aero S2", 205, 55, 16, 91, "V", false, "A", "A", 69, 128, null, 20, 92, 3],
    ["t3", "Arcadia", "AllRoad 4S", 205, 55, 16, 94, "V", false, "B", "B", 70, 136, 149, 9, 88, 12],
    ["t4", "Terravia", "CityLine", 185, 65, 15, 88, "H", false, "C", "B", 68, 89, null, 30, 84, 1],
    ["t5", "Nordvik", "Polar Grip W", 185, 65, 15, 92, "T", false, "C", "C", 70, 98, null, 0, 79, 10],
    ["t6", "Meridian", "Sport RF", 225, 55, 17, 97, "W", true, "B", "A", 71, 214, null, 6, 71, 5],
    ["t7", "Kaspi Grip", "Winter Pro", 225, 55, 17, 101, "H", false, "D", "B", 72, 189, 205, 4, 83, 14],
    ["t8", "Solenta", "Aero S2", 215, 55, 17, 94, "W", false, "A", "A", 70, 168, null, 15, 90, 4],
    ["t9", "Arcadia", "AllRoad 4S", 215, 55, 17, 98, "V", false, "B", "B", 71, 176, null, 9, 74, 11],
    ["t10", "Terravia", "Trail HT", 225, 60, 17, 99, "H", false, "C", "B", 71, 182, null, 8, 68, 6],
    ["t11", "Kaspi Grip", "Winter Pro", 225, 60, 17, 103, "T", false, "C", "B", 72, 196, 219, 7, 81, 15],
    ["t12", "Meridian", "Sport RF", 235, 45, 18, 98, "Y", true, "B", "A", 72, 248, null, 3, 62, 7],
    ["t13", "Terravia", "CityLine", 195, 65, 15, 91, "H", false, "C", "B", 68, 94, null, 22, 77, 2],
    ["t14", "Nordvik", "Polar Grip W", 215, 55, 17, 98, "T", false, "C", "B", 71, 171, null, 10, 86, 13],
    ["t15", "Solenta", "E-Drive", 215, 55, 17, 98, "W", false, "A", "A", 68, 189, null, 7, 58, 36],
    ["t16", "Terravia", "Cargo LT", 195, 75, 16, "107/105", "R", false, "C", "B", 72, 158, 169, 12, 54, 37],
    ["t17", "Kaspi Grip", "Haul 22", 315, 80, 22.5, "156/150", "L", false, "C", "B", 73, 690, null, 4, 40, 38],
  ];

  const products = TYRES.map(([id, brand, model, width, profile, diameter, load, speed, runflat, fuel, wet, noise, price, oldPrice, stock, popularity, added]) => {
    const m = MODELS[model];
    return {
      id,
      category: "tyres",
      sku: `ZP-${brand.slice(0, 3).toUpperCase()}-${width}${profile}${diameter}-${load}${speed}`,
      brand,
      model,
      name: `${brand} ${model}`,
      width, profile, diameter, load, speed,
      size: `${width}/${profile} R${diameter}${SUB_BY_ID[id] === "lt" ? "C" : ""}`,
      sub: SUB_BY_ID[id] || "sedan",
      season: m.season,
      runflat,
      fuel, wet, noise,
      country: BRAND_ORIGIN[brand],
      dot: null, // DOT / istehsal tarixi: məlumat yoxdur — uydurulmur
      price, oldPrice, stock, popularity, added,
      description: m.text,
      points: m.points,
      warranty: "12 ay istehsal qüsurlarına qarşı zəmanət (demo şərt)",
      images: [], // real foto yolları: ["assets/images/products/t1-1.webp", ...]
    };
  });

  products.push(
    {
      id: "b1", category: "batteries", sub: "car", sku: "ZP-VOL-EFB60", brand: "VoltaCore", model: "EFB 60Ah", name: "VoltaCore EFB 60Ah",
      capacity: 60, voltage: 12, cca: 560, tech: "EFB", polarity: "Sağ (+)", dims: "242×175×190 mm",
      price: 165, oldPrice: null, stock: 14, popularity: 80, added: 8,
      description: "Start-stop sistemli avtomobillər üçün EFB akkumulyator. Tez-tez işə salınmaya və soyuq havaya davamlıdır.",
      points: ["Start-stop sistemləri ilə uyğundur", "Texniki xidmət tələb etmir", "Soyuq start cərəyanı 560 A (EN)"],
      warranty: "24 ay zəmanət (demo şərt)",
    },
    {
      id: "b2", category: "batteries", sub: "car", sku: "ZP-VOL-AGM70", brand: "VoltaCore", model: "AGM 70Ah", name: "VoltaCore AGM 70Ah",
      capacity: 70, voltage: 12, cca: 760, tech: "AGM", polarity: "Sağ (+)", dims: "278×175×190 mm",
      price: 249, oldPrice: 269, stock: 5, popularity: 73, added: 16,
      description: "Yüksək enerji tələbatı olan müasir avtomobillər üçün AGM akkumulyator. Dərin boşalmaya və vibrasiyaya davamlıdır.",
      points: ["Enerji bərpası (rekuperasiya) sistemləri üçün", "Vibrasiyaya davamlı konstruksiya", "Soyuq start cərəyanı 760 A (EN)"],
      warranty: "24 ay zəmanət (demo şərt)",
    },
    {
      id: "b3", category: "batteries", sub: "car", sku: "ZP-VOL-STD45", brand: "VoltaCore", model: "Start 45Ah", name: "VoltaCore Start 45Ah",
      capacity: 45, voltage: 12, cca: 400, tech: "Standart", polarity: "Sağ (+)", dims: "207×175×175 mm",
      price: 118, oldPrice: null, stock: 18, popularity: 66, added: 17,
      description: "Kiçik və orta sinif avtomobillər üçün standart akkumulyator.",
      points: ["Kompakt ölçü", "Etibarlı soyuq start", "Texniki xidmət tələb etmir"],
      warranty: "18 ay zəmanət (demo şərt)",
    },
    {
      id: "b4", category: "batteries", sub: "car", sku: "ZP-VOL-EFB70", brand: "VoltaCore", model: "EFB 70Ah", name: "VoltaCore EFB 70Ah",
      capacity: 70, voltage: 12, cca: 680, tech: "EFB", polarity: "Sağ (+)", dims: "278×175×190 mm",
      price: 189, oldPrice: null, stock: 11, popularity: 77, added: 24,
      description: "Start-stop sistemli avtomobillər üçün EFB akkumulyator. Tez-tez işə salınmaya davamlıdır.",
      points: ["Start-stop sistemləri ilə uyğundur", "Dərin dövrlərə davamlı", "Texniki xidmət tələb etmir"],
      warranty: "24 ay zəmanət (demo şərt)",
    },
    {
      id: "b5", category: "batteries", sub: "car", sku: "ZP-VOL-AGM80", brand: "VoltaCore", model: "AGM 80Ah", name: "VoltaCore AGM 80Ah",
      capacity: 80, voltage: 12, cca: 800, tech: "AGM", polarity: "Sağ (+)", dims: "315×175×190 mm",
      price: 289, oldPrice: 315, stock: 6, popularity: 69, added: 25,
      description: "Premium və start-stop/rekuperasiya sistemli avtomobillər üçün AGM akkumulyator. Dərin boşalmaya və vibrasiyaya davamlıdır.",
      points: ["Enerji bərpası sistemləri üçün", "Vibrasiyaya davamlı", "Sızma riski yoxdur"],
      warranty: "36 ay zəmanət (demo şərt)",
    },
    {
      id: "b6", category: "batteries", sub: "car", sku: "ZP-VOL-AGM95", brand: "VoltaCore", model: "AGM 95Ah", name: "VoltaCore AGM 95Ah",
      capacity: 95, voltage: 12, cca: 850, tech: "AGM", polarity: "Sağ (+)", dims: "353×175×190 mm",
      price: 339, oldPrice: null, stock: 3, popularity: 55, added: 26,
      description: "Premium və start-stop/rekuperasiya sistemli avtomobillər üçün AGM akkumulyator. Dərin boşalmaya və vibrasiyaya davamlıdır.",
      points: ["Enerji bərpası sistemləri üçün", "Vibrasiyaya davamlı", "Sızma riski yoxdur"],
      warranty: "36 ay zəmanət (demo şərt)",
    },
    {
      id: "b7", category: "batteries", sub: "car", sku: "ZP-AMP-STD55", brand: "Amperon", model: "Classic 55Ah", name: "Amperon Classic 55Ah",
      capacity: 55, voltage: 12, cca: 480, tech: "Standart", polarity: "Sağ (+)", dims: "242×175×175 mm",
      price: 112, oldPrice: 124, stock: 20, popularity: 74, added: 27,
      description: "Benzin mühərrikli kiçik və orta sinif avtomobillər üçün standart akkumulyator.",
      points: ["Texniki xidmət tələb etmir", "Etibarlı soyuq start", "Qiymət/keyfiyyət balansı"],
      warranty: "18 ay zəmanət (demo şərt)",
    },
    {
      id: "b8", category: "batteries", sub: "car", sku: "ZP-AMP-STD60", brand: "Amperon", model: "Classic 60Ah", name: "Amperon Classic 60Ah",
      capacity: 60, voltage: 12, cca: 540, tech: "Standart", polarity: "Sağ (+)", dims: "242×175×190 mm",
      price: 124, oldPrice: null, stock: 24, popularity: 82, added: 28,
      description: "Benzin mühərrikli kiçik və orta sinif avtomobillər üçün standart akkumulyator.",
      points: ["Texniki xidmət tələb etmir", "Etibarlı soyuq start", "Qiymət/keyfiyyət balansı"],
      warranty: "18 ay zəmanət (demo şərt)",
    },
    {
      id: "b9", category: "batteries", sub: "car", sku: "ZP-AMP-STD74", brand: "Amperon", model: "Classic 74Ah", name: "Amperon Classic 74Ah",
      capacity: 74, voltage: 12, cca: 680, tech: "Standart", polarity: "Sol (+)", dims: "278×175×190 mm",
      price: 152, oldPrice: null, stock: 0, popularity: 60, added: 29,
      description: "Benzin mühərrikli kiçik və orta sinif avtomobillər üçün standart akkumulyator.",
      points: ["Texniki xidmət tələb etmir", "Etibarlı soyuq start", "Qiymət/keyfiyyət balansı"],
      warranty: "18 ay zəmanət (demo şərt)",
    },
    {
      id: "b10", category: "batteries", sub: "truck", sku: "ZP-AMP-HD190", brand: "Amperon", model: "Heavy Duty 190Ah", name: "Amperon Heavy Duty 190Ah",
      capacity: 190, voltage: 12, cca: 1100, tech: "Standart", polarity: "Sol (+)", dims: "513×223×223 mm",
      price: 465, oldPrice: null, stock: 5, popularity: 48, added: 39,
      description: "Yük maşınları, avtobuslar və ağır texnika üçün gücləndirilmiş akkumulyator. Vibrasiyaya və uzun işləmə dövrlərinə davamlıdır.",
      points: ["Ağır texnika üçün", "Gücləndirilmiş plitələr", "Soyuq start cərəyanı 1100 A (EN)"],
      warranty: "12 ay zəmanət (demo şərt)",
    },
    {
      id: "r1", category: "rims", sku: "ZP-FOR-AERO17", brand: "Forgia", model: "Aero 5 R17", name: "Forgia Aero 5 R17",
      diameter: 17, rimWidth: "7.5J", pcd: "5×114.3", et: 45, dia: 67.1, finish: "Gümüşü", finishKey: "silver",
      price: 210, oldPrice: null, stock: 16, popularity: 64, added: 18, unit: "ədəd",
      description: "Beş qollu yüngül ərinti disk. Qiymət 1 ədəd üçündür.",
      points: ["Alüminium ərinti", "Korroziyaya qarşı örtük", "Qiymət 1 ədəd üçün"],
      warranty: "12 ay zəmanət (demo şərt)",
    },
    {
      id: "r2", category: "rims", sku: "ZP-FOR-STLTH18", brand: "Forgia", model: "Stealth R18", name: "Forgia Stealth R18",
      diameter: 18, rimWidth: "8J", pcd: "5×112", et: 40, dia: 66.6, finish: "Qrafit", finishKey: "graphite",
      price: 265, oldPrice: 289, stock: 8, popularity: 59, added: 19, unit: "ədəd",
      description: "Tünd qrafit örtüklü 18 düymlük disk. Qiymət 1 ədəd üçündür.",
      points: ["Mat qrafit örtük", "Yüngül konstruksiya", "Qiymət 1 ədəd üçün"],
      warranty: "12 ay zəmanət (demo şərt)",
    },
    {
      id: "o1", category: "oils", sub: "motor", sku: "ZP-LUB-5W30-4", brand: "Lubrix", model: "Synth 5W-30 4L", name: "Lubrix Synth 5W-30, 4 L",
      viscosity: "5W-30", volume: 4, oilType: "Tam sintetik", spec: "ACEA C3 (demo)",
      price: 62, oldPrice: 69, stock: 40, popularity: 87, added: 20,
      description: "Benzin və dizel mühərrikləri üçün tam sintetik mühərrik yağı. Hissəcik filtrli sistemlərə uyğundur.",
      points: ["Soyuq startda sürətli yağlama", "Aşağı külli formula", "Uzadılmış dəyişmə intervalı"],
      warranty: "Qapalı qabda 5 il saxlama müddəti (demo)",
    },
    {
      id: "o2", category: "oils", sub: "motor", sku: "ZP-LUB-0W20-4", brand: "Lubrix", model: "Synth 0W-20 4L", name: "Lubrix Synth 0W-20, 4 L",
      viscosity: "0W-20", volume: 4, oilType: "Tam sintetik", spec: "API SP (demo)",
      price: 68, oldPrice: null, stock: 25, popularity: 70, added: 21,
      description: "Hibrid və müasir benzin mühərrikləri üçün aşağı özlülüklü yağ.",
      points: ["Yanacaq qənaəti", "Hibrid mühərriklərə uyğun", "Soyuqda yüksək axıcılıq"],
      warranty: "Qapalı qabda 5 il saxlama müddəti (demo)",
    },
    {
      id: "o3", category: "oils", sub: "motor", sku: "ZP-LUB-5W40-4", brand: "Lubrix", model: "Synth 5W-40 4L", name: "Lubrix Synth 5W-40, 4 L",
      viscosity: "5W-40", volume: 4, oilType: "Tam sintetik", spec: "ACEA A3/B4 (demo)",
      price: 64, oldPrice: null, stock: 22, popularity: 72, added: 30,
      description: "Yüksək yük altında işləyən benzin və dizel mühərrikləri üçün tam sintetik yağ.",
      points: ["Yüksək temperaturda sabit yağ təbəqəsi", "Turbo mühərriklərə uyğun", "Aşınmaya qarşı qoruma"],
      warranty: "Qapalı qabda 5 il saxlama müddəti (demo)",
    },
    {
      id: "o4", category: "oils", sub: "motor", sku: "ZP-LUB-5W30-1", brand: "Lubrix", model: "Synth 5W-30 1L", name: "Lubrix Synth 5W-30, 1 L",
      viscosity: "5W-30", volume: 1, oilType: "Tam sintetik", spec: "ACEA C3 (demo)",
      price: 18, oldPrice: null, stock: 50, popularity: 65, added: 31,
      description: "Yağ səviyyəsini tamamlamaq üçün 1 litrlik qab.",
      points: ["Səviyyəni tamamlamaq üçün", "4 L versiya ilə eyni formula", "Baqajda saxlamaq rahatdır"],
      warranty: "Qapalı qabda 5 il saxlama müddəti (demo)",
    },
    {
      id: "o5", category: "oils", sub: "motor", sku: "ZP-MOT-5W30-4", brand: "Motoris", model: "Pro 5W-30 4L", name: "Motoris Pro 5W-30, 4 L",
      viscosity: "5W-30", volume: 4, oilType: "Tam sintetik", spec: "API SN (demo)",
      price: 54, oldPrice: 59, stock: 30, popularity: 79, added: 32,
      description: "Gündəlik şəhər sürüşü üçün tam sintetik mühərrik yağı.",
      points: ["Soyuq startda qoruma", "Təmizləyici aşqarlar", "Yanacaq qənaəti"],
      warranty: "Qapalı qabda 5 il saxlama müddəti (demo)",
    },
    {
      id: "o6", category: "oils", sub: "motor", sku: "ZP-MOT-10W40-4", brand: "Motoris", model: "Semi 10W-40 4L", name: "Motoris Semi 10W-40, 4 L",
      viscosity: "10W-40", volume: 4, oilType: "Yarımsintetik", spec: "API SL (demo)",
      price: 42, oldPrice: null, stock: 35, popularity: 63, added: 33,
      description: "Yaşı çox olan və yüksək yürüşlü mühərriklər üçün yarımsintetik yağ.",
      points: ["Yüksək yürüşlü mühərriklər üçün", "Sızmanı azaltmağa kömək edir", "Sərfəli qiymət"],
      warranty: "Qapalı qabda 5 il saxlama müddəti (demo)",
    },
    {
      id: "o7", category: "oils", sub: "motor", sku: "ZP-MOT-0W20-4", brand: "Motoris", model: "Eco 0W-20 4L", name: "Motoris Eco 0W-20, 4 L",
      viscosity: "0W-20", volume: 4, oilType: "Tam sintetik", spec: "API SP (demo)",
      price: 58, oldPrice: null, stock: 18, popularity: 68, added: 34,
      description: "Hibrid və müasir benzin mühərrikləri üçün aşağı özlülüklü yağ.",
      points: ["Hibrid mühərriklərə uyğun", "Maksimum yanacaq qənaəti", "Soyuqda ani yağlama"],
      warranty: "Qapalı qabda 5 il saxlama müddəti (demo)",
    },
    {
      id: "o8", category: "oils", sub: "motor", sku: "ZP-LUB-0W20-1", brand: "Lubrix", model: "Synth 0W-20 1L", name: "Lubrix Synth 0W-20, 1 L",
      viscosity: "0W-20", volume: 1, oilType: "Tam sintetik", spec: "API SP (demo)",
      price: 20, oldPrice: null, stock: 0, popularity: 52, added: 35,
      description: "Yağ səviyyəsini tamamlamaq üçün 1 litrlik qab.",
      points: ["Səviyyəni tamamlamaq üçün", "4 L versiya ilə eyni formula", "Kompakt qab"],
      warranty: "Qapalı qabda 5 il saxlama müddəti (demo)",
    },
    {
      id: "o9", category: "oils", sub: "transmission", sku: "ZP-LUB-ATF6-1", brand: "Lubrix", model: "ATF VI 1L", name: "Lubrix ATF VI, 1 L",
      viscosity: "ATF", volume: 1, oilType: "Tam sintetik", spec: "Dexron VI tipli (demo)",
      price: 24, oldPrice: null, stock: 30, popularity: 50, added: 40,
      description: "Avtomatik transmissiyalar üçün tam sintetik maye.",
      points: ["Hamar ötürmə keçidi", "Yüksək temperatur sabitliyi", "Köpüklənməyə qarşı aşqarlar"],
      warranty: "Qapalı qabda 5 il saxlama müddəti (demo)",
    },
    {
      id: "o10", category: "oils", sub: "transmission", sku: "ZP-MOT-75W90-1", brand: "Motoris", model: "Gear 75W-90 1L", name: "Motoris Gear 75W-90, 1 L",
      viscosity: "75W-90", volume: 1, oilType: "Yarımsintetik", spec: "API GL-5 (demo)",
      price: 19, oldPrice: 22, stock: 26, popularity: 47, added: 41,
      description: "Mexaniki transmissiya və reduktorlar üçün transmissiya yağı.",
      points: ["Ağır yük altında qoruma", "Soyuqda rahat ötürmə", "Korroziyaya qarşı qoruma"],
      warranty: "Qapalı qabda 5 il saxlama müddəti (demo)",
    },
    {
      id: "p1", category: "parts", partType: "filter", sku: "ZP-PWL-OF101", brand: "Partwell", model: "Yağ filtri OF-101", name: "Partwell yağ filtri OF-101",
      fits: "Toyota, Lexus (seçilmiş modellər, demo)",
      price: 14, oldPrice: null, stock: 60, popularity: 58, added: 22,
      description: "Yağ dəyişməsi zamanı əvəz olunan yağ filtri.",
      points: ["Sellüloza-sintetik filtr elementi", "Geri axın klapanı", "Yağ dəyişməsi ilə birlikdə tövsiyə olunur"],
      warranty: "6 ay zəmanət (demo şərt)",
    },
    {
      id: "p2", category: "brakes", partType: "pads", sku: "ZP-PWL-BP220", brand: "Partwell", model: "Ön əyləc bəndləri BP-220", name: "Partwell ön əyləc bəndləri BP-220",
      fits: "Hyundai, Kia (seçilmiş modellər, demo)",
      price: 58, oldPrice: null, stock: 12, popularity: 61, added: 23,
      description: "Ön ox üçün əyləc bəndləri dəsti (4 ədəd).",
      points: ["Aşağı tozlanma", "Aşınma indikatoru", "Dəst: 4 ədəd"],
      warranty: "6 ay zəmanət (demo şərt)",
    },
    {
      id: "p3", category: "brakes", partType: "pads", sku: "ZP-PWL-BP310", brand: "Partwell", model: "Arxa əyləc bəndləri BP-310", name: "Partwell arxa əyləc bəndləri BP-310",
      fits: "Toyota, Lexus (seçilmiş modellər, demo)",
      price: 46, oldPrice: 52, stock: 9, popularity: 57, added: 42,
      description: "Arxa ox üçün əyləc bəndləri dəsti (4 ədəd).",
      points: ["Sakit əyləcləmə", "Aşınma indikatoru", "Dəst: 4 ədəd"],
      warranty: "6 ay zəmanət (demo şərt)",
    }
  );

  /* Every product can carry real photos; until then the generated SVG views are used. */
  products.forEach((p) => { if (!Array.isArray(p.images)) p.images = []; });

  /* Product images: premium studio product imagery (visual edition 2), generated from
     existing demo artwork and concept packshot samples. Replace with verified real photos via `images`;
     a missing file falls back to the SVG illustration automatically. */
  products.forEach((p) => { if (!p.images.length) p.images = [`assets/images/premium/products/${p.id}.webp`]; });

  const categories = [
    { id: "tyres", name: "Təkərlər", icon: "tyre", href: "catalog.html?cat=tyres" },
    { id: "batteries", name: "Akkumulyatorlar", icon: "battery", href: "catalog.html?cat=batteries" },
    { id: "oils", name: "Mühərrik yağları", icon: "oil", href: "catalog.html?cat=oils" },
    { id: "rims", name: "Disklər", icon: "rim", href: "catalog.html?cat=rims" },
    { id: "parts", name: "Ehtiyat hissələri", icon: "cog", href: "catalog.html?cat=parts" },
    { id: "brakes", name: "Əyləc bəndləri", icon: "brake", href: "catalog.html?cat=brakes" },
    { id: "services", name: "Servis xidmətləri", icon: "wrench", href: "services.html" },
  ];

  /* Sub-categories, mirroring the menu structure of the reference site. */
  const subcats = {
    tyres: [
      { id: "sedan", name: "Minik avtomobil təkərləri", seasons: true },
      { id: "suv", name: "4x4 SUV təkərləri", seasons: true },
      { id: "ev", name: "Elektromobil təkərləri" },
      { id: "lt", name: "Yüngül yük təkərləri" },
      { id: "truck", name: "Yük və avtobus təkərləri" },
      { id: "industrial", name: "Sənaye texnikası təkərləri" },
      { id: "agri", name: "Kənd təsərrüfatı təkərləri" },
      { id: "tube", name: "Təkər kameraları" },
    ],
    batteries: [
      { id: "car", name: "Minik və yüngül yük akkumulyatorları" },
      { id: "truck", name: "Yük və ağır texnika akkumulyatorları" },
    ],
    oils: [
      { id: "motor", name: "Mühərrik yağları" },
      { id: "transmission", name: "Transmissiya yağları" },
    ],
  };

  /* Demo vehicle table: OE tyre size, battery capacity (Ah) and oil viscosity.
     Prototype only — NOT verified fitment data. */
  const vehicles = {
    Toyota: { Camry: { years: [2018, 2024], size: [215, 55, 17], battery: 70, oil: "0W-20" }, Corolla: { years: [2019, 2024], size: [205, 55, 16], battery: 60, oil: "0W-20" }, RAV4: { years: [2019, 2024], size: [225, 60, 17], battery: 70, oil: "0W-20" } },
    Hyundai: { Elantra: { years: [2021, 2024], size: [205, 55, 16], battery: 60, oil: "5W-30" }, Tucson: { years: [2021, 2024], size: [225, 60, 17], battery: 70, oil: "5W-30" }, Accent: { years: [2018, 2023], size: [185, 65, 15], battery: 45, oil: "5W-30" } },
    Kia: { Rio: { years: [2017, 2023], size: [185, 65, 15], battery: 55, oil: "5W-30" }, Sportage: { years: [2022, 2024], size: [225, 60, 17], battery: 70, oil: "5W-30" }, K5: { years: [2020, 2024], size: [215, 55, 17], battery: 60, oil: "5W-30" } },
    "Mercedes-Benz": { "E-Class": { years: [2017, 2023], size: [225, 55, 17], battery: 80, oil: "5W-30" }, "C-Class": { years: [2015, 2021], size: [225, 45, 17], battery: 70, oil: "5W-40" } },
    BMW: { "5 Series": { years: [2017, 2023], size: [225, 55, 17], battery: 80, oil: "5W-30" }, "3 Series": { years: [2019, 2024], size: [225, 45, 17], battery: 70, oil: "5W-30" } },
    Lada: { Vesta: { years: [2016, 2024], size: [185, 65, 15], battery: 60, oil: "10W-40" }, Granta: { years: [2018, 2024], size: [185, 60, 15], battery: 55, oil: "10W-40" } },
  };

  /* Branches — real addresses/phones are NOT available in the project,
     so placeholders are shown and clearly labelled. */
  const branches = [
    { id: "b-center", name: "Demo filial — Mərkəz", district: "Mərkəzi rayon", hours: "B.e.–Şənbə 09:00–19:00 (demo)", services: ["mount", "balance", "alignment", "battery", "oil"], pickup: true },
    { id: "b-north", name: "Demo filial — Şimal", district: "Şimal istiqaməti", hours: "B.e.–Bazar 09:00–20:00 (demo)", services: ["mount", "balance", "rim-repair", "battery"], pickup: true },
    { id: "b-south", name: "Demo filial — Cənub", district: "Cənub istiqaməti", hours: "B.e.–Şənbə 10:00–18:00 (demo)", services: ["mount", "balance", "alignment", "oil", "rim-repair"], pickup: true },
  ];

  const services = [
    { id: "mount", name: "Təkər quraşdırılması", icon: "tyre", duration: "30–45 dəq", desc: "Təkərlərin sökülməsi, diskə taxılması və avtomobilə quraşdırılması. Ventil və təzyiq yoxlanışı daxildir." },
    { id: "balance", name: "Balans", icon: "balance", duration: "20–30 dəq", desc: "Kompüterli balans dəzgahında təkərlərin balanslaşdırılması. Sükanda titrəmə və qeyri-bərabər aşınmanı aradan qaldırır." },
    { id: "alignment", name: "Razval (təkər bucaqları)", icon: "alignment", duration: "40–60 dəq", desc: "3D stenddə təkər bucaqlarının ölçülməsi və tənzimlənməsi. Avtomobilin düz getməsi və təkərlərin bərabər aşınması üçün." },
    { id: "rim-repair", name: "Disk təmiri", icon: "rim", duration: "1–2 saat", desc: "Əyilmiş disklərin düzəldilməsi və kiçik zədələrin bərpası. Vəziyyətə baxış filialda aparılır." },
    { id: "battery", name: "Akkumulyator quraşdırılması", icon: "battery", duration: "15–20 dəq", desc: "Köhnə akkumulyatorun sökülməsi, yenisinin quraşdırılması və şarj sisteminin yoxlanışı." },
    { id: "oil", name: "Yağ dəyişmə", icon: "oil", duration: "30–40 dəq", desc: "Mühərrik yağının və yağ filtrinin dəyişdirilməsi. Yağ səviyyəsi və sızma yoxlanışı daxildir." },
  ];

  const articles = [
    {
      id: "size",
      title: "Təkər ölçüsünü necə oxumalı?",
      excerpt: "205/55 R16 91V yazısındakı hər rəqəmin nə demək olduğunu izah edirik.",
      icon: "tyre",
      body: [
        ["p", "Təkərin yan divarında olan işarə avtomobilə uyğun təkər seçmək üçün əsas məlumatdır. Nümunə olaraq 205/55 R16 91V götürək."],
        ["ul", ["205 — protektorun eni, millimetrlə.", "55 — profil hündürlüyünün enə nisbəti, faizlə. 205 mm-in 55%-i təxminən 113 mm edir.", "R — radial konstruksiya.", "16 — disk diametri, düymlə.", "91 — yük indeksi: bir təkərin daşıya biləcəyi maksimum yük (91 = 615 kq).", "V — sürət indeksi: icazə verilən maksimum sürət (V = 240 km/s)."]],
        ["p", "Avtomobiliniz üçün tövsiyə olunan ölçü adətən sürücü qapısının yanındakı lövhədə və ya istifadəçi kitabçasında göstərilir."],
      ],
    },
    {
      id: "winter",
      title: "Qış təkərinə nə vaxt keçməli?",
      excerpt: "Gündəlik temperatur +7 °C-dən aşağı düşəndə yay təkərinin rezini bərkiyir.",
      icon: "snow",
      body: [
        ["p", "Yay təkərinin rezin qarışığı soyuqda bərkiyir və yol ilə tutuşu zəifləyir. Ümumi qəbul olunmuş qayda budur: orta gündəlik temperatur ardıcıl olaraq +7 °C-dən aşağı düşəndə qış təkərinə keçmək tövsiyə olunur."],
        ["ul", ["Protektor dərinliyini yoxlayın: qış təkəri üçün ən azı 4 mm tövsiyə olunur.", "Dörd təkəri eyni anda dəyişin, yalnız ön və ya arxa oxu yox.", "Quraşdırmadan sonra təzyiqi soyuq təkərdə yenidən yoxlayın."]],
        ["p", "Mülayim qışı olan bölgələrdə 4 fəsil təkərləri də kompromis seçim ola bilər."],
      ],
    },
    {
      id: "battery",
      title: "Akkumulyatoru qışa hazırlamaq",
      excerpt: "Soyuq havada start problemlərinin qarşısını almaq üçün sadə yoxlamalar.",
      icon: "battery",
      body: [
        ["p", "Temperatur düşdükcə akkumulyatorun verə bildiyi cərəyan azalır, mühərriki işə salmaq üçün isə daha çox enerji lazım olur."],
        ["ul", ["Klemmləri təmiz saxlayın, oksidləşməni aradan qaldırın.", "Gərginliyi ölçün: işləməyən mühərrikdə təxminən 12,6 V normal sayılır.", "Akkumulyator 4–5 ildən köhnədirsə, servisdə yük testi etdirin.", "Qısa məsafəli səfərlər akkumulyatoru tam şarj etmir — həftədə bir uzun səfər faydalıdır."]],
      ],
    },
    {
      id: "oil",
      title: "5W-30 nə deməkdir?",
      excerpt: "Mühərrik yağının özlülük işarəsini oxumağı və avtomobilinizə uyğun yağı seçməyi öyrənin.",
      icon: "oil",
      body: [
        ["p", "Yağ qabındakı 5W-30 kimi işarə yağın özlülüyünü (axıcılığını) SAE standartı ilə göstərir."],
        ["ul", ["5W — soyuq havada axıcılıq. W hərfi qış deməkdir (winter). Rəqəm nə qədər kiçikdirsə, yağ soyuqda bir o qədər tez axır: 0W soyuqda 5W-dan daha axıcıdır.", "30 — mühərrik işçi temperaturunda (təxminən 100 °C) özlülük. Rəqəm böyüdükcə yağ qatılaşır.", "Tam sintetik yağlar adətən daha geniş temperatur aralığında sabit qalır və dəyişmə intervalı daha uzun olur."]],
        ["p", "Ən doğru özlülük avtomobilin istifadəçi kitabçasında göstərilir. İstehsalçının tövsiyə etdiyi standarta (məsələn ACEA və ya API) da baxın."],
      ],
    },
  ];

  /* Video section — titles are placeholders until real videos are linked. */
  const videos = [
    { id: "v1", title: "Qışda təhlükəsiz sürüş: qış təkərinin üstünlükləri", duration: "3:42", icon: "snow" },
    { id: "v2", title: "4 fəsil təkərləri kimə uyğundur?", duration: "2:58", icon: "season" },
    { id: "v3", title: "Filialda təkər dəyişməsi və balans necə aparılır", duration: "4:15", icon: "wrench" },
  ];

  TP.data = { videos, products, categories, subcats, vehicles, branches, services, articles, SEASON };

  TP.data.byId = (id) => products.find((p) => p.id === id) || null;
  TP.data.catName = (id) => (categories.find((c) => c.id === id) || {}).name || "Məhsullar";
  TP.data.subName = (cat, id) => ((subcats[cat] || []).find((x) => x.id === id) || {}).name || "";
  TP.data.serviceName = (id) => (services.find((s) => s.id === id) || {}).name || id;
  TP.data.branchById = (id) => branches.find((b) => b.id === id) || null;
  TP.data.brands = () => Array.from(new Set(products.map((p) => p.brand)));
  TP.data.sizeLabel = (p) => {
    if (p.category === "tyres") return `${p.size} ${p.load}${p.speed}`;
    if (p.category === "batteries") return `${p.capacity}Ah · ${p.voltage}V · ${p.cca}A`;
    if (p.category === "rims") return `R${p.diameter} · ${p.rimWidth} · ${p.pcd}`;
    if (p.category === "oils") return `${p.viscosity} · ${p.volume} L`;
    return p.sku;
  };
})();
