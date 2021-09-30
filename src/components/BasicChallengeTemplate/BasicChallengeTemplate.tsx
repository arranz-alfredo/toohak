import React, { useEffect, useState } from 'react';
import { Card, Fab, Grid, Icon, makeStyles } from '@material-ui/core';
import { ChallengeOptions, Challenge } from 'types';
import { ComponentMode, Language } from 'enums';
import { ChallengeQuestion, Countdown } from 'components';

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
        backgroundColor: '#f0f0f0'
    },
    titleContainer: {
        height: '20%'
    },
    centralSmallContainer: {
        height: '50%'
    },
    centralFullContainer: {
        height: '80%'
    },
    bottomContainer: {
        height: '30%',
        paddingTop: '10px'
    },
    centerAll: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

interface BasicChallengeTemplateProps {
    mode: ComponentMode,
    challenge: Challenge,
    options?: ChallengeOptions,
    onChallengeChange?: (updatedChallenge: Challenge) => void,
    stopTime?: boolean,
    onTimeUp?: () => void,
    showCheck?: boolean,
    disabledCheck?: boolean,
    onCheckClick?: () => void,
    centralComponent?: React.ReactChild | React.ReactChild[],
    bottomComponent?: React.ReactChild | React.ReactChild[]
}

export const BasicChallengeTemplate: React.FC<BasicChallengeTemplateProps> = (props: BasicChallengeTemplateProps) => {
    const {
        mode, challenge, options, onChallengeChange,
        stopTime, onTimeUp, showCheck, disabledCheck, onCheckClick,
        centralComponent, bottomComponent
    } = props;

    const [answered, setAnswered] = useState<boolean>(false);
    const [stopTimer, setStopTimer] = useState<boolean>(false);

    const classes = useStyles();

    useEffect(() => {
        if (stopTime) {
            setStopTimer(true);
        }
    }, [stopTime]);

    const handleTitleChange = (newTitle: string) => {
        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                question: newTitle
            });
        }
    };

    const handlerTimeUp = () => {
        if (onTimeUp) {
            onTimeUp();
        }
    };

    const handleCheckClick = () => {
        setAnswered(true);
        if (onCheckClick) {
            onCheckClick();
        }
    };

    return (
        <Card variant='outlined' className={classes.root}>
            <div className={classes.titleContainer}>
                <ChallengeQuestion
                    mode={mode}
                    question={challenge.question}
                    fontSize={challenge.config.questionFontSize}
                    onChange={handleTitleChange}
                />
            </div>
            <div className={bottomComponent ? classes.centralSmallContainer : classes.centralFullContainer}>
                <Grid container justify='center' style={{ height: '100%' }}>
                    <Grid item xs={2} style={{ height: '100%' }}>
                        {
                            options != null && !options.ignoreTimeLimit && (
                                <Countdown
                                    mode={mode}
                                    time={challenge.config.timeLimit}
                                    stopTimer={stopTimer}
                                    onTimeUp={handlerTimeUp}
                                />
                            )
                        }
                    </Grid>
                    <Grid item xs={8} style={{ height: '100%' }}>
                        { centralComponent }
                    </Grid>
                    <Grid item xs={2} style={{ height: '100%' }} className={classes.centerAll}>
                        {
                            showCheck && (
                                <Fab
                                    variant="extended"
                                    size="large"
                                    color="primary"
                                    disabled={answered || disabledCheck}
                                    onClick={() => { handleCheckClick(); }}
                                >
                                    <Icon>check</Icon>&nbsp;{options?.language === Language.En ? 'Check' : 'Corregir'}
                                </Fab>
                            )
                        }
                    </Grid>
                </Grid>
            </div>
            {
                bottomComponent && (
                    <div className={classes.bottomContainer}>
                        { bottomComponent }
                    </div>
                )
            }
        </Card>
    );
};
