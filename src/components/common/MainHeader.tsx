import React, { useEffect } from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga';

export const MainHeader: React.FC = () => {

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            ReactGA.initialize(process.env.REACT_APP_GA_TRACKID || '');
            ReactGA.pageview(window.location.pathname);
        }
    }, []);

    return (
        <AppBar position='static'>
            <Toolbar>
                <Link to="/" style={{color: '#ffffff', textDecoration: 'none', fontWeight: 'bold'}}>!toohaK</Link>
            </Toolbar>
        </AppBar>
    );
};
