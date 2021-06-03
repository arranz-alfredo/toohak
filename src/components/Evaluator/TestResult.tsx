import React from 'react';
import { Button, Grid, Icon, makeStyles, Typography } from '@material-ui/core';
import { Test } from 'types';
import { Language } from 'enums';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        border: 'solid 1px'
    },
    timeline: {
        transform: 'rotate(-90deg)'
    },
    timelineContentContainer: {
        textAlign: 'left',
        padding: '0px'
    },
    timelineContent: {
        transform: 'rotate(90deg)',
        padding: '0px 5px'
    },
    timelineIcon: {
        transform: 'rotate(90deg)'
    }
}));

interface TestResultProps {
    test: Test,
    results: boolean[],
    onBackHome: () => void,
    onRepeatTest: () => void
}

export const TestResult: React.FC<TestResultProps> = (props: TestResultProps) => {
    const { test, results, onBackHome, onRepeatTest } = props;

    const classes = useStyles();

    return (
        <Grid container
            direction="column"
            className={classes.root}
            justify="center"
            alignItems="center"
            spacing={4}
        >
            <Grid item>
                <Typography variant="h2">
                    {test.name}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="h3">
                    {test.description}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="h4">
                    {
                        `${test.language === Language.En ? 'Correct answers' : 'Respuestas correctas'}: ${results.filter((aResult: boolean) => aResult).length}/${results.length}`
                    }
                </Typography>
            </Grid>
            <Grid item container justify="center" alignItems="center" spacing={4}>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={onBackHome}>
                        <Icon>navigate_before</Icon>
                        &nbsp;
                        { test.language === Language.En ? 'Go back to home' : 'Volver a la pantalla principal' }
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={onRepeatTest}>
                        <Icon>replay</Icon>
                        &nbsp;
                        { test.language === Language.En ? 'repeat test' : 'Repetir cuestionario' }
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};
