import { HttpsError } from 'firebase-functions/v2/https';
import { getDB } from '../lib/db.js';
import { addTriggerCategory, dbPassword, formatEventsSummary, isValidCoords, validate, } from '../lib/index.js';
const events = async ({ data }) => {
    const { latitude, longitude } = data;
    validate(latitude && longitude && isValidCoords({ latitude, longitude }), 'invalid-argument', 'coordinates required');
    // query events
    const queryString = getQueryString({ lat: latitude, lng: longitude });
    try {
        console.log('Fetching events...');
        const { query } = getDB(dbPassword.value());
        const { rows } = await query(queryString);
        // rows.forEach((r) => {
        //   console.log('ROW: ', r.id);
        // });
        // temp fix: query returns years and category as strings
        let numberFixEvents = rows.map((e) => ({
            ...e,
            category: parseInt(e.category),
            year: parseInt(e.year),
        }));
        let newEvents = addTriggerCategory(numberFixEvents, [longitude, latitude]);
        let summaryData = formatEventsSummary(numberFixEvents);
        // let costByYear = createCostByYear(newEvents, [1972, 2021]);
        // let chartData = formatTableData(costByYear);
        let responseData = {
            // : ResponseData
            events: newEvents,
            eventYears: summaryData,
            // chartData: chartData,
        };
        return responseData;
        // return rows;
    }
    catch (err) {
        // throw new DBConnectionError('Something went wrong querying the events database');
        console.log('ERROR: ', err);
        throw new HttpsError('unknown', 'error fetching historical event data');
    }
};
// export default onCallWrapper<AddBillingEntityRequest>('addBillingEntity', addBillingEntity);
export default events;
// TODO: create spatial index:
// create geometry indexes: https://www.cockroachlabs.com/docs/v23.2/spatial-indexes#create-a-spatial-index
// docs indexing on JSONB and ARRAY (GIN index): https://www.cockroachlabs.com/docs/v23.2/create-index
const getQueryString = ({ lat, lng }) => {
    // CAST(MIN(season) AS INT) as year
    // TODO: fix MIN() converting year and category to strings
    let queryString = "WITH hurricanes AS ( SELECT MIN(name) as name, CAST(MIN(season) AS int) as year, MIN(sid) as id, MAX(usa_sshs) as category, ARRAY_AGG(json_build_object('coordinates', array[longitude, latitude], 'datetime', TO_CHAR(timestamp, 'Mon FMDD, YYYY FMHH:MI am'), 'category', usa_sshs, 'id', sid, 'point_id', point_id, 'name', name, 'year', season)";
    queryString += ' ORDER BY iso_time ASC) AS track';
    // queryString += `, ARRAY_AGG(array[longitude, latitude] ORDER BY iso_time ASC) as path`;
    queryString += `, ARRAY_AGG(JSON_BUILD_ARRAY(longitude, latitude) ORDER BY iso_time ASC) as path`;
    queryString += ' FROM hurricane_data';
    // Tropical storms within 50 radius
    // queryString += ` WHERE sid IN (SELECT sid FROM hurricane_data WHERE usa_sshs IN (0) AND ST_DWithin (ST_GeographyFromText('POINT(${lng} ${lat})'), ST_GeographyFromText('POINT('||longitude||' '||latitude||')'), 80467))`;
    queryString += ` WHERE sid IN (SELECT sid FROM hurricane_data WHERE usa_sshs IN (0) AND ST_DWithin (ST_GeographyFromText('POINT(${lng} ${lat})'), geography, 80467))`;
    // queryString += ` WHERE sid IN (SELECT sid FROM hurricane_data WHERE usa_sshs IN (0) AND ST_DWithin (ST_GeomFromText('POINT(${lng} ${lat})'), geometry, 80467))`;
    // categories 1 & 2 within 100 miles
    // queryString += ` OR sid IN (SELECT sid FROM hurricane_data WHERE usa_sshs IN (1, 2) AND ST_DWithin(ST_GeographyFromText('POINT(${lng} ${lat})'), ST_GeographyFromText('POINT('||longitude||' '||latitude||')'), 160934))`;
    queryString += ` OR sid IN (SELECT sid FROM hurricane_data WHERE usa_sshs IN (1, 2) AND ST_DWithin(ST_GeographyFromText('POINT(${lng} ${lat})'), geography, 160934))`;
    // queryString += ` OR sid IN (SELECT sid FROM hurricane_data WHERE usa_sshs IN (1, 2) AND ST_DWithin(ST_GeomFromText('POINT(${lng} ${lat})'), geometry, 160934))`;
    // 3 & 4 cat within 125 miles
    // queryString += ` OR sid IN (SELECT sid FROM hurricane_data WHERE usa_sshs IN (3, 4) AND ST_DWithin(ST_GeographyFromText('POINT(${lng} ${lat})'), ST_GeographyFromText('POINT('||longitude||' '||latitude||')'), 201168))`;
    queryString += ` OR sid IN (SELECT sid FROM hurricane_data WHERE usa_sshs IN (3, 4) AND ST_DWithin(ST_GeographyFromText('POINT(${lng} ${lat})'), geography, 201168))`;
    // queryString += ` OR sid IN (SELECT sid FROM hurricane_data WHERE usa_sshs IN (3, 4) AND ST_DWithin(ST_GeomFromText('POINT(${lng} ${lat})'), geometry, 201168))`;
    // cat 5 within 150 miles
    // queryString += ` OR sid IN (SELECT sid FROM hurricane_data WHERE usa_sshs IN (5) AND ST_DWithin(ST_GeographyFromText('POINT(${lng} ${lat})'), ST_GeographyFromText('POINT('||longitude||' '||latitude||')'), 241402))`;
    queryString += ` OR sid IN (SELECT sid FROM hurricane_data WHERE usa_sshs IN (5) AND ST_DWithin(ST_GeographyFromText('POINT(${lng} ${lat})'), geography, 241402))`;
    // queryString += ` OR sid IN (SELECT sid FROM hurricane_data WHERE usa_sshs IN (5) AND ST_DWithin(ST_GeomFromText('POINT(${lng} ${lat})'), geometry, 241402))`;
    queryString += ' GROUP BY sid)';
    queryString += ' SELECT * FROM hurricanes ORDER BY year ASC';
    return queryString;
};
//# sourceMappingURL=events.js.map