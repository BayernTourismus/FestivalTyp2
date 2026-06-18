# FestivalTyp PWA (Real)

> **Note:** This is the **FestivalTyp PWA**. There is a separate **BayernTyp PWA** project.

## Bavaria Type Quiz Demo

Offline-faehige PWA-Demo fuer ein Bayern-Urlaubsquiz. Die App laeuft als statische Vite/React-Anwendung und kann direkt bei Vercel deployed werden.

## Lokal starten

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Vercel Deploy

1. Repository nach GitHub pushen.
2. In Vercel ein neues Projekt aus dem Repository anlegen.
3. Framework Preset `Vite` waehlen.
4. Build Command auf `npm run build` lassen.
5. Output Directory `dist` verwenden.

Danach ist die Demo direkt erreichbar.

## PWA auf dem Tablet testen

- URL auf dem Tablet oeffnen
- Im Browser zum Home-Bildschirm hinzufuegen
- Als installierte Web-App im Vollbild starten
- Fuer iPad zusaetzlich `Guided Access` aktivieren

## Demo-Inhalt anpassen

- Deutsche und englische Fragen, Antworten, Ergebnis-Texte und Guide-Links: `src/data/quiz.ts`
- Quiz-Logik, A-D-Scoring und Randomizer bei Gleichstand: `src/lib/scoring.ts`
- Layout und Farben: `src/styles/app.css`
- Kampagnenvideo fuer den Startscreen: `public/bayern-gehoert-erlebt.mp4`

## Aktueller Umfang

- Attract-Loop mit Start-CTA
- Deutsch/English Sprachumschalter, English als Default
- 5 Fragen mit je 4 Antworten
- Auswertung fuer 4 Bayern-Typen nach A-D-Punktesystem
- Randomizer bei Gleichstand
- Calculation Screen vor dem Ergebnis
- Offline gerenderter QR-Code und Link-Panel fuer regionale Reisefuehrer
- Offline-Cache per Service Worker
- Auto-Reset nach 120 Sekunden Inaktivitaet, auf dem Ergebnis-Screen nach 120 Sekunden
- Lokale Analytics-Zaehler fuer Starts, Abbrueche, Abschluesse und Ergebnisverteilung
