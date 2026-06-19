/* NEW START 321 Healthy New Life - Service Worker */
/* 每次改版請把 CACHE 版本號 +1（例如 v1 -> v2），iOS 才會抓到新版 */
var CACHE = 'newstart321-v1';

/* 要快取的 app 殼層檔案（與 index.html 同一層） */
var ASSETS = [
  './',
  './index.html',
  './favicon-32.png',
  './favicon-16.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
];

/* 安裝：把殼層檔案存進快取 */
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

/* 啟用：清掉舊版快取 */
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== CACHE){ return caches.delete(k); }
      }));
    })
  );
  self.clients.claim();
});

/* 取用：先回快取，沒有再連網；連網成功就順手更新快取（離線可用） */
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET'){ return; }
  e.respondWith(
    caches.match(e.request).then(function(cached){
      var fetched = fetch(e.request).then(function(res){
        if(res && res.status === 200 && res.type === 'basic'){
          var copy = res.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
        }
        return res;
      }).catch(function(){ return cached; });
      return cached || fetched;
    })
  );
});
