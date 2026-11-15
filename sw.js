// Petit service worker : le jeu s’ouvre plus vite et marche même sans réseau.
const CACHE="objectif-france-v19";
const FICHIERS=["./","./index.html","./manifest.webmanifest","./apple-touch-icon.png","./icon-192.png","./icon-512.png","./images/coco-cezanne.jpg","./images/coco-degaulle.jpg","./images/coco-elysee.jpg","./images/coco-esclavage.jpg","./images/coco-ferry.jpg","./images/coco-fontaine.jpg","./images/coco-mairie.jpg","./images/coco-marianne.jpg","./images/coco-moliere.jpg","./images/coco-napoleon.jpg","./images/coco-piaf.jpg","./images/coco-police.jpg","./images/coco-pompiers.jpg","./images/coco-samu.jpg","./images/coco-vitale.jpg","./images/coco-vote.jpg","./images/famille-1.jpg","./images/famille-2.jpg","./images/famille-3.jpg"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FICHIERS)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const url=new URL(r.url); if(url.origin!==location.origin) return;
  if(r.mode==="navigate"||url.pathname.endsWith(".html")){
    // Page : d’abord le réseau (pour avoir la dernière version), sinon la copie
    e.respondWith(fetch(r).then(res=>{ const copie=res.clone(); caches.open(CACHE).then(c=>c.put(r,copie)); return res; }).catch(()=>caches.match(r).then(x=>x||caches.match("./index.html"))));
    return;
  }
  if(url.pathname.includes("/audio/")) return;
  e.respondWith(caches.match(r).then(x=>x||fetch(r)));
});
