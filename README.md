# prashantique.github.io

Personal site for Prashant Sharma, served at <https://prashantique.github.io/>.

Static HTML, CSS and vanilla JavaScript. No framework, no build step, no CDN and
no analytics. The two fonts are variable `woff2` files served from this repo, so
nothing about a visitor reaches a third party.

The Pentest Toolkit lives in its own repository and is served from the same
origin at `/pentest-toolkit/`, which is why the links here are relative.

## Running locally

```bash
python3 -m http.server 8000
# http://127.0.0.1:8000/
```

## Layout

```
index.html          the page
404.html            not-found page, styled the same
assets/style.css    design tokens, layout, both themes
assets/fonts.css    self-hosted @font-face rules
assets/fonts/       Inter and JetBrains Mono, variable, latin subset
assets/site.js      theme choice, scroll reveals, footer year
```

One value is stored in the browser: `ps-theme`, the light or dark choice.
