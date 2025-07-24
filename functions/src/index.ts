import { getApps, initializeApp } from 'firebase-admin/app';

// initializeApp();
if (!getApps().length) initializeApp();

export { eventsv2, getlasteventdate } from './callables/index.js';
