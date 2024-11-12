import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Copyright() {
  return (
    <Typography
      variant="body2"
      align="center"
      sx={{
        color: 'text.secondary',
        mb: 2,
      }}
    >
      {'Copyright ©'}&nbsp;
      <MuiLink color="inherit" href="https://mui.com/">
        floga.io
      </MuiLink>&nbsp;
      {new Date().getFullYear()}.
    </Typography>
  );
}