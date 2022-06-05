# Dashboard ROMDIG

URL: [`https://dashboard.romdig.net`](https://dashboard.romdig.net)

Nota: in realizarea acestui site nu a fost folosita nicio plata

Ierarhia moderatorilor poate fi gasita in [README-ul](https://github.com/iialexandru/ROMDIG---BE/blob/master/README.md) server-ului

Deployment: Vercel

Creatori: 1 (Ipatov Ioan Alexandru)

Responsiveness: 100%

&nbsp;
&nbsp;

`Sectiunea de autentificare:` se face cu ajutor unui email, id si parola; id-ul este unul random, format din caractere alfanumerice, de 20 de caractere, care este generat cand este creat moderatorul in sectiunea `Creare moderator`

&nbsp;
&nbsp;

`Statistici:` cuprinde cateva statistici (impreuna cu niste pie chart-uri) despre postari, utilizatori (exp: cati utilizatori sunt din judete, comune, sate si orase diferite); toti moderatorii au acces la aceste date


&nbsp;
&nbsp;

`Gestionare moderatori:` aici pot fi schimbate unele date ale moderatorilor (nume, prenume, email etc.), dar pot fi sterse si conturile lor si se poate vedea unde au fost distribuiti acestia; numai moderatorii judeteni, comunali si cel general au acces la aceasta sectiune, unii dintre ei cu restrictii (specificate in [README-ul](https://github.com/iialexandru/ROMDIG---BE/tree/master#readme) server-ului); totodata, pentru moderatorul general, cei judeteni si cei comunali, exista un input (PlacesAPI cu Google Cloud Platform, specificat si in [README-ul](https://github.com/iialexandru/ROMDIG---FE#readme) in care poti cauta orice judet site-ului pentru utilizatori, la sectiunea de inregistrare), comuna, sat, oras; moderatorii orasesti si satesti nu acces la aceasta sectiune

#### Nota importanta pentru toate input-urile cu PlacesAPI: pot fi folosite doar de catre moderatorii judeteni, comunali si cel general si moderatorii judeteni pot cauta doar comunele, orasele si satele din judetul lor, dar nu ii pot vedea pe ceilalti moderatori judeteni din acelasi judet, la fel si pentru cei comunali cu comunele, pot vedea doar pe cei din satele care apartin acelei comune, dar nu ii pot vedea pe ceilalti moderatori comunali din aceeasi comuna (sectiunile `Creare moderatori` si `Gestionare moderatori`); cand vine vorba de postari, comentarii si cereri de inregistrare, moderatorilor judeteni le vor aparea si cele care sunt la nivel judetean, iar celor comunali si cele care sunt la nivel comunal; moderatorii orasesti si satesti nu au acces la acest input, ci li se arata direct postarile pentru localitatea lor, neavand acces la sectiunile legate de moderatori; pentru cautarea unui judet (pt. mod. general) trebuie scris numele judetului (Iasi), dupa care County (Iasi County) sau se poate apasa pe el daca apare in casuta; pentru comuna trebuie dat check la casuta Comuna

&nbsp;
&nbsp;

`Creare moderatori:` aici pot fi creati moderatorii; cel general poate crea orice tip de moderator, cel judetean doar comunal, orasesc si satesc (pentru localitati din judetul sau), iar cel comunal doar satesc (pentru sate din comuna sa); moderatorii satesti si orasesti nu acces la aceasta sectiune; totodata, si aici apre un input cu PlaceAPI pentru moderatori, precum a fost mentionat mai sus

##### Nota: pentru crearea unui moderator, se va crea in acelasi timp si un cont de utilizator normal, tot in aceeasi sectiune, pentru o securitate sporita, dar si pentru o functionare mai buna a sistemului; totodata, la sectiunea localizare pentru un utilizator normal, pentru functionarea completa trebuie introdusa o localitate (nu judet/comuna), cuprinsa de aria sa de gestionare; cu acel cont vor putea comenta pe postarile utilizatorilor (nu vor mai fi restrictionati la o singura zona daca moderatorul este comunal sau judetean, explicat mai bine mai jos, la sectiunea `Postari`), afisandu-se o insigna in dreapta lor, pentru ca lumea sa stie ca comentariul este a unui moderator

&nbsp;
&nbsp;

`Setare status:` aici pot fi setate statusurile unei postarilor; postarile afisate in functie de zona (apare din nou un input PlacesAPI pt moderatori judeteni, comunali si cel general) si pot fi filtrate in functie de 7 categorii si dupa 4 statusuri (pot fi puse mai multe deodata)

##### Nota: in mod normal, un utilizator normal nu poate accesa o postare dintr-o alta localitate, insa, utilizatorul "normal" creat in sectiunea `Creare moderatori`, are acces, numai din aceasta sectiune si `Posari`, la toate postarile ce apartin ariei sale (mod. judetean -> toate postarile din judet, indiferent de nivel, mod. comunal -> toate postarile din comuna sau sat, mod. general -> toate; mod. satesc si orasesc au acces numai la cele din satul, respectiv orasul sau)

&nbsp;
&nbsp;

`Postari:` aici pot fi vazute toate postarile, in modul in care a fost mentionat mai sus (din nou apare un input cu PlacesAPI)

&nbsp;
&nbsp;

`Postari raportate:` aici pot fi vazute toate postarile raportate de catre utilizatori, de la cele mai multe semnalari la cele mai putine, si pot fi vazute motivele pentru care au fost raportate; daca se decide ca semnalarile sunt adevarate, aceasta poate fi stearsa (din nou apare un input cu PlacesAPI)

&nbsp;
&nbsp;

`Comentarii raportate:` identic ca la postari, doar ca este pentru comentarii; cand un comentariu este sters sunt si reply-urile pe care le-a primit

&nbsp;
&nbsp;

`Cereri de inregistrare:` aici pot fi vazute cererile de inregistrare a utilizatorilor si se poate verifica identitatea persoanei si domicilierea sa, impreuna cu alte cateva date; ele pot fi acceptate sau refuzate; din nou, cum a fost mentionat mai sus, apare un input cu PlacesAPI, conform localizarii

&nbsp;
&nbsp;

`Gestionare utilizatori:` aceasta sectiune poate fi accesata doar de moderatorul general si de moderatorii judeteni (doar utilizatorii din judetul lor); aici, in urma gasirii unor nereguli sau la cerinta utilizatorului (exp: s-a mutat), contul unui utilizator normal poate fi sters (din nou apare input cu PlacesAPI)

&nbsp;
&nbsp;

### Admini

1. General: fiicode.testadmi@gmail.com; 65FzF8nj1ZDW5ziYo9ZT (id); cerepere1234 (pass)
2. Judetean: potcoava.petru@romdig.com; 3f4bMIHB66QP135B9ymk (id); fiicode2022 (pass)
3. Comunal: lora.florin@romdig.com; tPNmFo0cHB6u1PE8Ffc8 (id); fiicode2022 (pass)
4. Satesc: montan.aurel@romdig.com; 87Xuic04ov2pKkG94S4X (id); fiicode2022 (pass)
5. Orasesc: corneliu.marian@romdig.com; H3wUHd0s7xQn2o120nf7 (id); fiicode2022 (pass)

## Tehnologii folosite
1. Typescript
2. ReactJS
3. NextJS
4. SASS
5. Gulp
6. MUI