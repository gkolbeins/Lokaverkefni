ATH að þetta yfirlit er unnið af gervigreind og yfirfarið af GH að mestu 29.11.2025!
Gervigreindin var beðin að bera saman lokaverkefnið sem lagt er fyrir og mína hugmynd af verkefni til að setja upp kröfur á verkefnið mitt.


# Hryssa API

Bakendakerfi fyrir app og vef sem heldur utan um hryssur, graðhesta, girðingar og stöðu þeirra (Hvar hver hryssa er, hjá hvaða hesti, hvort það hafi verið sónað, fyl staðfest, þarf dýralækni). Kerfið styður auðkenningu, leit, flutninga milli girðinga, tengingu við eigendur, leit efitr örmerkjum ofl. og uppfærsu upplýsinga um hryssur

## Yfirlit

Hryssa API er RESTful þjónusta sem sér um:
- Skrá og sækja hryssur (upplýsingar, örmerki og jafnvel mynd)
- Skrá og sækja eigendur (nafn, sími, email)
- Skrá og sækja girðingar (paddock)
- Skrá og sækja graðhesta (stallions, örkmerki)
- Skrá stöðutákn: þarf dýralækni, sónað/fyl staðfest
- Lesa örmerki / Bluetooth ID (chip_id)
- Flytja hryssu í aðra girðingu / undir annan graðhest
- Leita að hryssu eftir örmerki, nafni, eiganda, staðsetningu eða valkvæðum reitum (hafa 2 auka valkvæða reiti td fyrir gælunafn eða frostmerki)
- Auðkenningu notenda með JWT
- Heimildir: aðeins eigandi getur breytt sínum graðhestum, eigandi graðhests/giriðingar og eigandi hryssu geta breytt upplýsingum um hryssu

## Tækni

- Express.js með TypeScript
- PostgreSQL
- JWT auðkenning
- Vitest + Supertest prófanir
- RESTful API hönnun
- Villumeðhöndlun og inntaksstaðfesting

## Uppsetning

Afritaðu verkefnið og settu upp:

git clone <repo-url>
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

Búðu til .env skrá með:

DATABASE_URL=postgresql://postgres:password@localhost:5432/hryssa
JWT_SECRET=supersecretsecret
PORT=3000

## Möppaskipulag (ráðlögð)

src/
  routes/
  controllers/
  services/
  middleware/
  repository/
  utils/
  config/
  index.ts

tests/
  auth/
  horses/
  stallions/
  paddock/
  flags/
  utils/

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
- current_pasture_id (FK paddock)
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
- location (Farm name)

### stallions (graðhestar)
- id
- name
- is_number (IS-nr)
- chip_id (örmerki)
- notes

### optional history
- horse_id
- pasture_id
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
Body: pastureId, stallionId

## Notkunartilvik (Use Cases)

### UC1 – Skoða lista af hryssum
- Sía eftir girðingu, graðhesti, eiganda, chip_id
- Raða eftir nafni eða aldri

### UC2 – Skoða upplýsingar um hryssu
- Nafn, IS-nr, chip ID
- Eigandi og hlekkir: sími og email
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
- Eigandi verður að vera sá sami
- Uppfærir current_pasture og current_stallion

### UC8 – Merkja stöðu
- needs_vet = true/false
- scanned = true/false
- pregnancy_confirmed = true/false

### UC9 – Uppfæra prófíl notanda
- Nafn, sími, email
- Email unique

### UC10 – Eyða reikningi
- Eyðir notanda og merkir hross hans óvirk eða eyðir þeim

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

