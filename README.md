ATH að þetta yfirlit er unnið af gervigreind og yfirfarið af GH að mestu 29.11.2025 og fínpússað 2.12.2025!  
Gervigreindin var beðin að bera saman fyrirmynd af lokaverkefni sem lagt var fyrir og mína hugmynd að verkefni og setja réttar kröfur á verkefnið mitt.

Á Figma, á slóðinni https://www.figma.com/design/nKf9PYlMcwSYV4gmYwXIrD/Hryssa---app---web-2.0?node-id=0-1&t=KTidrjFVxMZ1d2Hv-1 er tillaga að útliti á framenda sem ég er búin að vinna ásamt styttri verklýsingu.

Ég á Flutter app sem hægt er að nota sem framenda https://github.com/gkolbeins/hryssa_app

ATH mögulegt er að þetta yfirlit taki breytingum til aðlögunar á meðan á vinnu verkefnisins stendur:
- breyting gerð 9.12.2025, 13.12.2025, 27.12.2025 og 7.1.2026

# Hryssa API - Lokaverkefni á 3. önn

Bakendakerfi fyrir app og vef sem heldur utan um hryssur, graðhesta, girðingar og stöðu þeirra (hvar hver hryssa er, hjá hvaða hesti, hvort fyl sé staðfest, þarf dýralækni). Kerfið styður auðkenningu, leit, flutninga milli girðinga, tengingu við eigendur, leit eftir örmerkjum o.fl. og uppfærslu upplýsinga um hryssur.
Raunhugmynd kerfisins er að vera bakendi fyrir app sem er eins konar "minnisblokk" fyrir eiganda stóðhests þar sem hann heldur utan um hryssur sem koma til hans og getur skráð upplýsingar. Einhverjum kröfum hefur verið bætt við eða breytt til að uppfylla skilyrði lokaverkefnis.

## Yfirlit

Hryssa API er RESTful þjónusta sem sér um:
- Skrá og sækja hryssur (upplýsingar, örmerki og jafnvel mynd)
- Skrá og sækja eigendur (nafn, sími, email)
- Skrá og sækja girðingar (paddock)
- Skrá og sækja graðhesta (stallions, örmerki)
- Skrá stöðutákn: þarf dýralækni, fyl staðfest
- Lesa örmerki / Bluetooth ID (chip_id)
- Flytja hryssu í aðra girðingu / undir annan graðhest
- Leita að hryssu eftir örmerki, nafni, eiganda, staðsetningu eða valkvæðum reitum (hafa t.d. 2 auka valkvæða reiti fyrir gælunafn eða frostmerki)
- Auðkenningu notenda með JWT
- Heimildir:
  - eigandi graðhests/girðingar og eigandi hryssu geta báðir breytt upplýsingum um hryssur
  - eigandi hryssu getur aðeins breytt upplýsingum um hryssuna
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

Build:  
npm run build  
npm start  

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

## Möppuskipulag (ráðlagt af gervigreind, tekur mannlegum breytingum)

src/  
- routes/  
- controllers/  
- services/  
- middleware/  
- repository/  
- utils/  
- config/  
- index.ts  

tests/  
- auth/  
- horses/  
- stallions/  
- paddock/  
- flags/  
- utils/    
- usecases/

README.md  

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
- created_at
- other_info_1 
- other_info_2

### paddock (girðingar)
- id
- name
- location (farm name / staðsetning)

### stallions (graðhestar)
- id
- name
- is_number (IS-nr)
- chip_id (örmerki)
- notes

### optional history (ekki útfært í lokaverkefni)
- horse_id
- paddock_id
- stallion_id
- timestamp

## API Endapunktar

### Auth
POST /auth/register  
POST /auth/login  
GET /me  
PATCH /me  
DELETE /me  

### Horses (hryssur)
GET /horses  
GET /horses/:id  
GET /horses/by-chip/:chip_id  
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
POST /horses/:id/flag/vet  
POST /horses/:id/flag/pregnancy  

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

### UC3 – Skoða girðingu
- Birta staðsetningu
- Lista allar hryssur í þessari girðingu
- Birta graðhest ef skráður

### UC4 – Skrá notanda - ✅
- Nafn, sími, email, lykilorð
- email unique
- Lykilorð hössuð

### UC5 – Innskráning - ✅
- Skilar JWT token

### UC6 – Skrá nýja hryssu - ✔️ (vantar enn arrival_date)
- Nafn, IS-nr, chip, eigandi, girðing, graðhestur, komudagur ( arrival_date )

### UC7 – Flytja hryssu
- Eigandi verður að vera sá sami (eigandi hryssu og/eða sá sem hefur réttindi á paddock/graðhesti)
- Uppfærir current_paddock, current_stallion og arrival_date
- Hætta við dvöl: Skráð dvöl (stay) er merkt sem lokið eða cancelled
- departure_date er skráð þegar dvöl er hætt
- Kerfið tryggir að dvöl sem er hætt við sé ekki lengur virk

### UC8 – Merkja stöðu
- needs_vet = true/false
- pregnancy_confirmed = true/false
- (við true er síðar hægt að skrá dagsetningu fylstaðfestingar)

### UC9 – Uppfæra prófíl notanda
- Nafn, sími, email
- email unique

### UC10 – Eyða notandareikningi
- Eyðir notanda og merkir hross hans óvirk eða eyðir þeim ( eftir því hvernig viðskiptalógík er skilgreind )

### Viðbótarhugmyndir: saga og greiðslur - UC11-UC13 eru ekki hluti af lokaverkefni - ákveðið í samráði við kennara

### UC11 - Búa til rukkun (invoice)
- Graðhestseigandi býr til rukkun fyrir dvöl eða þjónustu
- Velur hryssu og tengda dvöl (stay)
- Slær inn: upphæð, lýsingu, gjalddaga
- Kerfið býr til rukkun með stöðunni pending
- Hryssueigandi sér ógreidda rukkun í appinu eða á vefnum - eða í tölvupósti? greiðslulink?

### UC12 - Greiða rukkun
- Hryssueigandi sér ógreidda rukkun (pending)
- Ýtir á “Greiða”
- Kerfið uppfærir rukkun: status → paid
- Skráir paid_at dagsetningu
- Rukkanir færast í “greiddar” hjá báðum aðilum

### UC13 - Skoða greiðslusögu
- Notandi skoðar greiddar og ógreiddar rukkanir
- Hægt að sía eftir stöðu: pending, paid, cancelled, overdue
- Hægt að sjá sögu fyrir: Hryssur sem notandi á og Rukkanir sem notandi hefur búið til (ef graðhestseigandi)
- Niðurstöður birtar með upphæð, lýsingu, dagsetningum og stöðu


## Prófanir

### Auth
- register
- login
- protected routes án tokens → 401
- ógilt token → 401
- rétt token → 200

### Horses
- Create / Read / Update / Delete
- Leit og síur
- Finna eftir chip_id
- 404 ef ekki til
- Heimildir: aðeins eigandi → 403 ef annar reynir

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

- Þetta verkefni er byggt á hugmynd sem er mitt eigið hugarfóstur. Ég hef þegar þróað nánast tilbúið Flutter-framenda sem fyrirhugað er að tengja við þetta API í framhaldinu.
- Verkefnið er að langmestu leyti unnið með stuðningi frá áður unnum verkefnum og glósum úr tímum.
- Leit með Google hefur mikið verið notuð til að afla upplýsinga og finna ítarefni til aðstoðar við þróun og villuleit.
- Gervigreind (aðallega ChatGPT) hefur verið notuð til villuleitar (virkar mjög vel til að finna innsláttarvillur, stafavíxl og annað sem augað er lengi að finna) og einnig til að fá útskýringar og aðstoð við að finna lausnir þegar ég hef strandað í þróunarferlinu (merkt sérstaklega).
- Allar lausnir hafa þó verið útfærðar, aðlagaðar og samþættar af mér sjálfri til að virkni þeirra sé rétt og útfærsla rétt.
- Ég hef einnig fengið ráðgjöf og yfirlestur frá félögum og samstarfsfólki með þekkingu á forritun, m.a. til að ræða lausnir og fá álit á tæknilegum atriðum og útfærslum til samræmis við raunheimanotkun.
- Skjalið `NOTES.md` er notað til að halda utan um framvindu verkefnisins, stöðu einstakra skrefa og næstu verkefni. Það er lifandi vinnuskjal sem tekur stöðugum breytingum á meðan þróun stendur yfir.

