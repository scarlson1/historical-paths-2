import { HttpsError } from 'firebase-functions/v1/auth';
import invariant from 'tiny-invariant';
// throw firebase function error
export function validate(condition, code, msg) {
    try {
        invariant(condition, msg);
    }
    catch (err) {
        let errMsg = 'validation failed';
        const invariantErrMsg = err?.message?.replace('Invariant failed: ', '').trim();
        if (invariantErrMsg)
            errMsg = invariantErrMsg;
        throw new HttpsError(code, errMsg);
    }
}
// throw normal error
export function verify(condition, msg) {
    try {
        invariant(condition, msg);
    }
    catch (err) {
        let errMsg = 'validation failed';
        // invariant removes "Invariant failed: " in production
        const invariantErrMsg = err?.message?.replace('Invariant failed: ', '').trim();
        if (invariantErrMsg)
            errMsg = invariantErrMsg;
        throw new Error(errMsg);
    }
}
//# sourceMappingURL=validate.js.map