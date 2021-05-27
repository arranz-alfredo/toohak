import React from 'react';
import { useParams } from "react-router";
import { Grid, makeStyles } from '@material-ui/core';
import { TestDesigner } from '../../components/Designer/TestDesigner';

const useStyles = makeStyles((theme) => ({
    fullHeight: {
        height: '100%'
    }
}));

export const Designer = () => {
    const { projectId, testId } = useParams() as any;

    const classes = useStyles();

    return (
        <Grid
            container
            justify="center"
            className={classes.fullHeight}
        >
            <Grid item xs={12} className={classes.fullHeight}>
                <TestDesigner
                    projectId={projectId}
                    testId={testId}
                />
            </Grid>
        </Grid>
    );
};
