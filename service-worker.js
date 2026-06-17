// service-worker.js - Service Worker básico para o MiscSets Finance
const CACHE_NAME = 'miscfinance-v1';
const ASSETS = [
  'index.html',
  'style.css',
  'app.js',
  'manifest.json',
  'MiscFinance_192x.png',
  'MiscFinance_512x.png'
];

// Instala o Service Worker e armazena os arquivos essenciais no cache do celular
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativa o Service Worker e limpa caches antigos se houver
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativo!');
});

// Estratégia de fetch: tenta buscar na rede, se falhar ou estiver offline, usa o cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
