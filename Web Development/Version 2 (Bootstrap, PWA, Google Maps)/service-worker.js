const staticCacheName = 'site-static-v1';			// name of our cache – the shell resources. We write here cos will access it a lot.
const assets = [ '/',					        // assets to cache. Each URL’s assets to store. Note forward slash / is a request! Will store url-response as k-v pair.
     '/index.html',
     '/contact.html',
     '/menu.html',
     '/thankyou.html',
     '/detailsWMDPWA.html',
     '/listingsWMDPWA.html',
     '/manifest.json',
     '/js/bootstrap.min.js',
     '/js/geopositioning.js',
     '/js/jquery-3.3.1.min.js',
     '/js/popper.min.js',
     '/js/wmp_assignment_1.js',
     '/js/wmp_assignment_2.js',
     '/js/bootstrap.min.js.map',
     '/img/location.jpg',
     '/img/pexels-pixabay-326311.jpg',
     '/img/buffalowings.jpg',
     '/img/juicyburger.jpg',
     '/img/medium-rare-steak-shutterstock_706040446.jpg',
     '/img/Outback-Jacks-Bar-Grill-Ribs-Combo.jpg',
     '/img/saumon-moelleux-et-croustillant.jpg',
     '/img/st_20160408_rtpicks08_2198321.jpg',
     '/img/bull-side-view-black-animal-shape.png',
     '/img/meatbomb_logo_official_192.png',
     '/img/meatbomb_logo_official_512.png',
     '/img/meatbomb_logo_official.png',
     '/img/payment.png',
     '/css/bootstrap.min.css',
     '/css/contact.css',
     '/css/index.css',
     '/css/menu.css',
     '/css/thankyou.css',
     '/css/detailsWMDPWA.css',
     '/css/listingsWMDPWA.css',
     '/css/bootstrap.min.css.map'
];					

self.addEventListener('install', evt => {			            // callback fn takes an event obj
    console.log('service worker has been installed', evt);

    // for the web caching for our web assets
    evt.waitUntil(					                        // need this cos the SW install event is shorter than the async caching.
        caches.open(staticCacheName)			            // open the cache if exists. If not, create it. An async task, so will take some time.
            .then( cache => {
                console.log('caching shell assets');
                cache.addAll(assets);			            // adds an array of responses from server into cache
            })
    );
});

self.addEventListener("activate", function(evt){
    console.log("Service Worker activating.", evt);
    
    // each time you activate, run the below to delete old cache so the browser knows to only use the newest cache
    evt.waitUntil(					                    // expects only one promise to be returned
        caches.keys()						            // retrieves all keys from caches. keys are the names of each cache
            .then( keys => {
                return Promise.all(keys				    // takes an array of Proms, when every is resolved, then itself is resolvd
                    .filter(key => key !== staticCacheName)	// if not eq to current cache name, return it, so we delete it later
                    .map(key => caches.delete(key))
                )
            })
    );

}); 

self.addEventListener('fetch', evt => {			
    // console.log('fetch event', evt);

    // retrieve from cache instead of server if exists
    evt.respondWith	(				                    // pause the fetch event and respond with our own custom event
        caches.match(evt.request)			            // check if a request exists in our cache already
            .then( cacheRes => {                        // cacheResponse, which either be the matched request’s response, or NULL
                return cacheRes || fetch(evt.request);  // return either the cached response, or if don’t have, fetch it from server
            })			
    )
});
