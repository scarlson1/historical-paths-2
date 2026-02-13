import {
  defineInt,
  // defineFloat, not implemented yet in firebase-functions
  defineSecret,
  defineString,
} from 'firebase-functions/params';

export const dbPassword = defineSecret('DB_PASSWORD');

export const dbUser = defineString('DB_USER');
export const dbHost = defineString('DB_HOST');
export const dbDatabase = defineString('DB_DATABASE');
export const audience = defineString('AUDIENCE');

export const dbPort = defineInt('DB_PORT');
