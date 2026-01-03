# Hryssa API – Verkflæði og vinnuáætlun

Þetta skjal geymir vinnuferlið mitt, skipulag og áætlun um hvernig ég byggi Hryssa API-ið.  
Hér skrái ég stöðu verkefnisins, hvað er lokið og hvað er næst - þetta er fyrst og fremst vinnuskjal.
Þetta skjal tekur stöðugum breytingum í gegnum verkefnið.
Verkfæri:  pgAdmin 4, Postman, Visual Studio Code

## Skref 1 – Setup
- [x] Búa til project
- [x] Setja upp TypeScript
- [x] Setja upp Express
- [x] Búa til gagnagrunn (hryssa)
- [x] Útfæra schema.sql
- [x] Testa PostgreSQL tengingu

### Handvirk próf:
- [x] Server ræsist án villna
- [x] Root endpoint (`GET /`) svarar
- [x] Database tenging prófuð með `GET /db-test`
- [x] Routing prófað með `GET /horses`

**✓ Skref 1 lokið: 9.12.2025**

## Skref 2 – Auðkenning
- [x] Register endpoint
- [x] Login endpoint
- [x] JWT token
- [x] JWT middleware
- [x] Prófanir: register/login/token

### Handvirk próf:
- [x] POST /auth/register svarar og route tengist rétt
- [x] POST /auth/register skilar 400 ef vantar name/email/password
- [x] POST /auth/register tekur við gögnum þegar allt er rétt
- [x] POST /auth/register vistar nýjan notanda í gagnagrunn
- [x] POST /auth/register hafnar tvíteknum email
- [x] Lykilorð eru geymd hash-uð (bcrypt)
- [x] POST /auth/login skilar 400 ef vantar email eða password
- [x] POST /auth/login skilar 401 ef rangt email
- [x] POST /auth/login skilar 401 ef rangt password
- [x] POST /auth/login skilar 200 við rétt auðkenni
- [x] POST /auth/login skilar JWT token við rétt auðkenni
- [x] Vernduð leið án Authorization header - 401
- [x] Vernduð leið með ógilt token - 401
- [x] Vernduð leið með gilt token - 200

**✓ Skref 2 lokið: 16.12.2025**

## Skref 3 – Horses
### Endapunktar
- [x] POST /horses – skrá nýja hryssu (owner_id tekið úr JWT token)
- [x] GET /horses – sækja mínar hryssur (filterað á owner_id úr token)
- [x] GET /horses/:id – sækja eina hryssu (aðeins eigandi)
- [x] PATCH /horses/:id – uppfæra hryssu (aðeins eigandi, whitelist reitir)
- [x] DELETE /horses/:id – eyða hryssu (aðeins eigandi)

### Heimildir
- [x] Aðeins eigandi má sækja sína hryssu
- [x] Aðeins eigandi má uppfæra sína hryssu
- [x] Aðeins eigandi má eyða sinni hryssu

### Handvirk próf
- [x] POST /horses án token → 401
- [x] POST /horses án name → 400
- [x] POST /horses með gilt token → 201
- [x] owner_id er tekið úr JWT token
- [x] GET /horses skilar aðeins hryssum innskráðs notanda
- [x] GET /horses/:id → 403 ef notandi er ekki eigandi
- [x] PATCH /horses/:id → 403 ef notandi er ekki eigandi
- [x] PATCH /horses/:id → 200 ef notandi er eigandi
- [x] PATCH hafnar óleyfilegum reitum (t.d. owner_id)

### Sjálfvirk próf
- [x] Vitest + Supertest
- [x] DELETE /horses
- [x] GET /horses
- [x] PATCH /horses
- [x] POST /horses

**✓ Skref 3 lokið: 26.12.2025**

## Skref 4 – Stallions & Paddocks (grunnur)
### Stallions
- [x] Stallions schema (SQL)
- [x] POST /stallions
- [x] GET /stallions
- [x] GET /stallions/:id
- [x] PATCH /stallions/:id
- [x] DELETE /stallions/:id
- [x] Handvirk próf (Postman)

### Handvirk próf – Stallions (Postman)
- [x] POST /stallions með gilt token → 201 Created
- [x] POST /stallions án name → 400 Bad Request
- [x] POST /stallions án token → 401 Unauthorized
- [x] GET /stallions með gilt token → 200 OK
- [x] GET /stallions skilar aðeins graðhestum innskráðs notanda
- [x] GET /stallions/:id með gilt id → 200 OK
- [x] GET /stallions/:id með id sem er ekki til → 404 Not Found
- [x] GET /stallions/:id sem tilheyrir öðrum notanda → 403 Forbidden
- [x] PATCH /stallions/:id með gilt body → 200 OK
- [x] PATCH /stallions/:id með tómt body → 400 Bad Request
- [x] PATCH /stallions/:id sem tilheyrir öðrum notanda → 403 Forbidden
- [x] DELETE /stallions/:id með gilt token → 200 OK
- [x] DELETE /stallions/:id sem er ekki til → 404 Not Found
- [x] DELETE /stallions/:id sem tilheyrir öðrum notanda → 403 Forbidden

### Paddocks
- [x] Paddocks schema (SQL)
- [x] POST /paddocks (tengt stallion)
- [x] GET /paddocks
- [x] unique paddock name per owner
- [x] GET /paddocks/:id
- [ ] GET /paddocks/:id/horses
- [ ] PATCH /paddocks/:id
- [ ] DELETE /paddocks/:id

### Handvirk próf – Paddocks (Postman)
- [x] POST /paddocks með gilt token + valid body → 201 Created
- [x] POST /paddocks án token → 401 Unauthorized
- [x] POST /paddocks án name → 400 Bad Request
- [x] POST /paddocks án stallion_id → 400 Bad Request
- [x] POST /paddocks með stallion_id sem er ekki til → 404 Not Found
- [x] POST /paddocks með stallion_id sem tilheyrir öðrum notanda → 403 Forbidden
- [x] POST /paddocks með sama name hjá sama notanda → 400 Bad Request
- [x] owner_id í paddock er tekið úr JWT token
- [x] GET /paddocks með gilt token → 200 OK
- [x] GET /paddocks án token → 401 Unauthorized
- [x] GET /paddocks skilar aðeins paddocks innskráðs notanda
- [x] GET /paddocks/:id með gilt token → 200 OK
- [x] GET /paddocks/:id án token → 401 Unauthorized
- [x] GET /paddocks/:id sem er ekki til → 404 Not Found
- [x] GET /paddocks/:id sem tilheyrir öðrum notanda → 403 Forbidden

### Sjálfvirk próf
- [x] DELETE /stallions
- [x] GET /stallions
- [x] PATCH /stallions
- [x] POST /stallions
- [x] POST /auth/register
- [x] POST /auth/login

### Athugasemd – Test umhverfi / test db
- [x] Aðskilnaður test og dev gagnagrunns, bjó til hryssa_test db (Leyst með aðstoð og útskýringum AI)
- [x] `.env.test` notað fyrir Vitest
- [x] Test eiga ekki að keyra lengur gegn raunverulegum gögnum
- [x] Leysti vandamál þar sem test pössuðu aðeins í fyrstu keyrslu
- [x] Greint að test skildu eftir gögn sem höfðu áhrif á önnur test
- [x] Innleiddi global DB reset fyrir test keyrslu (í setup.ts undir test möppu)
- [x] Fjarlægði `TRUNCATE` úr einstökum test-skrám
- [x] Hvert test býr nú til sín eigin gögn
- [x] Test eru nú óháð keyrsluröð

✓ Öll sjálfvirk test keyra nú stöðugt og eru endurkeyranleg (3.1.2026)

## Fleira á eftir að koma hér.....

## Hugmyndir sem bíða:
- Invoices (UC11–UC13)
- Stay history
- Fertility flags workflow
