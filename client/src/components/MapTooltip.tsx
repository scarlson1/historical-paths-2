import { Box, Typography } from '@mui/material';
import type { PickingInfo } from 'deck.gl';
import type { ReactNode } from 'react';

interface HoverInfoProps {
  pickingInfo?: PickingInfo | null | undefined;
  renderTooltipContent?: (info: PickingInfo) => ReactNode;
  children?: ReactNode;
}

export function MapTooltip({ pickingInfo, renderTooltipContent, children }: HoverInfoProps) {
  if (!(pickingInfo && pickingInfo.object)) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 2000,
        pointerEvents: 'none',
        left: pickingInfo.x,
        top: pickingInfo.y,
        backgroundColor: 'background.paper',
        px: 2,
        py: 1.5,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Typography variant='body2' component='div'>
        {renderTooltipContent
          ? renderTooltipContent(pickingInfo)
          : pickingInfo.object.properties?.NAME || ''}
      </Typography>
      {children}
    </Box>
  );
}
