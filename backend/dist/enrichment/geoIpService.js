"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoIPService = void 0;
class GeoIPService {
    static knownGeoMap = {
        '8.8.8.8': { country: 'United States', city: 'Mountain View', latitude: 37.4056, longitude: -122.0775, asn: 'AS15169 Google LLC' },
        '1.1.1.1': { country: 'Australia', city: 'Sydney', latitude: -33.8688, longitude: 151.2093, asn: 'AS13335 Cloudflare' },
    };
    static lookup(ip) {
        if (!ip)
            return {};
        if (this.knownGeoMap[ip])
            return this.knownGeoMap[ip];
        // Default GeoIP fallback mapping simulation for external IPs
        if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.16.')) {
            return { country: 'Internal Network', city: 'Datacenter LAN', latitude: 0, longitude: 0, asn: 'AS-PRIVATE' };
        }
        // Default external IP location
        return {
            country: 'United States',
            city: 'Ashburn',
            latitude: 39.0438,
            longitude: -77.4874,
            asn: 'AS16509 Amazon.com',
        };
    }
}
exports.GeoIPService = GeoIPService;
