'use client';

import { FC, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { logout } from '@/firebase/utils';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import headerStyles from '../Header/Header.module.css';
import { AUTH_NAV_LINKS, GUEST_NAV_LINKS } from '../Header/constants';
import styles from './LeftMenu.module.css';

export const LeftMenu: FC = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('buttons');
  const { user } = useAuth();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box className={styles.drawer__container} role='presentation' onClick={toggleDrawer(false)}>
      <Typography className={styles.drawer__title} component='h1' variant='subtitle1'>
        REST/GraphiQL Client
      </Typography>
      {user ? (
        <>
          <List>
            {AUTH_NAV_LINKS.map((link) => (
              <Link key={link.key} href={link.href} className={styles.link}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{link.icon}</ListItemIcon>
                    <ListItemText primary={t(link.key)} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding onClick={logout}>
              <ListItemButton>
                <ListItemIcon>{<LogoutIcon color='secondary' />}</ListItemIcon>
                <ListItemText primary={t('sign-out')} />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      ) : (
        <List>
          {GUEST_NAV_LINKS.map((link) => (
            <Link key={link.key} href={link.href} className={styles.link}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={t(link.key)} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <div>
      <IconButton
        onClick={toggleDrawer(true)}
        color='secondary'
        className={headerStyles.menu__button}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};
