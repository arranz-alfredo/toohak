import React, { useState } from 'react';
import { Card, Fab, Grid, Icon, makeStyles } from '@material-ui/core';
import useSound from 'use-sound';
import { ChallengeQuestion } from '../common/ChallengeQuestion';
import { SortChallenge } from '../../types/SortChallenge';
import { ComponentMode } from '../../enums/ComponentMode';
import { Countdown } from '../common/Countdown';

import correct from '../../assets/sounds/correct.wav';
import incorrect from '../../assets/sounds/incorrect.wav';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        backgroundColor: '#f0f0f0'
    },
    fullHeight: {
        height: '100%'
    },
    titleContainer: {
        height: '20%'
    },
    pictureContainer: {
        height: '80%'
    },
    centerAll: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    optionsContainer: {
        height: '20%',
        border: 'solid 1px'
    },
    item: {
        padding: '5px 10px',
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: '20px'
    },
    groupsContainer: {
        height: '80%'
    },
}));

interface SortChallengerProps {
    mode: ComponentMode
    challenge: SortChallenge
    onChallengeChange?: (updatedChallenge: SortChallenge) => void
    onSuccess?: () => void
    onError?: () => void
}

export const SortChallenger: React.FC<SortChallengerProps> = (props: SortChallengerProps) => {
    const { mode, challenge, onChallengeChange, onSuccess, onError } = props;

    const [stopTimer, setStopTimer] = useState<boolean>(false);
    const [selectedAnswers /* , setSelectedAnswers */] = useState<number[]>([]);
    const [highlightResults, setHighlightResults] = useState<boolean>(false);

    const [playCorrect] = useSound(correct);
    const [playIncorrect] = useSound(incorrect);

    const classes = useStyles();

    const handleTitleChange = (newTitle: string) => {
        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                question: newTitle
            });
        }
    };

    const handlerTimeUp = () => {
        showResult(false);
    };

    const handleCheckClick = () => {
    //     const wrongsSelected = selectedAnswers
    //         .map((anAnswerIdx: number) => challenge.answers[anAnswerIdx])
    //         .filter((anAnswer: SelectAnswerChallengeAnswer) => !anAnswer.valid);
    //     if (wrongsSelected.length === 0) {
    //         const validsNotSelected = challenge.answers
    //             .filter((anAnswer: SelectAnswerChallengeAnswer, answerIdx: number) =>
    //                 anAnswer.valid && selectedAnswers.indexOf(answerIdx) === -1
    //             );
    //         if (validsNotSelected.length === 0) {
    //             showResult(true);
    //             return;
    //         }
    //     }
    //     showResult(false);
    };

    const showResult = (success: boolean) => {
        setStopTimer(true);
        setHighlightResults(true);

        if (success) {
            playCorrect();
        } else {
            playIncorrect();
        }

        setTimeout(() => {
            if (success) {
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                if (onError) {
                    onError();
                }
            }
        }, 2000);
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
            <div className={classes.pictureContainer}>
                <Grid container justify='center' className={classes.fullHeight}>
                    <Grid item xs={2} className={classes.fullHeight}>
                        <Countdown
                            mode={mode}
                            time={challenge.config.timeLimit}
                            stopTimer={stopTimer}
                            onTimeUp={handlerTimeUp}
                        />
                    </Grid>
                    <Grid item xs={8} className={classes.fullHeight}>
                    </Grid>
                    <Grid item xs={2} style={{ height: '100%' }} className={classes.centerAll}>
                        {
                            <Fab
                                variant="extended"
                                size="large"
                                color="primary"
                                disabled={mode === ComponentMode.Design || selectedAnswers.length === 0}
                                onClick={() => { handleCheckClick(); }}
                            >
                                <Icon>check</Icon>&nbsp;Corregir
                            </Fab>
                        }
                    </Grid>
                </Grid>
            </div>
        </Card>
    );
};
