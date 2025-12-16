# Hryssa API – Verkflæði og vinnuáætlun

Þetta skjal geymir vinnuferlið mitt, skipulag og áætlun um hvernig ég byggi Hryssa API-ið.  
Hér skrái ég stöðu verkefnisins, hvað er lokið og hvað er næst - þetta er fyrst og fremst vinnuskjal.
Þetta skjal tekur stöðugum breytingum í gegnum verkefnið.

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
[x] POST /horses – skrá nýja hryssu
[x] GET /horses – sækja mínar hryssur (filterað á owner_id úr token)
[ ] PATCH /horses/:id – uppfæra hryssu
[ ] DELETE /horses/:id – eyða hryssu

### Heimildir
[ ] Aðeins eigandi má uppfæra
[ ] Aðeins eigandi má eyða

### Handvirk próf
- [x] POST /horses án token - 401
- [x] POST /horses án name - 400
- [x] POST /horses með gilt token - 201
- [x] owner_id tekið úr token

### Sjálfvirk próf (á eftir)
[ ] Vitest + Supertest fyrir horses

## Fleira á eftir að koma hér.....

## Hugmyndir sem bíða:
- Invoices (UC11–UC13)
- Stay history
- Fertility flags workflow
