import { getApps, initializeApp } from 'firebase-admin/app';
// initializeApp();
if (!getApps().length)
    initializeApp();
export { events } from './callables/index.js';
//# sourceMappingURL=index.js.map