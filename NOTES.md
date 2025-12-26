# Hryssa API – Verkflæði og vinnuáætlun

Þetta skjal geymir vinnuferlið mitt, skipulag og áætlun um hvernig ég byggi Hryssa API-ið.  
Hér skrái ég stöðu verkefnisins, hvað er lokið og hvað er næst - þetta er fyrst og fremst vinnuskjal.
Þetta skjal tekur stöðugum breytingum í gegnum verkefnið.
Verkfæri:  pgAdmin 4, Postman, Visual Studio Code

## Skref 1 – Setup
[x] Búa til project
[x] Setja upp TypeScript
[x] Setja upp Express
[x] Búa til gagnagrunn (hryssa)
[x] Útfæra schema.sql
[x] Testa PostgreSQL tengingu

### Handvirk próf:
- [x] Server ræsist án villna
- [x] Root endpoint (`GET /`) svarar
- [x] Database tenging prófuð með `GET /db-test`
- [x] Routing prófað með `GET /horses`

**✓ Skref 1 lokið: 9.12.2025**

## Skref 2 – Auðkenning
[x] Register endpoint
[x] Login endpoint
[x] JWT token
[x] JWT middleware
[x] Prófanir: register/login/token

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

### Sjálfvirk próf (á eftir)
- [x] Vitest + Supertest – DELETE /horses

**✓ Skref 2 lokið: 26.12.2025**

## Fleira á eftir að koma hér.....

## Hugmyndir sem bíða:
- Invoices (UC11–UC13)
- Stay history
- Fertility flags workflow
