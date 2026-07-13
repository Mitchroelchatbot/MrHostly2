# NEEDS INPUT — vóór livegang aanleveren

Niets hiervan is verzonnen of met placeholders ingevuld; ontbrekende zaken zijn
weggelaten of verborgen tot ze echt zijn. In de code staan `[NEEDS INPUT]`-comments
op de plekken waar het thuishoort.

## Blokkerend voor livegang

1. **Stad** — Den Haag of Eindhoven? (plan en huidige site spreken elkaar tegen).
   Nodig voor SEO-titles ("website laten maken horeca [stad]"), meta descriptions,
   LocalBusiness-schema (`address`, `areaServed`) en de copy. Nu is alles regio-neutraal
   geformuleerd.
2. **Telefoonnummer + WhatsApp-nummer** — invullen in `window.MRHOSTLY_CONTACT`
   bovenin `assets/js/main.js`. Zolang leeg blijven de bel- en WhatsApp-knoppen verborgen
   (incl. de klikbare telefoonknop in de mobiele header en de WhatsApp-uitgang van de
   module-opbouwer).
3. **E-mailadres bevestigen** — nu `info@mrhostly.nl` (aanname), in `main.js` en de
   `mailto:`-formulieren.
4. **Formulier-backend** — beide formulieren gebruiken nu `mailto:` als fallback.
   Koppel een endpoint (bv. Formspree of eigen server) voor een echte verzending.
5. **Google Analytics measurement-ID** — het GA4-blok staat uitgecommentarieerd in de
   `<head>` van elke pagina; ID invullen en activeren.

## Sterk aanbevolen

6. **Teamfoto's** — voor de "uit de zaak, niet uit een kantoor"-sectie (nu een kaart
   zonder foto).
7. **VakTechLink mobiel screenshot** — voor de portfoliokaart (nu een gestileerd visual).
8. **Overige portfolioprojecten + meetbaar resultaat per project.**
9. **Vestigingsadres + KvK-nummer** — voor de footer en het LocalBusiness-schema.
10. **Namen van de vennoten** — voor het `founder`-veld in het schema en de over-ons-copy.

## Pas tonen zodra echt

11. **Reviews/testimonials** — sectie bewust niet gebouwd; toevoegen zodra er echte
    reviews zijn. Nooit placeholder-scores of aantallen tonen.
12. **Branchestatistieken** (bv. % gasten dat eerst online checkt, gemiddelde
    no-show-percentages) — alleen met bronvermelding gebruiken. De ROI-rekentool werkt
    daarom volledig op eigen invoer van de bezoeker, incl. een zelf in te stellen
    terugwin-percentage, met disclaimer.
