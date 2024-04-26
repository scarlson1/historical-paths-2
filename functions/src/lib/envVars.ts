import {
  defineInt,
  // defineFloat, not implemented yet in firebase-functions
  defineSecret,
  defineString,
} from 'firebase-functions/params';

export const dbPassword = defineSecret('DB_PASSWORD');

// TODO: change user to read only
export const dbUser = defineString('DB_USER'); // 'spencer';
export const dbHost = defineString('DB_HOST'); // 'idemand-db-cluster-14272.5xj.gcp-us-central1.cockroachlabs.cloud'
export const dbDatabase = defineString('DB_DATABASE'); // 'historical_paths';
export const audience = defineString('AUDIENCE');

export const dbPort = defineInt('DB_PORT'); // 26257
