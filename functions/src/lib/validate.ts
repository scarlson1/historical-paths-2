import { HttpsError } from 'firebase-functions/v1/auth';
import type { FunctionsErrorCode } from 'firebase-functions/v1/https';
import invariant from 'tiny-invariant';

// throw firebase function error
export function validate(
  condition: any,
  code: FunctionsErrorCode,
  msg?: string | (() => string)
): asserts condition {
  try {
    invariant(condition, msg);
  } catch (err: any) {
    let errMsg = 'validation failed';

    const invariantErrMsg = err?.message?.replace('Invariant failed: ', '').trim();
    if (invariantErrMsg) errMsg = invariantErrMsg;

    throw new HttpsError(code, errMsg);
  }
}

// throw normal error
export function verify(condition: any, msg?: string | (() => string)): asserts condition {
  try {
    invariant(condition, msg);
  } catch (err: any) {
    let errMsg = 'validation failed';
    // invariant removes "Invariant failed: " in production
    const invariantErrMsg = err?.message?.replace('Invariant failed: ', '').trim();
    if (invariantErrMsg) errMsg = invariantErrMsg;

    throw new Error(errMsg);
  }
}
