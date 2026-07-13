/* Mr. Hostly — module-opbouwer
   Prijslogica, bundeldetectie en aanvraag-payload.
   Alle bedragen excl. btw. */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Prijslijst — bron: prijsstelling Mr. Hostly (2026)
     ------------------------------------------------------------------ */
  const PRICE = {
    baseOnce: 795,          /* website one-pager, all-in */
    baseMonthly: 39,        /* verplicht abonnement */
    extraPage: 125,         /* per extra pagina (max 7 totaal) */
    modules: {
      fotogalerij:    { once: 99,  monthly: 0,  label: 'Fotogalerij' },
      galerijDrive:   { once: 0,   monthly: 19, label: 'Galerij-koppeling met Google Drive' },
      faq:            { once: 99,  monthly: 0,  label: 'FAQ-sectie' },
      meertalig:      { once: 199, monthly: 9,  label: 'Meertalig' },
      boeking:        { once: 99,  monthly: 0,  label: 'Boekingsintegratie (Zenchef / Playtomic / Meet & Play)' },
      bonnen:         { once: 199, monthly: 0,  label: 'Bonnen & arrangementen' },
      geo:            { once: 249, monthly: 19, label: 'AI-vindbaarheid (GEO)' },
      rapportage:     { once: 0,   monthly: 15, label: 'Maandrapportage' },
      onderhoudPlus:  { once: 0,   monthly: 10, label: 'Onderhoud + zakelijke mail (€49 i.p.v. €39 p/mnd)' }
      /* onderhoudPlus: het abonnement wordt €49 i.p.v. €39 → +€10 p/mnd */
    },
    chatbot: { once: 399, monthly: 49, label: 'AI-chatbot (incl. 500 gesprekken p/mnd)' },
    chatbotWhatsapp: { once: 250, monthly: 25, label: 'WhatsApp-kanaal voor chatbot' },
    chatbotTaal: { once: 99, monthly: 9, label: 'Extra taal voor chatbot' }
  };

  /* Bundels: samenstelling + bundelprijs.
     Café      = one-pager + fotogalerij                          → €894  + €39/mnd
     Restaurant = 3 pagina's + fotogalerij + FAQ + GEO + rapportage → €1.492 + €73/mnd
     Restaurant + AI (Hostly Compleet) = Restaurant-bundel + AI-chatbot
       + WhatsApp-kanaal                                          → €1.795 + €129/mnd */
  const BUNDLES = [
    {
      id: 'cafe',
      name: 'Café-bundel',
      priceOnce: 894,
      priceMonthly: 39,
      state: { pages: 1, modules: ['fotogalerij'], chatbot: false, whatsapp: false, extraTaal: false }
    },
    {
      id: 'restaurant',
      name: 'Restaurant-bundel',
      priceOnce: 1492,
      priceMonthly: 73,
      state: { pages: 3, modules: ['fotogalerij', 'faq', 'geo', 'rapportage'], chatbot: false, whatsapp: false, extraTaal: false }
    },
    {
      id: 'compleet',
      name: 'Restaurant + AI (Hostly Compleet)',
      priceOnce: 1795,
      priceMonthly: 129,
      state: { pages: 3, modules: ['fotogalerij', 'faq', 'geo', 'rapportage'], chatbot: true, whatsapp: true, extraTaal: false }
    }
  ];

  const root = document.querySelector('[data-builder]');
  if (!root) return;
  document.body.classList.add('has-builder');

  const el = {
    pages: root.querySelector('#b-pages'),
    pagesOut: root.querySelector('#b-pages-out'),
    modules: root.querySelectorAll('[data-module]'),
    chatbot: root.querySelector('#b-chatbot'),
    whatsapp: root.querySelector('#b-whatsapp'),
    extraTaal: root.querySelector('#b-taal'),
    subOpts: root.querySelectorAll('[data-chatbot-sub]'),
    lines: root.querySelector('[data-sum-lines]'),
    once: root.querySelectorAll('[data-sum-once]'),
    monthly: root.querySelectorAll('[data-sum-monthly]'),
    bundleHint: root.querySelector('[data-bundle-hint]'),
    bundleText: root.querySelector('[data-bundle-text]'),
    bundleApply: root.querySelector('[data-bundle-apply]'),
    bar: document.querySelector('[data-builder-bar]'),
    form: document.querySelector('[data-request-form]'),
    payload: document.querySelector('#aanvraag-samenstelling'),
    whatsappOut: document.querySelector('[data-request-whatsapp]')
  };

  const eur = function (n) { return '€ ' + Math.round(n).toLocaleString('nl-NL'); };

  function readState() {
    const modules = [];
    el.modules.forEach(function (box) { if (box.checked) modules.push(box.value); });
    return {
      pages: +el.pages.value,
      modules: modules,
      chatbot: el.chatbot.checked,
      whatsapp: el.chatbot.checked && el.whatsapp.checked,
      extraTaal: el.chatbot.checked && el.extraTaal.checked
    };
  }

  /* Som van losse prijzen voor een gegeven samenstelling */
  function priceOf(state) {
    let once = PRICE.baseOnce + (state.pages - 1) * PRICE.extraPage;
    let monthly = PRICE.baseMonthly;
    state.modules.forEach(function (id) {
      once += PRICE.modules[id].once;
      monthly += PRICE.modules[id].monthly;
    });
    if (state.chatbot) {
      once += PRICE.chatbot.once;
      monthly += PRICE.chatbot.monthly;
      if (state.whatsapp) { once += PRICE.chatbotWhatsapp.once; monthly += PRICE.chatbotWhatsapp.monthly; }
      if (state.extraTaal) { once += PRICE.chatbotTaal.once; monthly += PRICE.chatbotTaal.monthly; }
    }
    return { once: once, monthly: monthly };
  }

  function sameState(a, b) {
    return a.pages === b.pages &&
      a.chatbot === b.chatbot &&
      a.whatsapp === b.whatsapp &&
      a.extraTaal === b.extraTaal &&
      a.modules.length === b.modules.length &&
      a.modules.slice().sort().join() === b.modules.slice().sort().join();
  }

  function matchBundle(state) {
    for (let i = 0; i < BUNDLES.length; i++) {
      if (sameState(state, BUNDLES[i].state)) return BUNDLES[i];
    }
    return null;
  }

  function applyBundle(bundle) {
    el.pages.value = bundle.state.pages;
    el.modules.forEach(function (box) {
      box.checked = bundle.state.modules.indexOf(box.value) !== -1;
    });
    el.chatbot.checked = bundle.state.chatbot;
    el.whatsapp.checked = bundle.state.whatsapp;
    el.extraTaal.checked = bundle.state.extraTaal;
    update();
  }

  /* Regels voor het samenvattingspaneel + tekstpayload */
  function buildLines(state, totals, bundle) {
    const lines = [];
    lines.push({
      label: 'Website (' + state.pages + ' pagina' + (state.pages > 1 ? '’s' : '') + ', all-in)',
      value: eur(PRICE.baseOnce + (state.pages - 1) * PRICE.extraPage)
    });
    lines.push({ label: 'Hosting, updates & zelfbeheer-admin', value: eur(state.modules.indexOf('onderhoudPlus') !== -1 ? 49 : 39) + ' p/mnd' });
    state.modules.forEach(function (id) {
      if (id === 'onderhoudPlus') return; /* zit al in de maandregel hierboven */
      const m = PRICE.modules[id];
      const parts = [];
      if (m.once) parts.push(eur(m.once));
      if (m.monthly) parts.push(eur(m.monthly) + ' p/mnd');
      lines.push({ label: m.label, value: parts.join(' + ') });
    });
    if (state.chatbot) {
      lines.push({ label: PRICE.chatbot.label, value: eur(PRICE.chatbot.once) + ' + ' + eur(PRICE.chatbot.monthly) + ' p/mnd' });
      if (state.whatsapp) lines.push({ label: PRICE.chatbotWhatsapp.label, value: eur(PRICE.chatbotWhatsapp.once) + ' + ' + eur(PRICE.chatbotWhatsapp.monthly) + ' p/mnd' });
      if (state.extraTaal) lines.push({ label: PRICE.chatbotTaal.label, value: eur(PRICE.chatbotTaal.once) + ' + ' + eur(PRICE.chatbotTaal.monthly) + ' p/mnd' });
    }
    if (bundle) {
      const saveOnce = totals.once - bundle.priceOnce;
      const saveMonthly = totals.monthly - bundle.priceMonthly;
      if (saveOnce > 0 || saveMonthly > 0) {
        const parts = [];
        if (saveOnce > 0) parts.push('−' + eur(saveOnce));
        if (saveMonthly > 0) parts.push('−' + eur(saveMonthly) + ' p/mnd');
        lines.push({ label: 'Bundelvoordeel (' + bundle.name + ')', value: parts.join(' / ') });
      }
    }
    return lines;
  }

  function update() {
    const state = readState();

    /* sub-opties alleen actief als de chatbot aan staat */
    el.subOpts.forEach(function (opt) {
      opt.classList.toggle('opt--disabled', !el.chatbot.checked);
    });

    /* visuele checked-status van optiekaarten */
    root.querySelectorAll('.opt').forEach(function (opt) {
      const input = opt.querySelector('input');
      if (input) opt.classList.toggle('is-checked', input.checked && !opt.classList.contains('opt--disabled'));
    });

    el.pagesOut.innerHTML = state.pages + ' pagina' + (state.pages > 1 ? '’s' : '') +
      '<small>' + eur(PRICE.baseOnce + (state.pages - 1) * PRICE.extraPage) + ' eenmalig</small>';

    const sumLoose = priceOf(state);
    const bundle = matchBundle(state);
    const totals = bundle
      ? { once: bundle.priceOnce, monthly: bundle.priceMonthly }
      : sumLoose;

    /* samenvatting */
    const lines = buildLines(state, sumLoose, bundle);
    el.lines.innerHTML = lines.map(function (l) {
      return '<li><span>' + l.label + '</span><span>' + l.value + '</span></li>';
    }).join('');

    el.once.forEach(function (n) { n.textContent = eur(totals.once); });
    el.monthly.forEach(function (n) { n.textContent = eur(totals.monthly) + ' p/mnd'; });

    /* bundeldetectie-melding */
    if (bundle) {
      const saveOnce = sumLoose.once - bundle.priceOnce;
      const saveMonthly = sumLoose.monthly - bundle.priceMonthly;
      let txt = 'Dit is onze <strong>' + bundle.name + '</strong>.';
      if (saveOnce > 0 || saveMonthly > 0) {
        const parts = [];
        if (saveOnce > 0) parts.push(eur(saveOnce) + ' eenmalig');
        if (saveMonthly > 0) parts.push(eur(saveMonthly) + ' p/mnd');
        txt += ' Je bespaart ' + parts.join(' en ') + ' — al verrekend in het totaal.';
      } else {
        txt += ' De bundelprijs is al verrekend in het totaal.';
      }
      el.bundleText.innerHTML = txt;
      el.bundleHint.classList.add('is-on');
      el.bundleApply.style.display = 'none';
    } else {
      /* Bijna-match: zelfde of grotere selectie die 1 stap van een bundel af zit tonen we niet;
         we tonen wél de dichtstbijzijnde bundel als upgrade-tip wanneer de chatbot aan staat
         met de Restaurant-samenstelling minus één module. Simpel gehouden: alleen exacte match. */
      el.bundleHint.classList.remove('is-on');
    }

    /* sticky mobiele balk */
    if (el.bar) {
      el.bar.classList.add('is-on');
      el.bar.querySelector('[data-bar-once]').textContent = eur(totals.once);
      el.bar.querySelector('[data-bar-monthly]').textContent = eur(totals.monthly) + ' p/mnd';
    }

    /* payload naar formulier en WhatsApp */
    const textLines = lines.map(function (l) { return '• ' + l.label.replace(/<[^>]+>/g, '') + ': ' + l.value.replace(/ /g, ' '); });
    const payload =
      'Mijn samenstelling via mrhostly.nl:\n' +
      textLines.join('\n') +
      '\n\nTotaal eenmalig: ' + eur(totals.once).replace(/ /g, ' ') +
      '\nTotaal per maand: ' + eur(totals.monthly).replace(/ /g, ' ') +
      '\n(excl. btw · 12 mnd looptijd · incl. hosting, updates en zelfbeheer-admin)';
    if (el.payload) el.payload.value = payload;
    if (el.whatsappOut && window.MRHOSTLY_CONTACT && window.MRHOSTLY_CONTACT.whatsapp) {
      el.whatsappOut.href = 'https://wa.me/' + window.MRHOSTLY_CONTACT.whatsapp + '?text=' + encodeURIComponent(payload);
    }
  }

  root.addEventListener('input', update);
  root.addEventListener('change', update);
  if (el.bundleApply) {
    el.bundleApply.addEventListener('click', function () {
      const b = matchBundle(readState());
      if (b) applyBundle(b);
    });
  }
  update();

  /* Exporteer voor tests */
  window.MRHOSTLY_BUILDER = { PRICE: PRICE, BUNDLES: BUNDLES, priceOf: priceOf };
})();
