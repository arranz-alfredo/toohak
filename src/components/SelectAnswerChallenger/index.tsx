import React, { useState } from 'react';
import { Card, Fab, Grid, Icon, makeStyles } from '@material-ui/core';
import useSound from 'use-sound';
import { ChallengeQuestion } from '../ChallengeQuestion';
import { SelectableOption } from '../SelectableOption';
import { SelectAnswerChallenge, SelectAnswerChallengeAnswer } from '../../types/SelectAnswerChallenge';
import { PictureGrid } from '../PictureGrid';
import { ComponentMode } from '../../enums/ComponentMode';
import { Countdown } from '../Countdown';

import correct from '../../assets/sounds/correct.wav';
import incorrect from '../../assets/sounds/incorrect.wav';
import { ChallengePicture } from '../../types/Challenge';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        backgroundColor: '#f0f0f0'
    },
    titleContainer: {
        height: '20%'
    },
    pictureContainer: {
        height: '50%'
    },
    answerContainer: {
        height: '30%',
        paddingTop: '10px'
    },
    optionContainer: {
        height: '50%'
    },
    centerAll: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

interface SelectAnswerChallengerProps {
    mode: ComponentMode
    challenge: SelectAnswerChallenge
    onChallengeChange?: (updatedChallenge: SelectAnswerChallenge) => void
    onSuccess?: () => void
    onError?: () => void
}

export const SelectAnswerChallenger: React.FC<SelectAnswerChallengerProps> = (props: SelectAnswerChallengerProps) => {
    const { mode, challenge, onChallengeChange, onSuccess, onError } = props;

    const [stopTimer, setStopTimer] = useState<boolean>(false);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
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

    const handlePicturesChange = (newPictures: ChallengePicture[]) => {
        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                pictures: [...newPictures]
            });
        }
    };

    const handleAnswerChange = (position: number, updatedAnswer: SelectAnswerChallengeAnswer) => {
        const updatedAnswers = challenge.answers.map((anAnswer: SelectAnswerChallengeAnswer, idx: number) => {
            if (idx !== position) {
                if (!challenge.config.multiselect) {
                    return {
                        ...anAnswer,
                        valid: false
                    };
                }
                return { ...anAnswer };
            }
            return { ...updatedAnswer };
        });

        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                answers: updatedAnswers
            });
        }
    };

    const handlerTimeUp = () => {
        showResult(false);
    };

    const handlerOptionClick = (answerIdx: number) => {
        if (mode === ComponentMode.Play) {
            if (challenge.config.multiselect) {
                const theIndex = selectedAnswers.findIndex((anAnswerIdx: number) => anAnswerIdx === answerIdx);
                if (theIndex === -1) {
                    setSelectedAnswers([...selectedAnswers, answerIdx]);
                } else {
                    setSelectedAnswers(selectedAnswers.filter((anAnswerIdx: number) => anAnswerIdx !== answerIdx));
                }
            } else {
                if (challenge.answers[answerIdx].valid) {
                    showResult(true);
                } else {
                    showResult(false);
                }
            }
        }
    };

    const handleCheckClick = () => {
        const wrongsSelected = selectedAnswers
            .map((anAnswerIdx: number) => challenge.answers[anAnswerIdx])
            .filter((anAnswer: SelectAnswerChallengeAnswer) => !anAnswer.valid);
        if (wrongsSelected.length === 0) {
            const validsNotSelected = challenge.answers
                .filter((anAnswer: SelectAnswerChallengeAnswer, answerIdx: number) =>
                    anAnswer.valid && selectedAnswers.indexOf(answerIdx) === -1
                );
            if (validsNotSelected.length === 0) {
                showResult(true);
                return;
            }
        }
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
                <Grid container justify='center' style={{ height: '100%' }}>
                    <Grid item xs={2} style={{ height: '100%' }}>
                        <Countdown
                            mode={mode}
                            time={challenge.config.timeLimit}
                            stopTimer={stopTimer}
                            onTimeUp={handlerTimeUp}
                        />
                    </Grid>
                    <Grid item xs={8} style={{ height: '100%' }}>
                        <PictureGrid
                            mode={mode}
                            pictures={challenge.pictures}
                            onPicturesChange={handlePicturesChange}
                        />
                    </Grid>
                    <Grid item xs={2} style={{ height: '100%' }} className={classes.centerAll}>
                        {
                            challenge.config.multiselect && (
                                <Fab
                                    variant="extended"
                                    size="large"
                                    color="primary"
                                    disabled={mode === ComponentMode.Design || selectedAnswers.length === 0}
                                    onClick={() => { handleCheckClick(); }}
                                >
                                    <Icon>check</Icon>&nbsp;Corregir
                                </Fab>
                            )
                        }
                    </Grid>
                </Grid>
            </div>
            <div className={classes.answerContainer}>
                <Grid container justify='space-evenly' spacing={2} style={{ height: '100%' }}>
                    <Grid item xs={5} className={classes.optionContainer}>
                        <SelectableOption
                            mode={mode}
                            text={challenge.answers[0].text}
                            icon="wb_sunny"
                            valid={challenge.answers[0].valid}
                            selected={
                                mode === ComponentMode.Play
                                && selectedAnswers.indexOf(0) >= 0
                            }
                            color='#f44336'
                            fontSize={challenge.config.answerFontSize}
                            multiselect={challenge.config.multiselect}
                            showResults={highlightResults}
                            onTextChange={(newText: string) => {
                                handleAnswerChange(0, { ...challenge.answers[0], text: newText });
                            }}
                            onValidChange={(valid: boolean) => {
                                handleAnswerChange(0, { ...challenge.answers[0], valid });
                            }}
                            onClick={() => { handlerOptionClick(0); }}
                        />
                    </Grid>
                    <Grid item xs={5} className={classes.optionContainer}>
                        <SelectableOption
                            mode={mode}
                            text={challenge.answers[1].text}
                            icon="brightness_2"
                            valid={challenge.answers[1].valid}
                            selected={
                                mode === ComponentMode.Play
                                && selectedAnswers.indexOf(1) >= 0
                            }
                            color='#03a9f4'
                            fontSize={challenge.config.answerFontSize}
                            multiselect={challenge.config.multiselect}
                            showResults={highlightResults}
                            onTextChange={(newText: string) => {
                                handleAnswerChange(1, { ...challenge.answers[1], text: newText });
                            }}
                            onValidChange={(valid: boolean) => {
                                handleAnswerChange(1, { ...challenge.answers[1], valid });
                            }}
                            onClick={() => { handlerOptionClick(1); }}
                        />
                    </Grid>
                    <Grid item xs={5} className={classes.optionContainer}>
                        <SelectableOption
                            mode={mode}
                            text={challenge.answers[2].text}
                            icon="flash_on"
                            valid={challenge.answers[2].valid}
                            selected={
                                mode === ComponentMode.Play
                                && selectedAnswers.indexOf(2) >= 0
                            }
                            color='#ffc107'
                            fontSize={challenge.config.answerFontSize}
                            multiselect={challenge.config.multiselect}
                            showResults={highlightResults}
                            onTextChange={(newText: string) => {
                                handleAnswerChange(2, { ...challenge.answers[2], text: newText });
                            }}
                            onValidChange={(valid: boolean) => {
                                handleAnswerChange(2, { ...challenge.answers[2], valid });
                            }}
                            onClick={() => { handlerOptionClick(2); }}
                        />
                    </Grid>
                    <Grid item xs={5} className={classes.optionContainer}>
                        <SelectableOption
                            mode={mode}
                            text={challenge.answers[3].text}
                            icon="cloud"
                            valid={challenge.answers[3].valid}
                            selected={
                                mode === ComponentMode.Play
                                && selectedAnswers.indexOf(3) >= 0
                            }
                            color='#4caf50'
                            fontSize={challenge.config.answerFontSize}
                            multiselect={challenge.config.multiselect}
                            showResults={highlightResults}
                            onTextChange={(newText: string) => {
                                handleAnswerChange(3, { ...challenge.answers[3], text: newText });
                            }}
                            onValidChange={(valid: boolean) => {
                                handleAnswerChange(3, { ...challenge.answers[3], valid });
                            }}
                            onClick={() => { handlerOptionClick(3); }}
                        />
                    </Grid>
                </Grid>
            </div>
        </Card>
    );
};
