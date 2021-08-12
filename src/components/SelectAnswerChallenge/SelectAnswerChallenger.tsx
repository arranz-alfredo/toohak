import React, { useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import useSound from 'use-sound';
import correct from '../../assets/sounds/correct.wav';
import incorrect from '../../assets/sounds/incorrect.wav';
import { ChallengeOptions, PictureChallenge, SelectAnswerChallenge, SelectAnswerChallengeAnswer } from 'types';
import { ComponentMode } from 'enums';
import { SelectableOption } from 'components';
import { PictureChallengeTemplate } from 'components/PictureChallengeTemplate';

const useStyles = makeStyles(() => ({
    optionContainer: {
        height: '50%'
    }
}));

interface SelectAnswerChallengerProps {
    mode: ComponentMode,
    challenge: SelectAnswerChallenge,
    options?: ChallengeOptions,
    onChallengeChange?: (updatedChallenge: SelectAnswerChallenge) => void,
    onSuccess?: () => void,
    onError?: () => void
}

export const SelectAnswerChallenger: React.FC<SelectAnswerChallengerProps> = (props: SelectAnswerChallengerProps) => {
    const { mode, challenge, options, onChallengeChange, onSuccess, onError } = props;

    const [stopTimer, setStopTimer] = useState<boolean>(false);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [highlightResults, setHighlightResults] = useState<boolean>(false);

    const [playCorrect] = useSound(correct);
    const [playIncorrect] = useSound(incorrect);

    const classes = useStyles();

    const handlePictureChallengeChange = (picChallenge: PictureChallenge) => {
        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                ...(picChallenge as SelectAnswerChallenge)
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
        <PictureChallengeTemplate
            mode={mode}
            challenge={challenge}
            options={options}
            onChallengeChange={handlePictureChallengeChange}
            stopTime={stopTimer}
            onTimeUp={handlerTimeUp}
            showCheck={challenge.config.multiselect}
            disabledCheck={mode === ComponentMode.Design || selectedAnswers.length === 0}
            onCheckClick={handleCheckClick}
        >
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
        </PictureChallengeTemplate>
    );
};
