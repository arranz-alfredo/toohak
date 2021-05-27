import React, { Fragment } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

export const MainHeader: React.FC = () => (
    <Fragment>
        <AppBar position='static'>
            <Toolbar>
                <Typography variant='h5'>
                    !toohaK
                </Typography>
            </Toolbar>
        </AppBar>
    </Fragment>
);
