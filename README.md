# MrHostly — website

Marketing website for **MrHostly**, the AI co-host that answers guest messages
for short-term rental hosts (Airbnb, Booking.com, Vrbo) instantly, 24/7, in
any language.

## Stack

Plain static HTML/CSS/JS — no build step, no dependencies.

```
index.html            # single-page site (hero, features, how-it-works, pricing, FAQ, CTA)
assets/css/style.css  # design tokens + all styling
assets/js/main.js     # mobile nav, animated chat demo, signup form
assets/img/           # favicon and images
```

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

Works out of the box on any static host: GitHub Pages, Netlify, Vercel,
Cloudflare Pages. Just point it at the repository root.

## Claude Code

This repo registers the [ECC](https://github.com/affaan-m/ECC) plugin
marketplace and enables the `ecc` plugin via `.claude/settings.json`, so
anyone opening it in Claude Code gets the ECC skills and workflows.
