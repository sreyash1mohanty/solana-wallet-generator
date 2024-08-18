import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'black', height:'2rem'}}>
        <Toolbar variant="dense">
          <Typography variant="h4" color="inherit" component="div">
            WALLSOL
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

