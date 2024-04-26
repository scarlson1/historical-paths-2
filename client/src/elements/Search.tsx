import { Loader } from '@googlemaps/js-api-loader';
import { LocationOnRounded } from '@mui/icons-material';
import {
  Autocomplete,
  AutocompleteChangeReason,
  Box,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import parse from 'autosuggest-highlight/parse';
import { SyntheticEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useLocationStore } from 'context';
import { useDebounce } from 'hooks';
import { createResource } from 'utils';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_GEO_KEY,
});

// options?: google.maps.places.AutocompleteOptions
function loadAutocomplete() {
  return loader.importLibrary('places').then((places) => new places.AutocompleteService());
}

function loadGeocode() {
  return loader.importLibrary('geocoding').then((res) => new res.Geocoder());
}

let autocompleteResource = createResource(loadAutocomplete());
let geocodeResource = createResource(loadGeocode());

export function Search() {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<google.maps.places.AutocompletePrediction[]>([]);

  const autocompleteService = autocompleteResource.read();
  const geocodeService = geocodeResource.read();
  const { updateCoords } = useLocationStore();

  const debouncedVal = useDebounce(inputValue);

  useEffect(() => {
    let active = true;
    // using debounce hook will cause the delay in when this effect runs
    // as opposed to debounce() function delays when the api is called
    // which is preferred ??
    if (debouncedVal === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    autocompleteService.getPlacePredictions(
      { input: debouncedVal },
      (results?: google.maps.places.AutocompletePrediction[] | null) => {
        if (active) {
          let newOptions: any[] = []; // TODO: type

          if (value) newOptions = [value];

          if (results) newOptions = [...newOptions, ...results];

          setOptions(newOptions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [value, debouncedVal, fetch]);

  // const fetch = useMemo(
  //   () =>
  //     debounce(
  //       (
  //         request: { input: string },
  //         callback: (results?: google.maps.places.AutocompletePrediction[] | null) => void
  //       ) => {
  //         // (autocompleteService.current as any).getPlacePredictions(request, callback);
  //         console.log('fetch');
  //         autocompleteService.getPlacePredictions(request, callback);
  //       },
  //       400
  //     ),
  //   []
  // );

  // const fetch = useMemo(
  //   () =>
  //     debounce(
  //       (
  //         request: { input: string },
  //         callback: (results?: google.maps.places.AutocompletePrediction[] | null) => void
  //       ) => {
  //         // (autocompleteService.current as any).getPlacePredictions(request, callback);
  //         console.log('fetch');
  //         autocompleteService.getPlacePredictions(request, callback);
  //       },
  //       400
  //     ),
  //   []
  // );

  // useEffect(() => {
  //   let active = true;

  //   if (inputValue === '') {
  //     setOptions(value ? [value] : []);
  //     return undefined;
  //   }

  //   fetch({ input: inputValue }, (results?: google.maps.places.AutocompletePrediction[] | null) => {
  //     if (active) {
  //       let newOptions: any[] = [];

  //       if (value)
  //         newOptions = [value];

  //       if (results)
  //         newOptions = [...newOptions, ...results];

  //       setOptions(newOptions);
  //     }
  //   });

  //   return () => {
  //     active = false;
  //   };
  // }, [value, inputValue, fetch]);

  const handleSelected = (_: SyntheticEvent, newValue: any, reason: AutocompleteChangeReason) => {
    setOptions(newValue ? [newValue, ...options] : options);
    setValue(newValue);

    if (reason !== 'selectOption') return;

    geocodeService.geocode(
      { placeId: newValue.place_id },
      (
        response: google.maps.GeocoderResult[] | null,
        geocoderStatus: google.maps.GeocoderStatus
      ) => {
        if (geocoderStatus === 'OK' && response?.length) {
          updateCoords({
            longitude: response[0].geometry.location.lng(),
            latitude: response[0].geometry.location.lat(),
          });
        } else {
          toast.error('Error fetching coordinates');
        }
      }
    );
  };

  return (
    <Autocomplete
      id='google-autocomplete'
      sx={{
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
          // color='primary'
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
