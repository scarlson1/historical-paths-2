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

TODO

### Deployment

TODO
