// 캐시 이름 버전을 v2로 올려 이전 캐시를 갱신합니다.
const CACHE_NAME = 'workbook-pwa-cache-v2'; 

// 오프라인에서 작동하기 위해 저장할 파일 목록에 logo.png를 추가했습니다.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png' 
];

// 서비스 워커 설치 시 파일 캐싱
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 오프라인 상태일 때 캐시된 파일 제공
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // 캐시에 있으면 캐시 반환
        }
        return fetch(event.request); // 없으면 네트워크 요청
      })
  );
});

// 구버전 캐시 삭제 (업데이트 관리용)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
