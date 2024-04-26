// import { Pool } from 'pg'; // es module support will be added soon
import pg from 'pg';
import { dbDatabase, dbHost, dbPort, dbUser } from './envVars.js';
const { Pool } = pg;
// TODO: change env var names to use default picked up by node-postgres
// https://node-postgres.com/features/connecting
// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_USER_PASSWORD,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   port: parseInt(process.env.DB_PORT || '26257'),
//   ssl: true,
// });
// export const query = (text: any, params?: any[]) => pool.query(text, params);
// TODO: create a class instead ?? scoping pool within getDB defeats the purpose of Pool
export const getDB = (password) => {
    const pool = new Pool({
        user: dbUser.value(),
        password,
        host: dbHost.value(),
        database: dbDatabase.value(),
        port: dbPort.value(),
        ssl: true,
    });
    return {
        query: (text, params) => pool.query(text, params), // pool.query,
    };
};
// module.exports = {
//   query: (text: any, params: any[]) => pool.query(text, params),
// };
// TODO: graceful shutdown (pool.end)
//# sourceMappingURL=db.js.map