import { DarkModeRounded, LightModeRounded } from '@mui/icons-material';
import { Box, Button, ButtonProps, useColorScheme } from '@mui/material';

// type ThemeButtonProps = Omit<IconButtonProps, 'onClick'>;

// const ThemeButtonComponent = (props: ThemeButtonProps) => {
//   const { mode, setMode } = useColorScheme();

//   return (
//     <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} {...props}>
//       {mode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}
//     </IconButton>
//   );
// };

type ThemeButtonProps = Omit<ButtonProps, 'onClick'>;

const ThemeButtonComponent = (props: ThemeButtonProps) => {
  const { mode, setMode } = useColorScheme();

  return (
    <Button
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      variant='contained'
      color='inherit'
      {...props}
      sx={{
        mx: 1,
        maxHeight: 30,
        minWidth: 34,
        maxWidth: 40,
        m: 0.5,
        color: 'primary.main',
        ...(props?.sx || {}),
      }}
    >
      {mode === 'dark' ? (
        <LightModeRounded fontSize='small' />
      ) : (
        <DarkModeRounded fontSize='small' />
      )}
    </Button>
  );
};

export const ThemeButton = (props: ThemeButtonProps) => {
  return (
    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
      <ThemeButtonComponent {...props} />
    </Box>
  );
};
