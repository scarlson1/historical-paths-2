import { Box, useTheme } from '@mui/material';
import { DeckGL, DeckGLProps, LayersList, PickingInfo } from 'deck.gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReactNode } from 'react';
import Map from 'react-map-gl';

import { MAPBOX_DARK, MAPBOX_LIGHT, MapTooltip } from 'components';
// import { useWidth } from 'hooks';
import { DEFAULT_INITIAL_VIEW_STATE, MAPBOX_TOKEN } from './constants';

// TODO: pass HoverInfo as child ?? needs to be direct descendant of DeckGl ??

// ONLY SUPPLY ONE OF viewState or initialViewState
// should be discriminating union ??

export interface DeckMapProps extends Partial<DeckGLProps> {
  // mapViewState?: MapViewState;
  layers?: LayersList | undefined;
  hoverInfo?: PickingInfo | null | undefined;
  renderTooltipContent?: (info: PickingInfo) => ReactNode;
  children?: ReactNode;
}

export const DeckMap = ({
  initialViewState = DEFAULT_INITIAL_VIEW_STATE, // TODO: remove default if using viewState (don't pass both)
  // mapViewState = DEFAULT_INITIAL_VIEW_STATE,
  layers,
  hoverInfo,
  renderTooltipContent,
  children,
  ...rest
}: DeckMapProps) => {
  const theme = useTheme();
  // const { isMobile } = useWidth();

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
        width='100%'
        height='100%'
        style={{ position: 'relative' }}
        // eventRecognizerOptions={
        //   isMobile
        //     ? {
        //         pan: { threshold: 10 },
        //         tap: { threshold: 5 },
        //       }
        //     : {}
        // }
        {...rest}
      >
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          // mapStyle='mapbox://styles/mapbox/light-v11'
          mapStyle={theme.palette.mode === 'light' ? MAPBOX_LIGHT : MAPBOX_DARK}
          styleDiffing
          // minZoom={3}
          // maxZoom={20}
          // maxPitch={85}
          // react-map-gl bug - uses globe view instead of defaulting to mercator
          style={{ width: '100%', height: '100%' }}
          projection={{ name: 'mercator' }}
        >
          {children}
        </Map>
        <MapTooltip pickingInfo={hoverInfo} renderTooltipContent={renderTooltipContent} />
      </DeckGL>
    </Box>
  );
};
