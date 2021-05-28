import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { Fab, Grid, Icon, makeStyles } from '@material-ui/core';
import { Test, TestOptions } from '../../types/Test';
import { useProjects } from '../../hooks/useProjects';
import { Project } from '../../types/Project';
import { ChallengeEvaluator } from '../../components/Evaluator/ChallengeEvaluator';
import { ChallengeLauncher } from '../../components/Evaluator/ChallengeLauncher';
import { TestResult } from '../../components/Evaluator/TestResult';
import { useLocation } from 'react-router-dom';
import { parseQueryString } from '../../utils/utilStrings';

const useStyles = makeStyles((theme) => ({
    fullHeight: {
        height: '100%'
    },
    centerAll: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

interface IParams {
    projectId: string,
    testId: string
}

interface ChallengeState {
    idx: number,
    launching: boolean
}

export const Evaluator: React.FC = () => {
    const { projectId, testId } = useParams() as IParams;
    const loc = useLocation();

    const { projects } = useProjects();
    const [testOptions] = useState<TestOptions>(parseQueryString(loc.search));
    const [test, setTest] = useState<Test>();
    const [currentChallengeState, setCurrentChallengeState] = useState<ChallengeState>({idx: -1, launching: false});
    const [results, setResults] = useState<boolean[]>([]);
    const [showResult, setShowResult] = useState<boolean>(false);

    const classes = useStyles();

    useEffect(() => {
        if (projectId != null && testId != null) {
            const theProject: Project = projects.find((aProject: Project) => aProject.id === projectId);
            if (theProject != null) {
                const theTest: Test | undefined = theProject.tests.find((aTest: Test) => aTest.id === testId);
                if (theTest != null) {
                    setTest(theTest);
                    setCurrentChallengeState({idx: 0, launching: true});
                }
            }
        }
    }, [projectId, testId]);

    const next = () => {
        if (test != null) {
            if (currentChallengeState.launching) {
                setCurrentChallengeState({
                    ...currentChallengeState,
                    launching: false
                });
            } else {
                if (currentChallengeState.idx < test.challenges.length - 1) {
                    setCurrentChallengeState({
                        idx: currentChallengeState.idx + 1,
                        launching: true
                    });
                } else {
                    setCurrentChallengeState({
                        idx: -1,
                        launching: false
                    });
                    setShowResult(true);
                }
            }
        }
    };

    const handleResponse = (success: boolean) => {
        setResults([...results, success]);
        if (testOptions.autoNext) {
            next();
        }
    };

    return (
        <Grid
            container
            justify="center"
            className={classes.fullHeight}
        >
            <Grid item xs={2}></Grid>
            <Grid item xs={8} className={classes.fullHeight}>
                {
                    test != null && currentChallengeState.launching && currentChallengeState.idx >= 0 && (
                        <ChallengeLauncher
                            challengeType={test.challenges[currentChallengeState.idx].type}
                            delay={3}
                            onEnd={next}
                        />
                    )
                }
                {
                    test != null && !currentChallengeState.launching && currentChallengeState.idx >= 0 && (
                        <ChallengeEvaluator
                            challenge={test.challenges[currentChallengeState.idx]}
                            options={{
                                ignoreTimeLimit: testOptions.ignoreTimeLimit
                            }}
                            onSuccess={() => { handleResponse(true); }}
                            onError={() => { handleResponse(false); }}
                        />
                    )
                }
                {
                    test != null && showResult && (
                        <TestResult test={test} results={results} />
                    )
                }
            </Grid>
            <Grid item xs={2} className={`${classes.fullHeight} ${classes.centerAll}`}>
                {
                    !testOptions.autoNext
                    && currentChallengeState.idx === results.length - 1
                    && (
                        <Fab
                            variant="extended"
                            size="large"
                            color="primary"
                            onClick={next}
                        >
                            Siguiente&nbsp;<Icon>navigate_next</Icon>
                        </Fab>
                    )
                }
            </Grid>
        </Grid>
    );
};
