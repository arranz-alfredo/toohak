import React from 'react';
import { Grid, Icon, makeStyles, Typography } from '@material-ui/core';
import { Test } from '../../types/Test';
import { Timeline, TimelineConnector, TimelineContent, TimelineItem, TimelineSeparator } from '@material-ui/lab';
import { Challenge } from '../../types/Challenge';
import { getChallengeTypeIcon } from '../../utils/utilChallenges';

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
    results: boolean[]
}

export const TestResult: React.FC<TestResultProps> = (props: TestResultProps) => {
    const { test, results } = props;

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
                        `Aciertos: ${results.filter((aResult: boolean) => aResult).length}/${results.length}`
                    }
                </Typography>
            </Grid>
            <Grid item>
                <Timeline className={classes.timeline}>
                    {
                        test.challenges.map((aChallenge: Challenge, challengeIdx: number) => (
                            <TimelineItem>
                                <TimelineSeparator>
                                    {getChallengeTypeIcon(aChallenge.type, 'large', {transform: 'rotate(90deg)'})}
                                    {
                                        challengeIdx < test.challenges.length - 1 && (
                                            <TimelineConnector />
                                        )
                                    }
                                </TimelineSeparator>
                                <TimelineContent className={classes.timelineContentContainer}>
                                    <Icon className={classes.timelineContent} fontSize="large" color={results[challengeIdx] ? 'primary' : 'error'}>
                                        { results[challengeIdx] ? 'check_circle' : 'cancel' }
                                    </Icon>
                                </TimelineContent>
                            </TimelineItem>
                        ))
                    }
                </Timeline>
            </Grid>
        </Grid>
    );
};
