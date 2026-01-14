> ATH: Þetta README veitir yfirlit yfir virkni sem er raunverulega útfærð og prófuð í lokaverkefninu.  
> Við mótun verkefnisins var stuðst við gervigreind sem hjálpartæki til að bera saman fyrirmynd af lokaverkefni og þá hugmynd sem liggur að baki þessu kerfi.  
> Gervigreindin kom m.a. með tillögur að útfærslum og notkunartilvikum sem miðuðu að því að tryggja að verkefnið uppfyllti sett skilyrði lokaverkefnisins.  
> Allar lausnir, útfærslur og samþættingar hafa þó verið yfirfarnar, aðlagaðar og útfærðar af höfundi sjálfum.
>
> README hefur verið uppfært samhliða þróun verkefnisins.  
> Helstu breytingar: 9.12.2025, 13.12.2025, 27.12.2025, 7.1.2026.  
> Lokaútgáfa: 11.1.2026

## Uppruni hugmyndar og tengd framendaverkefni

Hugmyndin að Hryssa API varð til í tengslum við Flutter app sem byrjað var að hanna samhliða náminu, áður en farið var í lokaverkefnið. Appið fól í sér einfalt utanumhald um hryssur, graðhesta og girðingar og varð kveikjan að því viðfangsefni sem lokaverkefnið byggir á.

Í lokaverkefninu var bakendakerfið síðan hannað og útfært sjálfstætt, með áherslu á skýra API-hönnun, gagnalíkan, heimildir og prófanir, í samræmi við kröfur lokaverkefnis.

Hugmynd að framenda og stutt verklýsing má finna á Figma: https://www.figma.com/design/nKf9PYlMcwSYV4gmYwXIrD/Hryssa---app---web-2.0

Flutter appið, sem var þróað áður en lokaverkefnið hófst, er aðgengilegt hér: https://github.com/gkolbeins/hryssa_app


# Hryssa API - Lokaverkefni á 3. önn

Bakendakerfi fyrir app og vef sem heldur utan um hryssur, graðhesta, girðingar og stöðu þeirra (hvar hver hryssa er, hjá hvaða hesti, hvort fyl sé staðfest, þarf dýralækni). Kerfið styður auðkenningu, leit, flutninga milli girðinga, tengingu við eigendur, leit eftir örmerkjum o.fl. og uppfærslu upplýsinga um hryssur.
Raunhugmynd kerfisins er að vera bakendi fyrir app sem er eins konar "minnisblokk" fyrir eiganda stóðhests þar sem hann heldur utan um hryssur sem koma til hans og getur skráð upplýsingar. Einhverjum kröfum hefur verið bætt við eða breytt til að uppfylla skilyrði lokaverkefnis.

## Yfirlit

Hryssa API er RESTful þjónusta sem sér um:
- Skrá og sækja hryssur (upplýsingar, örmerki og jafnvel mynd)
- Skrá, sækja og uppfæra eigin notandaprófíl
- Skrá og sækja girðingar (paddock)
- Skrá og sækja graðhesta (stallions, örmerki)
- Skrá stöðutákn: þarf dýralækni, fyl staðfest
- Lesa örmerki / chip_id (lesið með bluetooth tengdum örmerkjalesara í framenda)
- Flytja hryssu í aðra girðingu / undir annan graðhest
- Leita að hryssu eftir örmerki, nafni, eiganda, staðsetningu eða valkvæðum reitum (2 auka valkvæðir reitir fyrir td gælunafn eða frostmerki)
- Auðkenningu notenda með JWT
- Heimildir:
  - eigandi hryssu getur breytt upplýsingum um hryssu
  - eigandi paddock/graðhests hefur heimild til flutnings (UC7)
  - til vara er að kerfið sé eingöngu ætlað eigendum graðhesta/girðinga til utanumhalds!

## Tækni

- Express.js með TypeScript
- PostgreSQL
- JWT auðkenning
- Vitest + Supertest prófanir
- RESTful API hönnun
- Villumeðhöndlun og inntaksstaðfesting

## Uppsetning

Afritaðu verkefnið og settu upp:

git clone https://github.com/gkolbeins/Lokaverkefni  
cd Lokaverkefni
  
npm install  
npm run dev  

Keyra gagnagrunn:  
Búa til PostgreSQL gagnagrunn `hryssa`  
Keyra SQL skipanir í `schema.sql`
> Athugið: Gagnagrunnur er ekki sjálfkrafa búinn til. PostgreSQL þarf að vera keyrandi og `schema.sql` keyrt handvirkt (t.d. í pgAdmin eða psql).

Keyra prófanir:  
npm test  

## Umhverfisbreytur (.env)

Búðu til `.env` skrá með:

DATABASE_URL=postgresql://postgres:password@localhost:5432/hryssa  
JWT_SECRET=supersecretsecret  
PORT=3000  

> Athugið að uppfæra password í samræmi við Postgres uppsetningu

## Möppuskipulag

src/  
- routes/  
- controllers/  
- services/  
- middleware/    
- utils/  
- config/  
- index.ts  

tests/  
- auth/  
- horses/  
- stallions/  
- paddock/     
- usecase_tests/

README.md     
NOTES.md – þróunarsaga verkefnisins, ákvarðanir og rökstuðningur  

## Gagnagrunnsskema

### users
- id
- name
- phone
- email (unique)
- password_hash
- created_at

### horses (hryssur)
- id
- name
- is_number (IS-nr)
- chip_id (örmerki)
- owner_id (FK users)
- current_paddock_id (FK paddock)
- current_stallion_id (FK stallions)
- needs_vet (bool)
- pregnancy_confirmed (bool)
- notes (text)
- other_info_1 
- other_info_2
- created_at
- owner_name
- owner_phone
- owner_email
- arrival_date

### paddock (girðingar)
- id
- name
- location (farm name / staðsetning)
- owner_id
- stallion_id

### stallions (graðhestar)
- id
- name
- is_number (IS-nr)
- chip_id (örmerki)
- notes
- created_at

### optional history (ekki útfært í lokaverkefni)
- horse_id
- paddock_id
- stallion_id
- timestamp

## API Endapunktar

### Auth
POST /auth/register  
POST /auth/login   
PATCH /auth/me  
DELETE /auth/me  

### Horses (hryssur)
GET /horses  
GET /horses/:id  
GET /horses?search=eitthvað 
POST /horses  
PATCH /horses/:id  
DELETE /horses/:id  

### Paddock (girðingar)
GET /paddocks  
GET /paddocks/:id  
GET /paddocks/:id/horses  
POST /paddocks  
PATCH /paddocks/:id  
DELETE /paddocks/:id  

### Stallions (graðhestar)
GET /stallions  
POST /stallions  
PATCH /stallions/:id  
DELETE /stallions/:id  

### Status flags
- Uppfært í gegnum PATCH /horses/:id
- Body getur innihaldið: { needs_vet, pregnancy_confirmed }

### Flytja hryssu
POST /horses/:id/move  
Body: paddockId, stallionId  

### Örmerki (chip_id)
- Chip ID er geymt sem frjáls texti (TEXT)
- Kerfið setur engar kröfur á format
- Bil og sértákn eru leyfileg
- Eitt hross getur aðeins verið með eitt örmerki (unique)
- Markmiðið er að styðja fjölbreytt raunveruleg örmerki

### IS-númer (is_number)
IS-númer er skráningarnúmer íslenskra hrossa og er geymt sem texti (`TEXT`).
Uppbygging IS-númers:
- **IS** – táknar Ísland (ATH önnur lönd skv. worldfeng)
- **4 tölustafir** – fæðingarár hests
- **1 tölustafur** – kyn
  - `1` = hestur
  - `2` = hryssa
- **2 tölustafir** – landsvæði
- **3 tölustafir** – raðnúmer
Dæmi:
- `IS2018185630`
> Athugið:  
> Kerfið framkvæmir **ekki strangt format-validation** á IS-númerum til að tryggja sveigjanleika og mögulega notkun utan Íslands.  
> Í uppfærslum (`PATCH`) er þó framkvæmd **einföld staðfesting** á því að gildið sé á væntu textaformi áður en það er vistað, til að koma í veg fyrir augljóslega ógild gögn.

### Leit að hryssu (Search)
- Notandi getur leitað með einu leitarorði
- Leitað er í: name, chip_id, is_number, other_info_1, other_info_2
- Útfært með GET /horses?search=
- Leit er case-insensitive og styður hluta strengja

## Notkunartilvik (Use Cases)

### UC1 – Skoða lista af hryssum - ✅
- Sía eftir girðingu, graðhesti, chip_id
- Raða eftir nafni eða aldri
- Leyfir samsettar síur (combo filters)
- Sjálfgefin röðun: default ORDER BY id ASC

### UC2 – Skoða upplýsingar um mína hryssu/hryssur - ✅
- Nafn, IS-nr, chip ID
- Eigandi og hlekkir: sími og email (front-end getur gert „click to call / click to email“)
- Núverandi girðing
- Graðhestur
- Stöður: needs_vet, pregnancy_confirmed

### UC3 – Skoða girðingu - ✅
- Birta staðsetningu
- Lista allar hryssur í þessari girðingu
- Birta graðhest ef skráður

### UC4 – Skrá notanda - ✅
- Nafn, sími, email, lykilorð
- email unique
- Lykilorð hössuð

### UC5 – Innskráning - ✅
- Skilar JWT token

### UC6 – Skrá nýja hryssu - ✅
- Nafn, IS-nr, chip, eigandi
- Girðing og graðhestur eru valkvæð
- arrival_date er skráð við flutning (sjá UC7)

### UC7 – Flytja hryssu - ✅
- Uppfærir current_paddock og current_stallion
- arrival_date er skráð við flutning
- Kerfið heldur aðeins utan um núverandi stöðu

#### Athugasemd við UC7
> UC7 er útfært í einfaldri útgáfu, við flutning hryssu er uppfært:  
> current_paddock_id  
> (current_stallion_id ef við á)  
> arrival_date sem merkir komudag í núverandi girðingu.  
> Dvöl er ekki vistuð sem sér tafla og ekki talin þörf á því, kerfið heldur aðeins utan um núverandi stöðu.  
> departure_date er ekki hluti af þessari útgáfu verkefnisins (mögulega alls ekki þarft í notkun kerfisins).

### UC8 – Merkja stöðu - ✅
- needs_vet = true/false
- pregnancy_confirmed = true/false
- við true skráist dagsetning þegar fyl er staðfest

### UC9 – Uppfæra prófíl notanda - ✅
- Nafn, sími, email
- email unique

### UC10 – Eyða notandareikningi - ✅
- Eyðir notanda og öllum tengdum hrossum (ON DELETE CASCADE)

#### Athugasemd við UC10
> Við eyðingu notandareiknings er athugað hvort notandi eigi graðhesta eða girðingar.  
> Ef svo er þarf notandi að staðfesta eyðingu sérstaklega (confirm = true).  
> Allar hryssur eyðast sjálfkrafa (ON DELETE CASCADE).

## Prófanir

### Auth
- register
- login
- protected routes án tokens - 401
- ógilt token - 401
- rétt token - 200

### Horses
- Create / Read / Update / Delete
- Leit og síur
- Finna eftir chip_id
- 404 ef ekki til
- Heimildir: aðeins eigandi - 403 ef annar reynir

### Paddocks
- CRUD
- Sækja hross í girðingu

### Stallions
- CRUD

### Flags
- needs_vet
- pregnancy_confirmed

### Validation
- Vantar required fields
- Röng gagnagerð
- Ógilt format

## Kröfur sem verða uppfylltar

- Fullt RESTful API
- Express + TypeScript
- JWT auðkenning og heimildir
- PostgreSQL tenging
- Validation og sanitization
- Villumeðhöndlun
- Prófanir með góðri umfjöllun
- Hreint, skýrt README.md

## Aðföng, heimildir og aðstoð

- Þetta verkefni er byggt á hugmynd sem er mitt eigið hugarfóstur, unnið í framhaldi af Flutter-framenda sem gæti verið hægt að tengja við þetta API í framhaldinu.
- Verkefnið er að langmestu leyti unnið með stuðningi frá áður unnum verkefnum og glósum úr tímum.
- Leit með Google hefur mikið verið notuð til að afla upplýsinga og finna ítarefni til aðstoðar við þróun og villuleit.
- Gervigreind (aðallega ChatGPT) hefur verið notuð til villuleitar (virkar mjög vel til að finna innsláttarvillur, stafavíxl og annað sem augað er lengi að finna) og einnig til að fá útskýringar og aðstoð við að finna lausnir þegar ég hef strandað í þróunarferlinu (merkt sérstaklega).
- Allar lausnir hafa þó verið útfærðar, aðlagaðar og samþættar af mér sjálfri til að virkni þeirra sé rétt og útfærsla rétt.
- Ég hef einnig fengið ráðgjöf og yfirlestur frá félögum og samstarfsfólki með þekkingu á forritun, m.a. til að ræða lausnir og fá álit á tæknilegum atriðum og rökréttum útfærslum til samræmis við raunheimanotkun.
- Skjalið `NOTES.md` er notað til að halda utan um framvindu verkefnisins, stöðu einstakra skrefa og næstu verkefni. Það er lifandi vinnuskjal sem tekur stöðugum breytingum á meðan þróun stendur yfir.

