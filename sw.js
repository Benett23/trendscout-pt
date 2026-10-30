// Service worker : permet d'utiliser l'application hors ligne une fois chargée.
// Stratégie « réseau d'abord, cache en secours » : les mises à jour arrivent dès qu'il y a du réseau.
const CACHE = "trendscout-v7";
const ASSETS = [
  "./",
  "index.html",
  "app.html",
  "vitrine.css",
  "vitrine.js",
  "images/graphique-clair.svg",
  "images/graphique-sombre.svg",
  "images/graphique-mobile-clair.svg",
  "images/graphique-mobile-sombre.svg",
  "tokens.css",
  "jeu-tokens.css",
  "accueil-tokens.css",
  "app.css",
  "app.js",
  "data.js",
  "jeu-data.js",
  "jeu.js",
  "main.js",
  "manifest.webmanifest",
  "fonts/inter-latin.woff2",
  "fonts/inter-latin-ext.woff2",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "assets/personnages/conseiller-clin-d-oeil.svg",
  "assets/personnages/conseiller-demasque.svg",
  "assets/personnages/conseiller-insistant.svg",
  "assets/personnages/conseiller-pose.svg",
  "assets/personnages/conseiller-sourire.svg",
  "assets/personnages/fomo-decu.svg",
  "assets/personnages/fomo-excite.svg",
  "assets/personnages/fomo-neutre.svg",
  "assets/personnages/fomo-panique.svg",
  "assets/personnages/fomo-pose.svg",
  "assets/personnages/fomo-presse.svg",
  "assets/personnages/malik-content.svg",
  "assets/personnages/malik-encourageant.svg",
  "assets/personnages/malik-fier.svg",
  "assets/personnages/malik-inquiet.svg",
  "assets/personnages/malik-neutre.svg",
  "assets/personnages/malik-pose.svg",
  "assets/personnages/malik-reflechi.svg",
  "assets/personnages/patience-encourageante.svg",
  "assets/personnages/patience-pose.svg",
  "assets/personnages/patience-reflechie.svg",
  "assets/personnages/patience-sereine.svg",
  "assets/personnages/patience-souriante.svg",
  "assets/personnages/revanche-abattu.svg",
  "assets/personnages/revanche-apaise.svg",
  "assets/personnages/revanche-enerve.svg",
  "assets/personnages/revanche-pose.svg",
  "assets/personnages/revanche-tendu.svg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("app.html")))
  );
});
