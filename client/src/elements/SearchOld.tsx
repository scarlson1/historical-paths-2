import {
  Autocomplete,
  AutocompleteChangeReason,
  Box,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { debounce } from '@mui/material/utils';
import { useLocationStore } from 'context';
// import throttle from 'lodash/throttle';
import { LocationOnRounded } from '@mui/icons-material';
import parse from 'autosuggest-highlight/parse';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { SyntheticEvent } from 'react';
import toast from 'react-hot-toast';

// TODO: use library ?? https://github.com/googlemaps/js-api-loader
function loadScript(src: string, position: HTMLHeadElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

type AutocompleteService = {
  getPlacePredictions(
    request: google.maps.places.AutocompletionRequest,
    callback?: (
      a: google.maps.places.AutocompletePrediction[] | null,
      b: google.maps.places.PlacesServiceStatus
    ) => void
  ): Promise<google.maps.places.AutocompleteResponse>;
};

const autocompleteService: { current: AutocompleteService | null } = { current: null };
const geocodeService: { current: any } = { current: null };

// interface SearchProps {
//   getPathsFromSearch: (coords: Coordinates) => void; // , addr: string
// }

// export function Search({ getPathsFromSearch }: SearchProps) {
export function SearchOld() {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const loaded = useRef(false);

  const { updateCoords } = useLocationStore();

  // use loader lib instead ?? https://github.com/googlemaps/js-api-loader
  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_GOOGLE_GEO_KEY
        }&libraries=places`,
        document.querySelector('head'),
        'google-maps'
      );
    }

    loaded.current = true;
  }

  // TODO: create/use custom hook instead ?? outdated approach ?? could use useDebounced hook from submissions project
  const fetch = useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: google.maps.places.AutocompletePrediction[]) => void
        ) => {
          (autocompleteService.current as any).getPlacePredictions(request, callback);
        },
        400
      ),
    []
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google)
      autocompleteService.current = new window.window.google.maps.places.AutocompleteService();

    if (!autocompleteService.current) return undefined;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: google.maps.places.AutocompletePrediction[]) => {
      if (active) {
        let newOptions: any[] = []; // TODO: type

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const handleSelected = (_: SyntheticEvent, newValue: any, reason: AutocompleteChangeReason) => {
    // console.log('new on change value - search option selected: ', newValue);
    setOptions(newValue ? [newValue, ...options] : options);
    setValue(newValue);

    if (reason !== 'selectOption') return;

    if (!geocodeService.current && window.google && newValue.place_id)
      geocodeService.current = new window.window.google.maps.Geocoder();

    if (!geocodeService.current) return undefined;

    geocodeService.current.geocode(
      { placeId: newValue.place_id },
      (
        response: google.maps.GeocoderResult[],
        geocoderStatus: google.maps.places.PlacesServiceStatus.OK
      ) => {
        // google.maps.GeocoderStatus
        // console.log('google geocoder response', response);
        if (geocoderStatus === google.maps.places.PlacesServiceStatus.OK) {
          updateCoords({
            longitude: response[0].geometry.location.lng(),
            latitude: response[0].geometry.location.lat(),
          });
          // getPathsFromSearch(
          //   {
          // longitude: response[0].geometry.location.lng(),
          // latitude: response[0].geometry.location.lat(),
          //   }
          //   // newValue.structured_formatting.main_text || newValue.description
          // );
        } else {
          toast.error('Error fetching coordinates');
        }
      }
    );
  };

  return (
    <Autocomplete
      id='google-map-demo'
      // style={{ width: 250 }}
      // className={classes.search}
      sx={{
        position: 'absolute',
        left: (theme) => theme.spacing(2),
        top: (theme) => theme.spacing(2),
        zIndex: 10,
        width: 276,
      }}
      size='small'
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
      filterOptions={(x) => x}
      options={options}
      autoHighlight={true}
      autoComplete={true}
      blurOnSelect={true} // 'touch'
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={handleSelected}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Search'
          variant='outlined'
          fullWidth
          margin='none'
          color='primary'
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 1,
          }}
        />
      )}
      renderOption={(props, option) => {
        let x = option as google.maps.places.AutocompletePrediction;
        let opt = x.structured_formatting as google.maps.places.StructuredFormatting;
        const matches = opt.main_text_matched_substrings;
        const parts = parse(
          opt.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        );

        return (
          <li {...props}>
            <Grid container alignItems='center' wrap='nowrap'>
              <Grid item>
                <LocationOnRounded sx={{ color: 'text.secondary', mr: 2 }} />
              </Grid>
              <Grid item xs zeroMinWidth>
                <Box
                  component='div'
                  overflow='hidden'
                  textOverflow='ellipsis'
                  whiteSpace='nowrap'
                  fontSize='body1.fontSize'
                >
                  {parts.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                      {part.text}
                    </span>
                  ))}
                </Box>

                <Typography variant='body2' color='textSecondary' noWrap>
                  {opt.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
