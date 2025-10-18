'use client';

import * as React from 'react';
import Link from 'next/link'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { MenuItem } from '@mui/material';

const drawerWidth = 240;

export interface ListItemProps {
  text: string;
  icon?: React.ReactElement;
  href?: string;
} 

export interface ListProps {
  items: ListItemProps[];
} 

interface Props {
  window?: () => Window;
  children: React.ReactNode;
  list: ListProps[];
}

export default function ResponsiveDrawer(props: Props) {
  const { window, children, list } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar/>
      {list.map((ls, index) => (
        <React.Fragment key={index}>
          <Divider/>
          <List>
            {ls.items.map((item, idx) => (
              <Link key={idx} href={item.href ?? "/"} style={{color:'inherit', textDecoration: 'none'}}>
                <ListItem disablePadding>
                  <ListItemButton>
                    {item.icon && (
                      <ListItemIcon>
                        {item.icon}
                      </ListItemIcon>
                    )}
                    <ListItemText primary={item.text}/>
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </React.Fragment>
      ))}
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed' sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` }
      }}>
        <Toolbar>
          <IconButton color='inherit' 
            aria-label='open drawer' 
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }}}
          >
            <MenuItem/>
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dokzly
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer variant='temporary' 
          container={container} 
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none'},
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          slotProps={{
            root: {
              keepMounted: true
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar/>
        {children}
      </Box>
    </Box>
  )
}