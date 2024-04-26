import { onCall } from 'firebase-functions/v2/https';
import { dbPassword } from '../lib/index.js';
export const events = onCall({ secrets: [dbPassword] }, async (request) => {
    return (await import('./events.js')).default(request);
});
// export const testfn = onCall(
//   { cors: [/firebase\.com$/, 'localhost:5000', 'localhost:3000'] }, // cors: [/yourdomain\.com$/, 'yourdomain.com'],
//   async (request) => {
//     console.log('importing testfn func...');
//     return (await import('./testfn.js')).default(request);
//   }
// );
//# sourceMappingURL=index.js.map