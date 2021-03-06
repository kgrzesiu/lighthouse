import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { common } from '@material-ui/core/colors';


const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1,
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  orange: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
  },
}));

interface ITopbar {
  className?: string,
  onSidebarOpen?: any,
  onSignout?: any
}

const Topbar = (props: ITopbar) => {
  const { className, onSidebarOpen, onSignout, ...rest } = props;

  const classes = useStyles();

  const [notifications] = useState([]);

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <Hidden lgUp>
          <IconButton
              color="inherit"
              onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Avatar src="/images/lighthouse3.png" className={clsx(classes.large, classes.orange)} variant='circle' />
        <Typography variant="h6" className={classes.title}>
          &nbsp; Lighthouse - Управление производством
        </Typography>
        <div className={classes.flexGrow} />

          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={onSignout}
          >
            <InputIcon />
          </IconButton>
        

      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
