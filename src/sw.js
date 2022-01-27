/* eslint-disable */

import {ExpirationPlugin} from 'workbox-expiration';
import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    /.*\/getCases$/,
    new StaleWhileRevalidate({
        cacheName: 'covidData-api-cache',
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 2 * 60 * 60, // 2 min
            }),
        ],
    })
);
registerRoute(
    /.*\/india\.topo\.json$/,
    new StaleWhileRevalidate({
        cacheName: 'map-topo-json-cache',
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
            }),
        ],
    })
);
