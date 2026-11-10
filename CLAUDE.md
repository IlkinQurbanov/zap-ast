# CLAUDE.md --- TyrePortal.az Frontend UI/UX Build Guide

## 1. Layihənin məqsədi

TyrePortal.az üçün müasir, premium görünüşlü, mobil cihazlarda rahat
işləyən avtomobil məhsulları və servis e-commerce interfeysi hazırla.

Bu tapşırığın əsas məqsədi **yalnız frontend dizaynını və işlək UI
prototipini** qurmaqdır: - HTML - CSS - Vanilla JavaScript

Backend, real ödəniş, real sifariş API-si və verilənlər bazası
inteqrasiyası bu mərhələyə daxil deyil. Bütün dinamik məlumatlar
frontend demo məlumatları ilə göstərilə bilər.

Layihənin əsas istifadəçi ssenarisi:

1.  İstifadəçi avtomobilinə uyğun təkər və ya digər məhsulu tapır.
2.  Məhsulun xüsusiyyətlərini və qiymətini müqayisə edir.
3.  Məhsulu səbətə əlavə edir.
4.  Çatdırılma və ya filialdan götürmə seçir.
5.  İstəyə görə servis xidməti və vaxtı seçir.
6.  Sifariş xülasəsini görür və demo checkout mərhələsini tamamlayır.

Platforma həm B2C müştərilərə, həm də korporativ müştərilərə xidmət
göstərən avtomobil məhsulları və servis platforması kimi təqdim
olunmalıdır.

------------------------------------------------------------------------

## 2. İşə başlamazdan əvvəl

Kod yazmağa başlamazdan əvvəl:

1.  Mövcud layihənin qovluq strukturunu yoxla.
2.  Mövcud HTML, CSS, JavaScript fayllarını və istifadə olunan
    kitabxanaları araşdır.
3.  Mövcud işlək funksiyaları müəyyən et və səbəbsiz silmə.
4.  Layihədə artıq dizayn sistemi və ya komponentlər varsa, onları
    təkrar istifadə et.
5.  Mövcud texnologiya Vanilla HTML/CSS/JS-dirsə, əlavə framework
    quraşdırma.
6.  Əgər layihədə başqa build sistemi mövcuddursa, onu pozmadan işləməyə
    davam et.
7.  Dəyişikliklərdən əvvəl hansı faylları yaradacağını və ya
    yeniləyəcəyini qısa planlaşdır.

**Vacib:** Mövcud layihənin strukturunu görmədən bütün layihəni sıfırdan
yaratma. Əvvəlcə audit et, sonra minimal və səliqəli dəyişikliklərlə
irəlilə.

------------------------------------------------------------------------

## 3. Dizayn istiqaməti

### 3.1. Vizual üslub

Dizayn aşağıdakı keyfiyyətləri daşımalıdır:

-   Premium automotive e-commerce görünüşü.
-   Təmiz və müasir kompozisiya.
-   Güclü vizual iyerarxiya.
-   Məhsul şəkillərinə geniş yer.
-   Oxunaqlı şriftlər.
-   Aydın CTA düymələri.
-   İstifadəçini məhsul seçiminə yönəldən interfeys.
-   Artıq animasiya, parlaq gradient və vizual qarışıqlıqdan uzaq
    görünüş.

İlkin rəng palitrası:

  İstifadə           Rəng
  ------------------ -----------
  Əsas tünd rəng     `#172B43`
  İkinci tünd rəng   `#243B53`
  CTA / vurğu        `#F28C28`
  Əsas fon           `#F6F8FA`
  Kart fonu          `#FFFFFF`
  Əsas mətn          `#17212B`
  İkinci mətn        `#687684`
  Sərhəd             `#E3E8ED`
  Uğurlu status      `#21865B`
  Xəbərdarlıq        `#D99120`

Rəngləri CSS variables vasitəsilə idarə et. Rənglərin kontrastını WCAG
AA səviyyəsinə uyğun saxlamağa çalış.

### 3.2. Şriftlər

-   Əsas şrift: `Inter`, `Manrope` və ya layihədə mövcud olan
    keyfiyyətli sans-serif.
-   Başlıqlar güclü, amma həddindən artıq qalın olmamalıdır.
-   Qiymətlər aydın və vizual olaraq seçilən olmalıdır.
-   Azərbaycan dilində `ə, ı, ö, ü, ş, ç, ğ` simvolları düzgün
    görünməlidir.

### 3.3. Layout

-   Desktop üçün mərkəzləşdirilmiş, maksimum təxminən 1280--1440px
    kontent eni.
-   Rahat boşluqlar və ardıcıl spacing sistemi.
-   Məhsul grid-i desktop-da 3--4 sütun.
-   Tablet-də 2--3 sütun.
-   Mobil cihazda 1--2 sütun.
-   Kartların hündürlüyü və əsas elementlərin düzülüşü mümkün qədər
    ardıcıl olmalıdır.

------------------------------------------------------------------------

## 4. Hazırlanacaq əsas səhifələr

Layihənin mövcud vəziyyətinə uyğun olaraq aşağıdakı səhifələri yarat və
ya yenilə. Əgər real layihədə bəzi səhifələr artıq varsa, onları təkrar
yaratmaq əvəzinə təkmilləşdir.

### 4.1. Ana səhifə --- `index.html`

Ana səhifənin strukturu:

1.  Üst məlumat sətri:
    -   Telefon və əlaqə məlumatı üçün yer.
    -   Filiallar linki.
    -   Çatdırılma və dəstək linkləri.
2.  Header:
    -   TyrePortal loqosu.
    -   Əsas naviqasiya.
    -   Axtarış.
    -   Hesab / daxil ol.
    -   Favoritlər.
    -   Səbət.
3.  Hero bölməsi:
    -   Güclü başlıq: "Avtomobiliniz üçün düzgün təkəri tapın".
    -   Qısa izah.
    -   Ölçüyə görə axtarış.
    -   Avtomobilə görə axtarış.
    -   Əsas CTA: "Uyğun məhsulları tap".
4.  Əsas kateqoriyalar:
    -   Təkərlər.
    -   Akkumulyatorlar.
    -   Disklər.
    -   Mühərrik yağları.
    -   Ehtiyat hissələri.
    -   Servis xidmətləri.
5.  Mövsümi kampaniya banneri.
6.  Populyar məhsullar.
7.  Endirimli məhsullar.
8.  Brendlər.
9.  "Niyə TyrePortal?" üstünlükləri:
    -   Məhsul çeşidi.
    -   Filialdan götürmə.
    -   Çatdırılma.
    -   Zəmanət və dəstək.
10. Servis xidmətləri və rezervasiyaya keçid.
11. Korporativ müştərilər üçün B2B banneri.
12. Bloq / faydalı məqalələr.
13. Footer:

-   Kateqoriyalar.
-   Şirkət haqqında.
-   Əlaqə.
-   Filiallar.
-   Sosial şəbəkələr.
-   Ödəniş və çatdırılma məlumatları.

Hero bölməsində əsas məqsəd istifadəçini dərhal məhsul axtarışına
yönəltməkdir. Slayderdən istifadə etmək vacib deyil; bir güclü statik
hero daha yaxşı ola bilər.

### 4.2. Məhsul kataloqu --- `catalog.html`

Elementlər:

-   Breadcrumb.
-   Səhifə başlığı və nəticələrin sayı.
-   Sol tərəfdə filter paneli.
-   Mobil versiyada filter drawer.
-   Sort:
    -   Tövsiyə olunan.
    -   Əvvəlcə ucuz.
    -   Əvvəlcə bahalı.
    -   Ən populyar.
    -   Ən yeni.
-   Məhsul grid-i.
-   Pagination və ya "Daha çox göstər".
-   Aktiv filter-lərin chip-ləri.
-   Filter-ləri təmizləmək.

Təkər kateqoriyası üçün filter nümunələri:

-   En: 185, 195, 205 və s.
-   Profil: 55, 60, 65 və s.
-   Diametr: R15, R16, R17 və s.
-   Mövsüm: Yay, Qış, 4 fəsil.
-   Brend.
-   Qiymət aralığı.
-   Stokda olanlar.
-   Run-flat.
-   Yanacaq səmərəliliyi.
-   Yaş yolda tutuş.
-   Səs səviyyəsi.

Filter-lər real demo məhsul datasına təsir etməli, yalnız dekorativ
element kimi qalmamalıdır.

### 4.3. Məhsul detalları --- `product.html`

Səhifədə:

-   Breadcrumb.
-   Məhsul şəkilləri qalereyası.
-   Məhsul adı və brend.
-   SKU / məhsul kodu.
-   Qiymət və əvvəlki qiymət.
-   Stok statusu.
-   Say seçimi.
-   Səbətə əlavə et.
-   Favoritlərə əlavə et.
-   Çatdırılma / filialdan götürmə məlumatı.
-   Zəmanət məlumatı.
-   Texniki xüsusiyyətlər.
-   Məhsul təsviri.
-   Rəylər üçün bölmə.
-   Oxşar məhsullar.
-   "Avtomobilimə uyğundurmu?" məlumatı.

Təkər məhsulu üçün texniki göstəricilər:

-   En.
-   Profil.
-   Diametr.
-   Yük indeksi.
-   Sürət indeksi.
-   Mövsüm.
-   İstehsalçı.
-   İstehsal ölkəsi.
-   Yanacaq səmərəliliyi.
-   Yaş yolda tutuş.
-   Səs səviyyəsi.
-   DOT / istehsal tarixi --- məlumat mövcud deyilsə, uydurma göstərmə.

**Məhsul məlumatlarında ziddiyyət yaratma.** Məsələn, məhsul yay
təkəridirsə, başlıqda və təsvirində qış və ya 4 fəsil kimi təqdim
edilməməlidir.

### 4.4. Səbət --- `cart.html`

-   Məhsul şəkli, adı və xüsusiyyətləri.
-   Sayı artırmaq / azaltmaq.
-   Məhsulu silmək.
-   Məhsul üzrə ara cəm.
-   Çatdırılma xərci üçün demo sətir.
-   Kupon input-u.
-   Ümumi məbləğ.
-   Checkout düyməsi.
-   Boş səbət vəziyyəti.

Səbət məlumatını `localStorage`-da saxlamaq olar ki, səhifə yenilənəndə
silinməsin.

### 4.5. Checkout --- `checkout.html`

Demo checkout mərhələləri:

1.  Əlaqə məlumatları.
2.  Çatdırılma üsulu:
    -   Ünvan üzrə çatdırılma.
    -   Filialdan götürmə.
3.  Filial seçimi.
4.  Servis xidməti əlavə etmək --- istəyə bağlı.
5.  Ödəniş üsulu --- yalnız demo UI.
6.  Sifariş xülasəsi.
7.  Şərtlərlə razılıq.
8.  Sifarişi təsdiqlə.

Real ödəniş inteqrasiyası qurma. Demo rejimində istifadəçiyə bunun
test/prototip olduğu aydın olsun.

### 4.6. Servis səhifəsi --- `services.html`

Xidmət kartları:

-   Təkər quraşdırılması.
-   Balans.
-   Razval.
-   Disk təmiri.
-   Akkumulyator quraşdırılması.
-   Yağ dəyişmə.

Hər xidmət kartında:

-   Xidmət adı.
-   Qısa izah.
-   Xidmət müddəti üçün demo məlumat.
-   Qiymət və ya "Qiymət üçün müraciət".
-   "Rezervasiya et" CTA.

### 4.7. Servis rezervasiyası --- `booking.html`

Demo rezervasiya axını:

1.  Filial seç.
2.  Xidmət seç.
3.  Avtomobil məlumatlarını daxil et.
4.  Tarix seç.
5.  Mövcud demo saatlardan birini seç.
6.  Ad və telefon daxil et.
7.  Müraciəti təsdiqlə.

Eyni demo slot seçildikdə UI həmin slotu seçilmiş kimi göstərməlidir.
Real server rezervasiyası və konflikt yoxlaması bu mərhələyə daxil
deyil.

### 4.8. B2B səhifəsi --- `business.html`

Korporativ müştərilər üçün ayrıca landing page:

-   Avtoparklar üçün təchizat.
-   Topdan sifariş.
-   Şirkətə özəl qiymətlər.
-   Müqavilə əsasında əməkdaşlıq.
-   Şəxsi satış meneceri.
-   Korporativ müraciət forması.

Form sahələri:

-   Şirkətin adı.
-   Əlaqədar şəxsin adı.
-   Telefon.
-   E-mail.
-   Şirkətin avtomobil sayı --- istəyə bağlı.
-   Maraqlanılan məhsul/xidmət.
-   Qeyd.

Form submit zamanı backend-ə sorğu göndərmə. Frontend validation və
uğurlu demo mesajı göstər.

### 4.9. Filiallar --- `branches.html`

-   Filial kartları.
-   Ünvan.
-   Telefon.
-   İş saatları.
-   Xidmətlər.
-   "Xəritədə aç" linki üçün placeholder.
-   Rezervasiya CTA.

Real ünvan və telefon məlumatları mövcud layihədən götürülməlidir.
Məlumat yoxdursa, uydurma real əlaqə məlumatı yazma; demo placeholder
olduğunu açıq göstər.

------------------------------------------------------------------------

## 5. Əsas reusable UI komponentləri

Komponentləri təkrar istifadə edilə bilən şəkildə qur:

-   `Header`
-   `Footer`
-   `SearchBar`
-   `VehicleSelector`
-   `TireSizeSelector`
-   `CategoryCard`
-   `ProductCard`
-   `ProductGrid`
-   `FilterSidebar`
-   `FilterDrawer`
-   `Price`
-   `StockBadge`
-   `Breadcrumb`
-   `Pagination`
-   `CartDrawer`
-   `Toast`
-   `Modal`
-   `BranchCard`
-   `ServiceCard`
-   `BookingCalendar`
-   `FormField`
-   `EmptyState`
-   `LoadingState`

Vanilla JS istifadə edilirsə, komponentləri kiçik funksiyalar və
template-lər formasında təşkil et. Eyni HTML bloklarını müxtəlif
səhifələrdə təkrar-təkrar yazma.

------------------------------------------------------------------------

## 6. JavaScript funksionallığı

Aşağıdakı funksiyalar işlək olmalıdır:

### Məhsullar

-   Məhsul datasını JS obyektlərindən oxu.
-   Kateqoriyaya görə filter.
-   Brendə görə filter.
-   Qiymətə görə filter.
-   Sort.
-   Axtarış.
-   Məhsul detalına keçid.
-   Favoritə əlavə et / sil.

### Səbət

-   Səbətə əlavə et.
-   Sayı dəyiş.
-   Məhsulu sil.
-   Ara cəmi hesabla.
-   Ümumi məbləği hesabla.
-   Header səbət sayını yenilə.
-   `localStorage` ilə saxla.

### Axtarış

-   Məhsul adına görə axtarış.
-   Təkər ölçüsünə görə axtarış.
-   Nəticə olmadıqda empty state göstər.

### Formlar

-   Required sahələri yoxla.
-   Telefon və e-mail formatını yoxla.
-   Səhv mesajlarını sahənin yanında göstər.
-   Submit zamanı demo success notification göstər.
-   Form göndərilərkən düyməni müvəqqəti disabled et.

### UI

-   Mobil menyu.
-   Filter drawer.
-   Modal.
-   Toast notification.
-   Accordion.
-   Tab.
-   Quantity stepper.
-   Back-to-top.
-   Dropdown-lar.

Bütün interaktiv elementlər həqiqətən işləməlidir. Yalnız görünüş üçün
düymə yaradıb funksiyasız saxlama.

------------------------------------------------------------------------

## 7. Fayl strukturu

Mövcud layihənin strukturuna uyğunlaşdır. Əgər layihə boşdursa,
aşağıdakı strukturdan istifadə et:

``` text
tyreportal-frontend/
├── index.html
├── catalog.html
├── product.html
├── cart.html
├── checkout.html
├── services.html
├── booking.html
├── business.html
├── branches.html
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── css/
│   ├── variables.css
│   ├── reset.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── pages.css
│   └── responsive.css
└── js/
    ├── data/
    │   └── products.js
    ├── components/
    │   ├── header.js
    │   ├── product-card.js
    │   ├── toast.js
    │   └── modal.js
    ├── modules/
    │   ├── catalog.js
    │   ├── product.js
    │   ├── cart.js
    │   ├── checkout.js
    │   ├── booking.js
    │   └── forms.js
    └── app.js
```

Bütün səhifələrdə CSS və JS yollarının düzgün olduğuna əmin ol.

------------------------------------------------------------------------

## 8. Responsive tələblər

Ən azı aşağıdakı ekran enlərində yoxla:

-   360px --- kiçik mobil.
-   390px --- standart mobil.
-   768px --- tablet.
-   1024px --- kiçik desktop.
-   1440px --- geniş desktop.

Tələblər:

-   Horizontal overflow olmamalıdır.
-   Mətnlər kəsilməməlidir.
-   Məhsul şəkilləri deformasiyaya uğramamalıdır.
-   Mobil menyu işləməlidir.
-   Formlar mobil ekranda rahat doldurulmalıdır.
-   CTA düymələri toxunmaq üçün kifayət qədər böyük olmalıdır.
-   Sticky elementlər kontenti örtməməlidir.
-   Filter paneli mobil cihazda drawer kimi açılmalıdır.

------------------------------------------------------------------------

## 9. Accessibility və keyfiyyət

-   Semantik HTML istifadə et: `header`, `nav`, `main`, `section`,
    `footer`.
-   Hər input-un `label` elementi olsun.
-   Şəkillərə uyğun `alt` əlavə et.
-   Klaviatura ilə naviqasiya mümkün olsun.
-   Focus state-ləri görünən olsun.
-   Rəng kontrastına diqqət et.
-   Modal açıldıqda fokus idarəetməsini nəzərə al.
-   `button` və `a` elementlərini düzgün məqsədlə istifadə et.
-   HTML-də təkrarlanan ID yaratma.
-   Console-da JavaScript error olmamalıdır.
-   Brauzer ölçüsü dəyişəndə layout pozulmamalıdır.

SEO üçün: - Hər səhifədə unikal `title`. - Meta description. - Düzgün
heading ardıcıllığı. - Canonical üçün placeholder və ya mövcud URL. -
Məhsul şəkillərində təsviri alt text. - Sosial paylaşım meta tag-ləri
üçün uyğun struktur.

------------------------------------------------------------------------

## 10. Şəkillər və demo məlumatlar

-   Mövcud layihədəki real məhsul şəkillərini və loqonu prioritetlə
    istifadə et.
-   Şəkil yoxdursa, uyğun neytral placeholder istifadə et.
-   Eyni məhsul üçün müxtəlif, əlaqəsiz şəkillər göstərmə.
-   Şəkilləri `object-fit: contain` və ya uyğun kontekstlə göstər.
-   Şəkil yüklənmədikdə fallback göstər.
-   Real stok, real qiymət, real rəy və real reytinq uydurma.
-   Demo məhsul datası istifadə edilirsə, onun prototip məlumatı
    olduğunu kodda aydın saxla.
-   Xarici şəkil URL-lərini mümkün olduqda lokal asset-lərlə əvəz et.

------------------------------------------------------------------------

## 11. Kod standartları

-   Təmiz, oxunaqlı və modulyar kod yaz.
-   CSS class adlarında ardıcıl naming convention istifadə et.
-   Inline CSS-dən mümkün qədər uzaq dur.
-   JavaScript-də global dəyişənləri minimuma endir.
-   `const` və `let` istifadə et; `var` istifadə etmə.
-   `innerHTML`-ə istifadəçi input-unu birbaşa yerləşdirmə.
-   DOM elementləri mövcud olmaya bilər; JS kodunda bunu nəzərə al.
-   Təkrarlanan kodu funksiyalara çıxar.
-   Magic number-ları CSS variables və ya konfiqurasiya obyektlərində
    saxla.
-   Lazımsız kitabxana və dependency əlavə etmə.

------------------------------------------------------------------------

## 12. İş ardıcıllığı

İşi aşağıdakı mərhələlərlə yerinə yetir:

### Mərhələ 1 --- Audit

-   Layihə strukturunu yoxla.
-   Mövcud səhifələri müəyyən et.
-   Mövcud asset-ləri tap.
-   Təkrar istifadə ediləcək kodu müəyyən et.
-   Riskləri və çatışmayan səhifələri qeyd et.

### Mərhələ 2 --- Design system

-   CSS variables.
-   Typography.
-   Spacing.
-   Buttons.
-   Inputs.
-   Cards.
-   Badges.
-   Navigation.
-   Grid sistemi.

### Mərhələ 3 --- Əsas səhifələr

Bu ardıcıllıqla hazırla: 1. Ana səhifə. 2. Kataloq. 3. Məhsul detalı. 4.
Səbət. 5. Checkout.

### Mərhələ 4 --- Əlavə biznes səhifələri

1.  Servis xidmətləri.
2.  Servis rezervasiyası.
3.  B2B.
4.  Filiallar.

### Mərhələ 5 --- JavaScript

-   Axtarış.
-   Filter.
-   Sort.
-   Səbət.
-   Favoritlər.
-   Form validation.
-   Modal və drawer.
-   Demo rezervasiya.

### Mərhələ 6 --- Test

-   Bütün səhifələri aç.
-   Bütün linkləri yoxla.
-   Bütün düymələri yoxla.
-   Mobil və desktop ölçülərini yoxla.
-   Console error-ları aradan qaldır.
-   Boş və səhv məlumat vəziyyətlərini yoxla.

------------------------------------------------------------------------

## 13. Qəbul meyarları

İş yalnız aşağıdakı şərtlər yerinə yetirildikdə tamamlanmış sayılır:

-   [ ] Bütün əsas səhifələr hazırlanıb.
-   [ ] Bütün səhifələr eyni dizayn sistemindən istifadə edir.
-   [ ] Header və footer ardıcıldır.
-   [ ] Ana səhifədə avtomobil/təkər axtarışı görünür.
-   [ ] Kataloq filter və sort funksiyaları işləyir.
-   [ ] Məhsul detalı səhifəsi işləyir.
-   [ ] Səbətə məhsul əlavə etmək mümkündür.
-   [ ] Səbət məlumatı `localStorage`-da saxlanılır.
-   [ ] Səbətdə say və məbləğ düzgün hesablanır.
-   [ ] Checkout demo axını işləyir.
-   [ ] Servis rezervasiya forması işləyir.
-   [ ] B2B forması validation edir.
-   [ ] Mobil menyu işləyir.
-   [ ] Mobil filter drawer işləyir.
-   [ ] 360px-dən 1440px-ə qədər layout pozulmur.
-   [ ] Console-da kritik error yoxdur.
-   [ ] Saxta real qiymət, stok, telefon və ünvan məlumatı təqdim
    edilmir.
-   [ ] Mövcud layihənin işlək funksiyaları səbəbsiz pozulmayıb.

------------------------------------------------------------------------

## 14. Claude üçün son göstəriş

Sən bu layihədə Senior Frontend Developer və UI/UX Designer kimi
davranmalısan.

Sadəcə vizual maket yaratma. Real istifadəçi ssenarilərini nəzərə alaraq
işlək frontend prototipi hazırla.

Prioritetlər:

1.  İstifadə rahatlığı.
2.  Məhsulun tez tapılması.
3.  Satışa aparan aydın istifadəçi axını.
4.  Mobil UX.
5.  Səliqəli və davamlı kod arxitekturası.
6.  Bütün əsas interaksiyaların işləməsi.

İlk olaraq mövcud layihəni audit et və qısa plan təqdim et. Sonra təsdiq
gözləmədən, mövcud kodu qoruyaraq mərhələli şəkildə implementasiyaya
başla.

Hər mərhələdən sonra: - Dəyişdirilmiş faylları sadala. - Hazır olan
funksiyaları qeyd et. - Test nəticələrini bildir. - Qalan problemləri
açıq göstər.

**Nəticə:** TyrePortal.az üçün premium, sürətli, responsive və satış
yönümlü HTML/CSS/Vanilla JavaScript frontend təcrübəsi.
