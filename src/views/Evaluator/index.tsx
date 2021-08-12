import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router";
import { Fab, Grid, Icon, makeStyles } from '@material-ui/core';
import { useProjects } from 'hooks/useProjects';
import { Challenge, Project, Test, TestOptions } from 'types';
import { Language } from 'enums';
import { ChallengeEvaluator, ChallengeLauncher, TestResult } from 'components';
import { parseQueryString } from 'utils';

const useStyles = makeStyles(() => ({
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
    const history = useHistory();

    const { projects } = useProjects();
    const [testOptions] = useState<TestOptions>(parseQueryString(history.location.search));
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
                    if (testOptions.disorderedChallenges) {
                        const disorderedChallenges = theTest.challenges.map(
                            (aChallenge: Challenge) => ({ ...aChallenge })
                        ).sort((a, b) => 0.5 - Math.random());
                        setTest({
                            ...theTest,
                            challenges: disorderedChallenges
                        });
                    } else {
                        setTest(theTest);
                    }
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

    const handleBackHome = () => {
        history.push('/');
    };

    const handleRepeatTest = () => {
        setCurrentChallengeState({idx: 0, launching: true});
        setResults([]);
        setShowResult(false);
    };

    return (
        <Grid
            container
            justify="center"
            className={classes.fullHeight}
        >
            {
                !testOptions.autoNext ? <Grid item xs={1} xl={2} /> : undefined
            }
            <Grid item xs={testOptions.autoNext ? 12 : 10} xl={8} className={classes.fullHeight}>
                {
                    test != null && currentChallengeState.launching && currentChallengeState.idx >= 0 && (
                        <ChallengeLauncher
                            challengeType={test.challenges[currentChallengeState.idx].type}
                            challengeNumber={currentChallengeState.idx + 1}
                            challengeTotalCount={test.challenges.length}
                            language={test.language}
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
                                language: test.language,
                                ignoreTimeLimit: testOptions.ignoreTimeLimit
                            }}
                            onSuccess={() => { handleResponse(true); }}
                            onError={() => { handleResponse(false); }}
                        />
                    )
                }
                {
                    test != null && showResult && (
                        <TestResult
                            test={test}
                            results={results}
                            onBackHome={handleBackHome}
                            onRepeatTest={handleRepeatTest}
                        />
                    )
                }
            </Grid>
            {
                !testOptions.autoNext ? (
                    <Grid item xs={1} xl={2} className={`${classes.fullHeight} ${classes.centerAll}`}>
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
                                    {test?.language === Language.En ? 'Next' : 'Siguiente'}&nbsp;<Icon>navigate_next</Icon>
                                </Fab>
                            )
                        }
                    </Grid>
                ) : undefined
            }
        </Grid>
    );
};
