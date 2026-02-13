# Historical Paths

A simple map displaying hurricane tracks which passed within a certain distance of a location.

Given a location, the query selects events according the following criteria:

- Category 5 within 150 miles
- Category 3-5 within 125 miles
- Category 1-2 within 100 miles
- Category 0 within 50 miles

Originally intended to help homeowners understand the frequency and severity of hurricanes at their location.

---

## Data

Data source: (NOAA International Best Track Archive for Climate Stewardship (IBTrACS))[https://www.ncei.noaa.gov/products/international-best-track-archive]

### Pipeline

Kestra data pipeline is run monthly to update data from NOAA. The data is filtered to North Atlantic and Western Pacific basins and to events that achieved a minimum usa_sshs of 1.

(noaa-hurricanes-pipeline repo)[https://github.com/scarlson1/noaa-hurricanes-pipeline]

---

### Usage

TODO

### Development

**Firebase functions**

```bash
cd functions & npm install
# start function emulators
npm run dev
```

- sets service account path as env var (`export GOOGLE_APPLICATION_CREDENTIALS=[PATH_TO_SERVICE_ACCOUNT].json`)
- `firebase emulators:start --only functions,auth`
- `tsc --watch`

To switch between projects, use (firebase alias)[https://firebase.google.com/docs/cli#project_aliases]

```bash
firebase use [alias]
```

**React**

```bash
cd client & npm run dev
# same as: vite --mode development
```

**Env Vars**

Firebase functions env vars

`.env.[project]`

- `DB_USER`
- `DB_HOST`
- `DB_DATABASE`
- `AUDIENCE`
- `DB_PORT`

GCP Secret Manager or .env.local

- `DB_PASSWORD`

React env vars

`.env`

- `VITE_FB_API_KEY`
- `VITE_FB_AUTH_DOMAIN`
- `VITE_FB_PROJECT_ID`
- `VITE_FB_STORAGE_BUCKET`
- `VITE_FB_MESSAGING_SENDER_ID`
- `VITE_FB_APP_ID`

`.env.local` / `.env.prod`

- `VITE_GOOGLE_GEO_KEY`
- `VITE_MAPBOX_ACCESS_TOKEN`

### Deployment

**Client**

```bash
cd functions
npm run deploy:dev # or npm run deploy:prod
# firebase use dev
# vite build
# firebase deploy --only hosting
```

**Firebase functions**

```bash
npm run build # rm -rf ./dist/ && tsc
npm run deploy # firebase deploy --only functions
```
