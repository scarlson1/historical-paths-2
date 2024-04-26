import { isFinite } from 'lodash-es';
import { verify } from './validate.js';
export function betweenRange(value, n1, n2) {
    return n1 <= value && n2 >= value;
}
export const isValidCoords = (val) => {
    if (!val)
        return false;
    const { latitude, longitude } = val;
    return isLongitude(longitude) && isLatitude(latitude);
};
export const isLongitude = (lon) => !!(isFinite(lon) && betweenRange(lon, -180, 180));
export const isLatitude = (lat) => !!(isFinite(lat) && betweenRange(lat, -90, 90));
export function validateCoords(coords) {
    verify(coords, 'coordinates required');
    const { latitude, longitude } = coords;
    verify(latitude && longitude && isValidCoords(coords), 'coordinates required');
}
//# sourceMappingURL=validateCoords.js.map