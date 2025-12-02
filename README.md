ATH að þetta yfirlit er unnið af gervigreind og yfirfarið af GH að mestu 29.11.2025 og fínpússað 2.12.2025!  
Gervigreindin var beðin að bera saman lokaverkefnið sem lagt var fyrir og mína hugmynd af verkefni til að setja réttar kröfur á verkefnið mitt.
Á Figma, á slóðinni https://www.figma.com/design/nKf9PYlMcwSYV4gmYwXIrD/Hryssa---app---web-2.0?node-id=0-1&t=KTidrjFVxMZ1d2Hv-1 er tillaga að útliti á framenda sem ég er búin að vinna.

ATH mögulegt er að þetta yfirlit taki smávægilegum breytingum til aðlögunar á meðan á vinnu verkefnisins stendur

# Hryssa API - Lokaverkefni á 3. önn

Bakendakerfi fyrir app og vef sem heldur utan um hryssur, graðhesta, girðingar og stöðu þeirra (hvar hver hryssa er, hjá hvaða hesti, hvort það hafi verið sónað, fyl staðfest, þarf dýralækni). Kerfið styður auðkenningu, leit, flutninga milli girðinga, tengingu við eigendur, leit eftir örmerkjum o.fl. og uppfærslu upplýsinga um hryssur.

## Yfirlit

Hryssa API er RESTful þjónusta sem sér um:
- Skrá og sækja hryssur (upplýsingar, örmerki og jafnvel mynd)
- Skrá og sækja eigendur (nafn, sími, email)
- Skrá og sækja girðingar (paddock)
- Skrá og sækja graðhesta (stallions, örmerki)
- Skrá stöðutákn: þarf dýralækni, sónað / fyl staðfest
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

git clone \<repo-url\>  
cd hryssa-api  

npm install  
npm run dev  

Build:  
npm run build  
npm start  

Keyra gagnagrunnsmigration:  
npm run db:migrate  
npm run db:seed  

Keyra prófanir:  
npm test  

## Umhverfisbreytur (.env)

Búðu til `.env` skrá með:

DATABASE_URL=postgresql://postgres:password@localhost:5432/hryssa  
JWT_SECRET=supersecretsecret  
PORT=3000  

## Möppaskipulag (ráðlögð)

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
- scanned (bool)
- pregnancy_confirmed (bool)
- age (int)
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

### optional history
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
POST /horses/:id/flag/scanned  
POST /horses/:id/flag/pregnancy  

### Flytja hryssu
POST /horses/:id/move  
Body: paddockId, stallionId  

## Notkunartilvik (Use Cases)

### UC1 – Skoða lista af hryssum
- Sía eftir girðingu, graðhesti, eiganda, chip_id
- Raða eftir nafni eða aldri

### UC2 – Skoða upplýsingar um hryssu
- Nafn, IS-nr, chip ID
- Eigandi og hlekkir: sími og email (front-end getur gert „click to call / click to email“)
- Núverandi girðing
- Graðhestur
- Stöður: needs_vet, scanned, pregnancy_confirmed

### UC3 – Skoða girðingu
- Birta staðsetningu
- Lista allar hryssur í þessari girðingu
- Birta graðhest ef skráður

### UC4 – Skrá notanda
- Nafn, sími, email, lykilorð
- email unique
- Lykilorð hössuð

### UC5 – Innskráning
- Skilar JWT token

### UC6 – Skrá nýja hryssu
- Nafn, IS-nr, chip, eigandi, girðing, graðhestur

### UC7 – Flytja hryssu
- Eigandi verður að vera sá sami (eigandi hryssu og/eða sá sem hefur réttindi á paddock/graðhesti)
- Uppfærir current_paddock og current_stallion

### UC8 – Merkja stöðu
- needs_vet = true/false
- scanned = true/false
- pregnancy_confirmed = true/false

### UC9 – Uppfæra prófíl notanda
- Nafn, sími, email
- Email unique

### UC10 – Eyða reikningi
- Eyðir notanda og merkir hross hans óvirk eða eyðir þeim ( eftir því hvernig viðskiptalógík er skilgreind )

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
- scanned
- pregnancy_confirmed

### Validation
- Vantar required fields
- Röng gagnagerð
- Ógilt format

## Kröfur uppfylltar

- Fullt RESTful API
- Express + TypeScript
- JWT auðkenning og heimildir
- PostgreSQL tenging
- Validation og sanitization
- Villumeðhöndlun
- Prófanir með góðri umfjöllun
- Hreint, skýrt README.md
