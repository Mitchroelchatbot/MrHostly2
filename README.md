# mrhostly.nl — website

Statische website voor **Mr. Hostly** — websites en AI-chatbots voor horecaondernemers.
*Slimmer. Sterker. Digitaler.*

## Pagina's

| Pagina | Doel |
| --- | --- |
| `index.html` | Homepage: hero met chatbot-demo, diensten, zelfbeheer-admin, ROI-rekentool, over ons, portfolio, FAQ, contact |
| `websites.html` | Dienstpagina websites: all-in aanbod (€795 + €39 p/mnd), modules, bundels |
| `chatbots.html` | Dienstpagina AI-chatbot (vanaf €399 + €49 p/mnd) |
| `samenstellen.html` | Module-opbouwer: interactieve configurator met live prijs, bundeldetectie en aanvraag-payload |

## Structuur

```
assets/
  brand/    logo-SVG's + og-image (uit het merkpakket in Drive)
  css/      style.css — volledig design system (navy #0F2044, amber #E8953A, #F8F7F4)
  fonts/    Plus Jakarta Sans (variable, woff2)
  js/       main.js (nav, chat-demo, ROI-calculator) + opbouwer.js (configurator)
favicon/    favicon-set uit het merkpakket
```

Geen build-stap: uploaden naar hosting is genoeg. Lokaal bekijken:
`python3 -m http.server` in de projectmap.

## Prijslogica module-opbouwer

Alle prijzen excl. btw, gedefinieerd in `assets/js/opbouwer.js` (`PRICE` en `BUNDLES`):

- Basis: €795 eenmalig + €39 p/mnd (verplicht) · extra pagina €125 (max 7)
- Modules: fotogalerij €99 · Drive-galerij €19 p/mnd · FAQ €99 · meertalig €199 + €9 p/mnd · boekingsintegratie €99 · bonnen/arrangementen €199 · GEO €249 + €19 p/mnd · maandrapportage €15 p/mnd · onderhoud+mail €49 p/mnd i.p.v. €39
- AI-chatbot: €399 + €49 p/mnd · WhatsApp +€250 / +€25 p/mnd · extra taal +€99 / +€9 p/mnd
- Bundels (exacte match op samenstelling activeert bundelprijs + melding):
  - **Café** €894 + €39 p/mnd — one-pager + fotogalerij
  - **Restaurant** €1.492 + €73 p/mnd — 3 pagina's + fotogalerij + FAQ + GEO + maandrapportage
  - **Hostly Compleet** €1.795 + €129 p/mnd — Restaurant-bundel + chatbot + WhatsApp-kanaal (los €2.141 + €147 → ±€350 voordeel)

De uitgang is een aanvraag (formulier of WhatsApp) met de samenstelling als voor-ingevulde
samenvatting — bewust géén checkout.

## Contactgegevens invullen

Telefoon-, WhatsApp- en e-mailgegevens staan op één plek: `window.MRHOSTLY_CONTACT`
bovenin `assets/js/main.js`. Lege waarden verbergen de bijbehorende knoppen automatisch.

## Nog aan te leveren

Zie `NEEDS-INPUT.md` voor alles wat nog ingevuld moet worden voordat de site live kan.
