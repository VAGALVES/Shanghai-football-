/* =====================================================================
   Service worker — Football Trilíngue
   • Páginas (index.html): rede primeiro (sempre fresco online), cache como
     reserva quando estiver offline ou a rede demorar mais de 4 s.
   • Fontes, ícones e manifest: cache primeiro (nunca mudam sem trocar de nome).
   • Para forçar renovação dos arquivos estáticos, aumente VERSION.
   ===================================================================== */
const VERSION = "1.0.1";
const CACHE   = "fb3-" + VERSION;
const SCOPE   = self.registration.scope;
const INDEX   = new URL("./index.html", SCOPE).href;

const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./favicon-32.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
  "./barlow-latin-400-normal.woff2",
  "./barlow-latin-ext-400-normal.woff2",
  "./barlow-latin-600-normal.woff2",
  "./barlow-latin-ext-600-normal.woff2",
  "./barlow-condensed-latin-600-normal.woff2",
  "./barlow-condensed-latin-ext-600-normal.woff2",
  "./barlow-condensed-latin-800-normal.woff2",
  "./barlow-condensed-latin-ext-800-normal.woff2"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("fb3-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const timeout = ms => new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms));

async function paginaRedePrimeiro(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await Promise.race([fetch(req), timeout(4000)]);
    if (res && res.ok) cache.put(INDEX, res.clone());   // guarda sempre como index.html
    return res;
  } catch (err) {
    const hit = await cache.match(INDEX);
    if (hit) return hit;
    throw err;
  }
}

async function estaticoCachePrimeiro(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok) cache.put(req, res.clone());
  return res;
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;          // só arquivos do próprio app

  const ehPagina = req.mode === "navigate" || req.destination === "document";
  event.respondWith(ehPagina ? paginaRedePrimeiro(req) : estaticoCachePrimeiro(req));
});

self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
