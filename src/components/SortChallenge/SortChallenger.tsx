import React, { useState } from 'react';
import { Card, Fab, Grid, Icon, makeStyles } from '@material-ui/core';
import useSound from 'use-sound';
import correct from '../../assets/sounds/correct.wav';
import incorrect from '../../assets/sounds/incorrect.wav';
import { Challenge, ChallengeOptions, SortChallenge } from 'types';
import { ComponentMode, ElementDirection } from 'enums';
import { BasicChallengeTemplate, ChallengeQuestion, Countdown } from 'components';

const useStyles = makeStyles((theme) => ({
    fullHeight: {
        height: '100%'
    },
    item: {
        padding: '5px 10px',
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: '20px'
    }
}));

interface SortChallengerProps {
    mode: ComponentMode,
    challenge: SortChallenge,
    options?: ChallengeOptions,
    onChallengeChange?: (updatedChallenge: SortChallenge) => void,
    onSuccess?: () => void,
    onError?: () => void
}

export const SortChallenger: React.FC<SortChallengerProps> = (props: SortChallengerProps) => {
    const { mode, challenge, options, onChallengeChange, onSuccess, onError } = props;

    const [stopTimer, setStopTimer] = useState<boolean>(false);
    const [selectedAnswers /* , setSelectedAnswers */] = useState<number[]>([]);
    const [highlightResults, setHighlightResults] = useState<boolean>(false);

    const [playCorrect] = useSound(correct);
    const [playIncorrect] = useSound(incorrect);

    const classes = useStyles();

    const handleChallengeChange = (newChallenge: Challenge) => {
        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                ...(newChallenge as SortChallenge)
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
        <BasicChallengeTemplate
            mode={mode}
            challenge={challenge}
            options={options}
            onChallengeChange={handleChallengeChange}
            stopTime={stopTimer}
            onTimeUp={handlerTimeUp}
            showCheck={true}
            disabledCheck={mode === ComponentMode.Design}
            onCheckClick={handleCheckClick}
            centralComponent={
                <Grid
                    container
                    direction={challenge.config.elementsDirection === ElementDirection.Horizontal ? 'row' : 'column'}
                    justify="space-evenly"
                    alignItems="center"
                    className={classes.fullHeight}
                >
                    {
                        challenge.items.map((anItem: string) => (
                            <Grid item className={classes.item}>
                                {'anItem'}
                            </Grid>
                        ))
                    }
                </Grid>
            }
        />
    );
};
