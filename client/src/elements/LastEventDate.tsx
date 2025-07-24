import { Typography, TypographyProps } from '@mui/material';
import { useLastEventDate } from 'hooks';

type LastEventDateProps = TypographyProps;

export const LastEventDate = (props: LastEventDateProps) => {
  const { data } = useLastEventDate();

  let d = data?.iso_time ? new Date(data?.iso_time) : null;
  let date = d?.toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
  }); // .toDateString();

  if (!date) return null;

  return (
    <Typography variant='body2' color='text.secondary' {...props}>
      {`data updated: ${date}`}
    </Typography>
  );
};
