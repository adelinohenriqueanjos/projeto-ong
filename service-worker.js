const CACHE = 'ips-v1';
const ARQUIVOS = [
    '/',
    '/index.html',
    '/quem-somos.html',
    '/projetos.html',
    '/impacto.html',
    '/cadastro.html',
    '/obrigado.html',
    '/assets/css/style.css',
    '/assets/js/script.js',
    '/assets/img/logo.svg'
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
    );
});