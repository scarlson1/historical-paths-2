import { DataFilterExtension } from '@deck.gl/extensions';
import { GpsFixedRounded } from '@mui/icons-material';
import { Box, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import type {
  PathLayerProps,
  PickingInfo,
  Position,
  ScatterplotLayerProps,
} from 'deck.gl';
import { FlyToInterpolator, PathLayer, ScatterplotLayer } from 'deck.gl';
import { capitalize } from 'lodash';
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Marker } from 'react-map-gl';

import { DeckMap } from 'components';
import { DEFAULT_INITIAL_VIEW_STATE } from 'components/constants';
import type { DeckMapProps } from 'components/DeckMap';
import { useFilterStore, useLocationStore } from 'context';
import { Controls, EventsSummary, Search } from 'elements';
import { useAsyncToast, usePaths } from 'hooks';
import type { Coordinates, InitialEvent, TrackDataPoint } from 'types';
import type { ProxyCircle } from 'utils';

// separate components (Map) - pass layers as prop, marker as child ??
// use action/reducer/context to manage layer state (or zustand) ??
// store state in url (summary, location coords, etc.)

// react-query --> set global variables in url and set react query keys from url values ?? update coords in url params
// router pre-fetching: https://tanstack.com/query/latest/docs/framework/react/guides/prefetching#router-integration

// if using multiple map layers --> use context/zustand to manage state (enabled layers, etc.)
// enable visibility of layers and RQ hooks from context ??

const pathsProps: Partial<PathLayerProps> = {
  pickable: true,
  // autoHighlight: true,
  // highlightColor: [255, 101, 80, 200],
  highlightColor: [33, 150, 243, 200],
  rounded: true,
  widthScale: 20,
  widthMinPixels: 2,
  positionFormat: `XY`,
  getPath: (d: any) => d.path,
  getWidth: () => 8,
};

const markersProps: Partial<ScatterplotLayerProps> = {
  pickable: true,
  autoHighlight: true,
  stroked: true,
  filled: true,
  radiusUnits: 'pixels',
  radiusMinPixels: 1,
  radiusMaxPixels: 35,
  lineWidthMinPixels: 1,
  // onHover: (info) => setHoverInfo(info),
  getPosition: (d: any) => d.coordinates,
  // getRadius: (d) => (Math.sign(d.cat) === -1 ? 2 : d.cat + 3),
  getRadius: (d: any) => (Math.sign(d.category) === -1 ? 2 : d.category + 3),
  getFillColor: (d: any) => {
    switch (d.category) {
      case 1:
        return [90, 175, 250, 200];
      case 2:
        return [66, 165, 245, 200];
      case 3:
        return [33, 150, 243, 200];
      case 4:
        return [30, 136, 229, 200];
      case 5:
        return [25, 118, 210, 200];
      default:
        return [90, 175, 250, 200];
    }
  },
  getLineColor: (d: any) => {
    switch (d.category) {
      case 1:
        return [90, 175, 250, 200];
      case 2:
        return [66, 165, 245, 200];
      case 3:
        return [33, 150, 243, 200];
      case 4:
        return [30, 136, 229, 200];
      case 5:
        return [25, 118, 210, 200];
      default:
        return [90, 175, 250, 200];
    }
  },
};

const proxyCircleProps: Partial<ScatterplotLayerProps<ProxyCircle>> = {
  // pickable: true,
  // autoHighlight: true,
  // highlightColor: [0, 0, 0, 10],
  stroked: true,
  filled: true,
  radiusUnits: 'meters',
  lineWidthMinPixels: 1,
  // onHover: (info) => info.name,
  getPosition: (d) => d.coordinates as Position,
  getRadius: (d) => d.miles * 1609.34,
  getFillColor: () => [245, 0, 87, 30],
  getLineColor: () => [245, 0, 87, 30],
  // getTooltip: ({ object }) =>
  //   object && {
  //     html: `<h2>${object.details}</h2><div>${object.name}</div>`,
  //     style: {
  //       // backgroundColor: '#000',
  //       fontSize: '0.8em',
  //     },
  //   },
};

interface MapProps extends DeckMapProps {
  handleClick?: (pickingInfo: PickingInfo, event: any) => void;
}

export const Map = ({ children, ...props }: MapProps) => {
  const { palette } = useTheme();
  const mapLoaded = useRef<boolean>(false);
  const [initialViewState, setInitialViewState] = useState(
    DEFAULT_INITIAL_VIEW_STATE,
  );
  const [hoverInfo, setHoverInfo] = useState<PickingInfo>();
  const [clickCount, setClickCount] = useState(0);
  const toast = useAsyncToast({ position: 'top-center' });

  const {
    coordinates: coords,
    updateCoords,
    proxyCircles,
    highlightedIndex,
    markerMode,
    setHighlightedIndex,
  } = useLocationStore();

  const yearRange = useFilterStore((state) => state.yearRange);

  const { data } = usePaths();

  useEffect(() => {
    // need to compare to previous ??
    if (coords) flyTo(coords);
  }, [coords]);

  const handleClick = (info: PickingInfo) => {
    const { coordinate, x, y } = info;
    if (!coordinate || x < 75 || y < 75) return;

    if (markerMode) {
      updateCoords({ latitude: coordinate[1], longitude: coordinate[0] });
    } else if (clickCount % 3 === 0) {
      toast.info('use control in bottom corner to set a new location.', {
        id: 'marker-mode-info',
      });
    }
    setClickCount(clickCount + 1);
  };

  const flyTo = useCallback(({ latitude, longitude }: Coordinates) => {
    setInitialViewState({
      longitude,
      latitude,
      zoom: 6,
      // pitch: 0,
      // bearing: 0,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }, []);

  const markerArr = useMemo(
    () => data?.events.map(({ track }) => track).flat(),
    [data],
  );

  const layers = [
    new ScatterplotLayer({
      id: 'proxy-circles-layer',
      data: proxyCircles,
      // visible: !markerMode,
      visible: !!coords,
      ...proxyCircleProps,
      pickable: true,
      onHover: (info) => {
        setHoverInfo(info);
      },
    }),
    new PathLayer({
      id: 'paths-layer',
      data: data?.events || [],
      getColor: palette.mode === 'dark' ? [180, 180, 180, 255] : [0, 0, 0, 255],
      highlightedObjectIndex: highlightedIndex,
      // @ts-expect-error deckGL bug ??
      onHover: (info) => {
        setHoverInfo(info);
        setHighlightedIndex(info.index);
      },
      // getColor: // could color based on category
      updateTriggers: {
        getColor: palette.mode,
      },
      ...pathsProps,
      getFilterValue: (f: InitialEvent) => f.year, // f.properties.timeOfDay, // in seconds
      // getFilterValue: (f: InitialEvent) => {
      //   // console.log('getFilterValue: ', f);
      //   return typeof f.year === 'string' ? parseInt(f.year) : f.year;
      // }, // f.properties.timeOfDay, // in seconds
      filterRange: yearRange, // [43200, 46800], // 12:00 - 13:00
      extensions: [new DataFilterExtension({ filterSize: 1 })],
    }),
    new ScatterplotLayer({
      id: 'markers-layer',
      data: markerArr,
      ...markersProps,
      onHover: (info) => {
        setHoverInfo(info);
      },
      getFilterValue: (f: TrackDataPoint) => f.year,
      filterRange: yearRange, // [43200, 46800], // 12:00 - 13:00 (time of day example)
      extensions: [new DataFilterExtension({ filterSize: 1 })],
    }),
  ];

  const getTooltip = useCallback(
    ({ object }: PickingInfo<TrackDataPoint & { details?: string }>) => {
      if (!object?.name) return null;

      return (
        <Box sx={{ maxWidth: 280, whiteSpace: 'normal' }}>
          <Stack direction='column' spacing={0.5}>
            <Stack
              direction='row'
              spacing={1}
              sx={{ justifyContent: 'space-between', minWidth: 0 }}
            >
              {object.year ? (
                <Typography
                  variant='body2'
                  color='textSecondary'
                  fontSize='0.775rem'
                >
                  {object.year}
                </Typography>
              ) : null}
              {object.category ? (
                <Typography
                  variant='body2'
                  color='textSecondary'
                  fontSize='0.775rem'
                >
                  {object.category}
                </Typography>
              ) : null}
              {object.details ? (
                <Typography
                  variant='body2'
                  color='textSecondary'
                  fontSize='0.775rem'
                  sx={{ minWidth: 0, flex: '1 1 auto' }}
                >
                  {object.details}
                </Typography>
              ) : null}
            </Stack>
            <Typography>{capitalize(object.name)}</Typography>
          </Stack>
        </Box>
      );
    },
    [],
  );

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        p: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 },
        m: 0,
        '& .mapboxgl-ctrl': {
          backgroundColor: 'hsla(0,0%,100%,.1)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: (theme) => theme.spacing(2),
          top: (theme) => theme.spacing(3),
          zIndex: 10,
        }}
      >
        <ErrorBoundary fallback={<div>something went wrong</div>}>
          <Suspense
            fallback={<Skeleton variant='rounded' width={276} height={40} />}
          >
            <Search />
          </Suspense>
        </ErrorBoundary>
      </Box>

      <EventsSummary hasLocation={!!coords} />

      <Box sx={{ position: 'absolute', right: 8, bottom: 24, zIndex: 10 }}>
        <Controls />
      </Box>

      <DeckMap
        initialViewState={initialViewState}
        {...props}
        onClick={handleClick}
        layers={layers}
        getCursor={() => (markerMode && mapLoaded ? 'crosshair' : 'grab')}
        // getCursor={() => (mapLoaded.current ? 'crosshair' : 'grab')}
        onLoad={() => (mapLoaded.current = true)}
        onError={console.error}
        hoverInfo={hoverInfo}
        renderTooltipContent={getTooltip}
      >
        {children}
        {coords && (
          <Marker
            latitude={coords.latitude}
            longitude={coords.longitude}
            anchor='center'
            style={{ height: '24px', width: '24px' }}
          >
            <GpsFixedRounded color='primary' />
          </Marker>
        )}
      </DeckMap>
    </Box>
  );
};
