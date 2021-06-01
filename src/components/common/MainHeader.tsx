import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom';

export const MainHeader: React.FC = () => (
    <AppBar position='static'>
        <Toolbar>
            <Link to="/" style={{color: '#ffffff', textDecoration: 'none', fontWeight: 'bold'}}>!toohaK</Link>
        </Toolbar>
    </AppBar>
);
