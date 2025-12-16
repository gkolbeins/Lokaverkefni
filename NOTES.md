# Hryssa API – Verkflæði og vinnuáætlun

Þetta skjal geymir vinnuferlið mitt, skipulag og áætlun um hvernig ég byggi Hryssa API-ið.  
Hér skrái ég stöðu verkefnisins, hvað er lokið og hvað er næst.
Þetta skjal tekur stöðugum breytingum í gegnum verkefnið

## Fase 1 – Setup
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

**✓ Fasi 1 lokið: 9.12.2025**

## Fase 2 – Auðkenning
[x] Register endpoint
[ ] Login endpoint
[ ] JWT middleware
[ ] Prófanir: register/login/token

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


## Fase 3 – Horses
[ ] GET /horses
[ ] POST /horses
[ ] Heimildir fyrir update/delete
[ ] Prófanir

## Fleira á eftir að koma hér.....

## Hugmyndir sem bíða:
- Invoices (UC11–UC13)
- Stay history
- Fertility flags workflow
