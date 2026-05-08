# Engines of Growth AR — Egyptian Arabic Localization Plan

**Goal:** Make the exact `EnginesOfGrowth` reel in natural Egyptian Arabic while keeping the same visual structure, scene order, animations, examples, and timing logic. Only localized text, narration, voice, composition id, and audio path change.

**Voice:** ElevenLabs `OFHP1Qg30FPoNfkUFFlA` — Adam Narrator, Egyptian Arabic. Model: `eleven_v3`.

**Localization rules:**

- On-screen explanatory text becomes Arabic.
- Business acronyms stay English: `MRR`, `ARR`, `CAC`, `LTV`, `K`.
- Numbers stay English in designed on-screen labels where needed, but narration says numbers in Egyptian Arabic: `تلات`, `عشرين`, `تمنية`, `أربعين`, `مية وعشرين`, `تسعين`.
- Brand names stay English: `Spotify`, `TikTok`, `Amazon`, `Etsy`, `YouTube`, `Shopify`, `Google Ads`, `Netflix`.
- Tone is Egyptian spoken Arabic, not literal translation. English business words may appear naturally inside Arabic sentences, but only where they are normal business terms: `Sticky`, `Viral`, `Paid`, `retention`, `churn`, `MRR`, `ARR`, `K`, `LTV`.
- `CAC` is spoken as `كاك` and defined as `تكلفة الاستحواذ على العميل`.
- Animations stay the same: same primitives, same positions, same reveal beats, same diagrams.

## Scene Plan

### 01-problem

- **Visual:** Same three business cards and bottom engine prompt.
- **On-screen text:** `النمو مش نوع واحد`, card labels `اشتراك`, `تطبيق اجتماعي`, `متجر منتجات`, rules `يفضل`, `يشارك`, `يرجع فلوسه`, bottom band `اختار المحرك`.
- **Narration:** `النمو مش نفس اللعبة لكل مشروع... الأول لازم تعرف مشروعك محتاج أنهي محرك نمو.`
- **Sync:** Cards reveal on `اشتراك`, `مشاركة`, `منتجات`; final prompt reveals on `محرك`.

### 02-framework

- **Visual:** Same three test panels: retention scale, viral tree, paid ad funnel.
- **On-screen text:** Engine labels may stay `STICKY`, `VIRAL`, `PAID`; explanatory labels become Arabic where they are not acronyms. Rules remain `NEW > CHURN`, `K > 1`, `LTV > CAC`.
- **Narration:** `فيه تلات محركات نمو. Sticky معناه retention: تحافظ على العملاء ويدفعوا تاني... كل محرك ليه اختبار واضح.`
- **Sync:** Tests reveal on `Sticky`, `Viral`, `Paid`, `اختبار`.

### 03-sticky

- **Visual:** Same leaky bucket animation.
- **On-screen text:** Arabic labels for `عملاء جداد`, `churn`, and `عملاء لسه بيدفعوا`; compact rule stays close to `NEW > CHURN` where used as a formula.
- **Narration:** `في Sticky، فكر فيها زي Spotify. عملاء جداد بيدخلوا، والchurn بيطلع ناس بره... المهم إن الجداد يكونوا اكتر.`
- **Sync:** Bucket fill on `جداد`, leak on `churn`, success on `اكتر`.

### 04-sticky-example

- **Visual:** Same MRR/ARR replacement scene from English V8: users feed MRR bar, ARR = MRR × 12 bricks, churn removes a retained user.
- **On-screen text:** Keep `MRR · ARR`, `MRR / MONTH`, `ARR = MRR × 12`, numbers in English; Arabic helper labels where needed.
- **Narration:** Egyptian Arabic explanation of `MRR` and `ARR` with Spotify example, with numbers spoken as `عشرة`, `مليون`, `اتناشر`, and `الchurn`.
- **Sync:** `MRR` reveals monthly bar; `مليون` expands user scale; `ARR` reveals 12-month row; `الchurn` triggers red loss panel.

### 05-viral

- **Visual:** Same branching user tree.
- **On-screen text:** `K = مستخدمين جدد من كل مستخدم`, `فوق 1`, `أقل من 1`.
- **Narration:** `Viral معناه إن المستخدمين يجيبوا مستخدمين... لو K أكبر من واحد... لو أقل من واحد...`
- **Sync:** Use `Viral`, `K`, `أكبر`, `أقل` as cue words.

### 06-viral-example

- **Visual:** Same buyers/sellers and media app audience diagram.
- **On-screen text:** Arabic labels for marketplace/media/app concepts; brand tags stay English.
- **Narration:** `ليه الجمهور مهم؟ لأن في مشاريع كتير بتبيع وصول للجمهور... هنا الجمهور نفسه هو المنتج.`
- **Sync:** Marketplace and media blocks reveal on `ليه`, `وصول`, `Amazon`, `البياعين`, `YouTube`, `المعلنين`, `المنتج`.

### 07-paid

- **Visual:** Same paid machine: CAC spend funnel, LTV month timeline, scale/loss verdict.
- **On-screen text:** Keep `CAC`, `LTV`, `$40`, `$90`, `$120`, `$60`, `SCALE`, `LOSS`; Arabic helper labels where not acronyms.
- **Narration:** Paid money machine explanation with `كاك يعني تكلفة الاستحواذ على العميل`, Google Ads, Shopify, and `LTV` payback.
- **Sync:** Cues use `Paid`, `كاك`, `تدفع`, `Shopify`, `LTV`, `تلاتين`, `نكبر`, `تسعين`.

### 08-trap

- **Visual:** Same trap carousel.
- **On-screen text:** Arabic warnings where possible, acronyms unchanged.
- **Narration:** `المحرك الغلط يعمل فخ... الإعلانات... مستخدمين لوحدهم... Viral... بيخسر...`
- **Sync:** Trap cues use `إعلانات`, `لوحدهم`, `Viral`, `بيخسر`.

### 09-diagnostic

- **Visual:** Same diagnostic path with three rows.
- **On-screen text:** Arabic questions; brand examples stay English; engine labels stay `STICKY`, `VIRAL`, `PAID`.
- **Narration:** `اسأل ببساطة: العملاء بيرجعوا... المستخدمين بيخلوا المنتج أقوى... تقدر تشتري عميل...`
- **Sync:** Use `اسأل`, `بيرجعوا`, `المستخدمين`, `تشتري`.

### 10-outro

- **Visual:** Same equation lock and ending band.
- **On-screen text:** Arabic headline with English equation: `خلّي المعادلة صح` and `____ > ____`.
- **Narration:** `اختار محرك النمو اللي مشروعك محتاجه. وبعدها ظبط المعادلة...`
- **Sync:** `اختار` starts the scene; `أكتر` reveals the final equation band.

## Smoke-Test Requirements

- Render stills at start/mid/end of each scene after Arabic voiceover updates the manifest.
- Extra checks: scene 01 card labels and bottom prompt, scene 04 MRR/ARR labels, scene 06 audience labels, scene 07 CAC arrow tip, scene 08 trap warnings, scene 10 equation headline.
- Check Arabic text direction/readability, no overlap, no clipped glyphs, and phone-readable font sizes.
