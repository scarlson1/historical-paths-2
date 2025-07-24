import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import { getDB } from '../lib/db.js';
import { dbPassword } from '../lib/index.js';
import { EventRow } from '../types/index.js';

const getlasteventdate = async (_: CallableRequest) => {
  try {
    const { query } = getDB(dbPassword.value());
    let q = `SELECT * FROM hurricane_data ORDER BY iso_time DESC LIMIT 1;`;
    const { rows } = await query<EventRow>(q);

    let lastEvent = rows[0];
    return {
      iso_time: lastEvent?.iso_time ?? null,
      year: lastEvent?.year ?? null,
      name: lastEvent?.name ?? null,
    };
  } catch (err) {
    console.log('ERROR: ', err);
    throw new HttpsError('unknown', 'error fetching historical event data');
  }
};

export default getlasteventdate;
