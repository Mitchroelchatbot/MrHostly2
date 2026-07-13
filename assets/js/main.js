/* Mr. Hostly — main.js
   Navigatie, chatbot-demo in de hero, ROI-calculator, scroll-reveal. */

/* Contactgegevens op één plek.
   [NEEDS INPUT] Vul telefoonnummer en WhatsApp-nummer in (internationaal
   formaat zonder + of spaties voor WhatsApp, bv. 31612345678).
   Lege waarden verbergen de bijbehorende knoppen automatisch. */
window.MRHOSTLY_CONTACT = {
  phone: '',            /* bv. '+31612345678' */
  phoneDisplay: '',     /* bv. '06 12 34 56 78' */
  whatsapp: '',         /* bv. '31612345678' */
  email: 'info@mrhostly.nl' /* [NEEDS INPUT] bevestig e-mailadres */
};

(function () {
  const C = window.MRHOSTLY_CONTACT;

  /* Telefoon- en WhatsApp-knoppen activeren of verbergen */
  document.querySelectorAll('[data-phone-link]').forEach(function (el) {
    if (C.phone) {
      el.href = 'tel:' + C.phone.replace(/\s/g, '');
      if (el.hasAttribute('data-phone-label')) el.textContent = C.phoneDisplay || C.phone;
    } else {
      el.style.display = 'none';
    }
  });
  document.querySelectorAll('[data-whatsapp-link]').forEach(function (el) {
    if (C.whatsapp) {
      el.href = 'https://wa.me/' + C.whatsapp;
    } else {
      el.style.display = 'none';
    }
  });
  document.querySelectorAll('[data-email-link]').forEach(function (el) {
    el.href = 'mailto:' + C.email;
    if (el.hasAttribute('data-email-label')) el.textContent = C.email;
  });

  /* Mobiel menu */
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      const open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Scroll-reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Chatbot-demo: gescript gesprek, oneindig herhalend */
  const chatBody = document.querySelector('[data-chat-demo]');
  if (chatBody) {
    const script = [
      { who: 'guest', text: 'Hebben jullie vrijdag om 19:30 een tafel voor 4?' },
      { who: 'bot', text: 'Zeker! Vrijdag 19:30 heb ik nog plek voor 4 personen. Zal ik reserveren op jouw naam?' },
      { who: 'guest', text: 'Ja graag. Eén van ons eet glutenvrij.' },
      { who: 'bot', text: 'Genoteerd ✅ Tafel voor 4, vrijdag 19:30, 1× glutenvrij. Je krijgt zo een bevestiging. Tot vrijdag!' }
    ];
    const typing = chatBody.querySelector('.chat-typing');
    let idx = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function addMsg(step) {
      const div = document.createElement('div');
      div.className = 'chat-msg chat-msg--' + step.who;
      div.textContent = step.text;
      chatBody.insertBefore(div, typing);
      /* maximaal 4 berichten in beeld */
      const msgs = chatBody.querySelectorAll('.chat-msg');
      if (msgs.length > 4) msgs[0].remove();
    }

    function next() {
      const step = script[idx % script.length];
      const isBot = step.who === 'bot';
      if (isBot && !reduced) {
        typing.classList.add('is-on');
        setTimeout(function () {
          typing.classList.remove('is-on');
          addMsg(step);
          idx++;
          setTimeout(next, 2600);
        }, 1100);
      } else {
        addMsg(step);
        idx++;
        setTimeout(next, isBot ? 2600 : 1600);
      }
      /* korte pauze na afloop van het gesprek */
      if (idx % script.length === 0) idx = idx; /* loopt gewoon door */
    }
    setTimeout(next, 800);
  }

  /* ROI-calculator */
  const roi = document.querySelector('[data-roi]');
  if (roi) {
    const inputs = {
      resPerWeek: roi.querySelector('#roi-res'),
      noShowPct: roi.querySelector('#roi-noshow'),
      phoneHours: roi.querySelector('#roi-phone'),
      spend: roi.querySelector('#roi-spend'),
      recoverPct: roi.querySelector('#roi-recover')
    };
    const outs = {
      resPerWeek: roi.querySelector('#roi-res-out'),
      noShowPct: roi.querySelector('#roi-noshow-out'),
      phoneHours: roi.querySelector('#roi-phone-out'),
      spend: roi.querySelector('#roi-spend-out'),
      recoverPct: roi.querySelector('#roi-recover-out'),
      noShowLoss: roi.querySelector('#roi-out-loss'),
      recovered: roi.querySelector('#roi-out-recovered'),
      hours: roi.querySelector('#roi-out-hours'),
      total: roi.querySelector('#roi-out-total')
    };
    const eur = function (n) {
      return '€ ' + Math.round(n).toLocaleString('nl-NL');
    };
    function calc() {
      const res = +inputs.resPerWeek.value;
      const noShow = +inputs.noShowPct.value;
      const hours = +inputs.phoneHours.value;
      const spend = +inputs.spend.value;
      const recover = +inputs.recoverPct.value;

      outs.resPerWeek.textContent = res;
      outs.noShowPct.textContent = noShow + '%';
      outs.phoneHours.textContent = hours + ' uur';
      outs.spend.textContent = eur(spend);
      outs.recoverPct.textContent = recover + '%';

      /* gemiste omzet door no-shows per maand (± 4,33 weken) */
      const lossMonth = res * 4.33 * (noShow / 100) * spend;
      /* deel dat je terugwint door directe bevestiging + herinnering —
         percentage stel je zelf in, dit is een aanname, geen belofte */
      const recovered = lossMonth * (recover / 100);
      const hoursMonth = hours * 4.33;

      outs.noShowLoss.textContent = eur(lossMonth) + ' p/mnd';
      outs.recovered.textContent = eur(recovered) + ' p/mnd';
      outs.hours.textContent = Math.round(hoursMonth) + ' uur p/mnd';
      outs.total.textContent = eur(recovered);
    }
    Object.values(inputs).forEach(function (el) { el.addEventListener('input', calc); });
    calc();
  }
})();
