import React from 'react';
import { Box } from '@mui/material';

const Logo = ({ width = 210, height = 70 }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <svg width={width} height={height} viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
        {/* Circle outline */}
        <circle cx="70" cy="70" r="48" fill="none" stroke="#4DB6E2" strokeWidth="8"/>

        {/* Heart */}
        <path
          d="M70 52
             C62 38 40 38 40 55
             C40 72 58 86 70 96
             C82 86 100 72 100 55
             C100 38 78 38 70 52Z"
          fill="#F6C453"/>

        {/* ECG line */}
        <path
          d="M30 70
             H48
             L56 64
             L64 78
             L74 58
             L84 70
             H110"
          fill="none"
          stroke="#4DB6E2"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"/>

        {/* Text */}
        <text x="140" y="82"
              fontFamily="Inter, system-ui, sans-serif"
              fontSize="42"
              fontWeight="600"
              fill="#4DB6E2">
          BlueVitals
        </text>
      </svg>
    </Box>
  );
};

export default Logo;