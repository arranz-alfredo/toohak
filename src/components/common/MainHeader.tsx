import React, { useEffect } from 'react';
import { AppBar, makeStyles, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga';

const useStyles = makeStyles((theme) => ({
    fullHeight: {
        height: '100%'
    },
    noMinHeight: {
        [theme.breakpoints.down('sm')]: {
            minHeight: '30px'
        }
    }
}));

export const MainHeader: React.FC = () => {
    const classes = useStyles();

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            ReactGA.initialize(process.env.REACT_APP_GA_TRACKID || '');
            ReactGA.pageview(window.location.pathname);
        }
    }, []);

    return (
        <AppBar position='static' className={classes.fullHeight}>
            <Toolbar className={`${classes.fullHeight} ${classes.noMinHeight}`}>
                <Link to="/" style={{color: '#ffffff', textDecoration: 'none', fontWeight: 'bold'}}>!toohaK</Link>
            </Toolbar>
        </AppBar>
    );
};
