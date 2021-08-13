import React, { useEffect, useState } from 'react';
import { Card, Fab, Grid, Icon, makeStyles } from '@material-ui/core';
import useSound from 'use-sound';
import correct from '../../assets/sounds/correct.wav';
import incorrect from '../../assets/sounds/incorrect.wav';
import { Challenge, ChallengeOptions, TheOddOneChallenge, TheOddOneChallengeSerie } from 'types';
import { ComponentMode, Language } from 'enums';
import { BasicChallengeTemplate, ChallengeQuestion, Countdown, TheOddOneSerie } from 'components';

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
        backgroundColor: '#f0f0f0'
    },
    fullHeight: {
        height: '100%'
    },
    fullWidth: {
        width: '100%'
    },
    titleContainer: {
        height: '20%'
    },
    answerContainer: {
        height: '80%',
        width: '100%'
    },
    centerAll: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    optionsContainer: {
        border: 'solid 1px gray',
        backgroundColor: '#ffffff',
        minHeight: '60px'
    },
    sentencesContainer: {
        paddingLeft: '10px'
    }
}));

interface TheOddOneAnswer {
    serieIndex: number,
    answerIndex: number
}

interface TheOddOneChallengeProps {
    mode: ComponentMode,
    challenge: TheOddOneChallenge,
    options?: ChallengeOptions,
    onChallengeChange?: (updatedChallenge: TheOddOneChallenge) => void,
    onSuccess?: () => void,
    onError?: () => void
}

export const TheOddOneChallenger: React.FC<TheOddOneChallengeProps> = (props: TheOddOneChallengeProps) => {
    const { mode, challenge, options, onChallengeChange, onSuccess, onError } = props;

    const [stopTimer, setStopTimer] = useState<boolean>(false);
    const [highlightResults, setHighlightResults] = useState<boolean>(false);

    const [theOddOneState, setTheOddOneState] = useState<TheOddOneAnswer[]>([]);

    const [playCorrect] = useSound(correct);
    const [playIncorrect] = useSound(incorrect);

    const classes = useStyles();

    const handleChallengeChange = (newChallenge: Challenge) => {
        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                ...(newChallenge as TheOddOneChallenge)
            });
        }
    };

    const handlerTimeUp = () => {
        showResult(false);
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

    const handleSerieChange = (newSerie: TheOddOneChallengeSerie, idxSerie: number) => {
        if (onChallengeChange) {
            const newChallenge: TheOddOneChallenge = {
                ...challenge,
                series: challenge.series.map((aSerie: TheOddOneChallengeSerie, idx: number) => (
                    idxSerie === idx ? { ...newSerie } : { ...aSerie }
                ))
            };
            onChallengeChange(newChallenge);
        }
    };

    const completed = () => theOddOneState.length === challenge.series.length;

    const handleCheckClick = () => {
        const correct = challenge.series.reduce(
            (accSeries: boolean, currentSerie: TheOddOneChallengeSerie, serieIdx: number) => {
                const idxAnswer = theOddOneState.findIndex((anAnswer: TheOddOneAnswer) => (
                    anAnswer.serieIndex === serieIdx
                ));
                return accSeries && theOddOneState[idxAnswer].answerIndex === currentSerie.theOddOneIndex;
            },
            true
        );
        showResult(correct);
    };

    const handleSerieAnswer = (serieIdx: number, selectedIdx: number) => {
        const answerIdx = theOddOneState.findIndex((anAnswer: TheOddOneAnswer) => anAnswer.serieIndex === serieIdx);
        const newState = [...theOddOneState];
        if (answerIdx >= 0) {
            newState.splice(answerIdx, 1, {
                serieIndex: serieIdx,
                answerIndex: selectedIdx
            });
        } else {
            newState.push(
                {
                    serieIndex: serieIdx,
                    answerIndex: selectedIdx
                }
            );
        }
        setTheOddOneState(newState);
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
            disabledCheck={mode === ComponentMode.Design || !completed()}
            onCheckClick={handleCheckClick}
            centralComponent={
                <Grid
                    item xs={12}
                    className={classes.fullHeight}
                    container
                    direction="column"
                    justify="space-evenly"
                >
                    {
                        challenge.series.map((aSerie: TheOddOneChallengeSerie, serieIdx: number) => (
                            <Grid item>
                                <TheOddOneSerie
                                    mode={mode}
                                    serie={aSerie}
                                    showResults={highlightResults}
                                    fontSize={challenge.config.answerFontSize}
                                    onSerieChange={
                                        (updatedSerie: TheOddOneChallengeSerie) => handleSerieChange(updatedSerie, serieIdx)
                                    }
                                    onAnswerChange={(selectedIdx: number) => handleSerieAnswer(serieIdx, selectedIdx)}
                                />
                            </Grid>
                        ))
                    }
                </Grid>
            }
        />
    );
};
