import React, { useState } from 'react';
import { Card, Grid, makeStyles } from '@material-ui/core';
import useSound from 'use-sound';
import { ChallengeQuestion } from '../common/ChallengeQuestion';
import { SelectableOption } from '../common/SelectableOption';
import { TrueOrFalseChallenge } from '../../types/TrueOrFalseChallenge';
import { PictureGrid } from '../common/PictureGrid';
import { ComponentMode } from '../../enums/ComponentMode';
import { Countdown } from '../common/Countdown';

import correct from '../../assets/sounds/correct.wav';
import incorrect from '../../assets/sounds/incorrect.wav';
import { ChallengeOptions, ChallengePicture } from '../../types/Challenge';
import { Language } from '../../enums/Language';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        backgroundColor: '#f0f0f0'
    },
    titleContainer: {
        height: '20%'
    },
    pictureContainer: {
        height: '60%'
    },
    answerContainer: {
        height: '20%',
        paddingTop: '10px'
    },
    optionContainer: {
        height: '100%'
    },
    centerAll: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

interface TrueOrFalseChallengerProps {
    mode: ComponentMode
    challenge: TrueOrFalseChallenge
    options?: ChallengeOptions
    onChallengeChange?: (updatedChallenge: TrueOrFalseChallenge) => void
    onSuccess?: () => void
    onError?: () => void
}

export const TrueOrFalseChallenger: React.FC<TrueOrFalseChallengerProps> = (props: TrueOrFalseChallengerProps) => {
    const { mode, challenge, options, onChallengeChange, onSuccess, onError } = props;

    const [stopTimer, setStopTimer] = useState<boolean>(false);
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

    const handleAnswerChange = (updatedAnswer: boolean) => {
        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                answer: updatedAnswer
            });
        }
    };

    const handlerTimeUp = () => {
        showResult(false);
    };

    const handlerOptionClick = (answer: boolean) => {
        if (mode === ComponentMode.Play) {
            if (challenge.answer === answer) {
                showResult(true);
            } else {
                showResult(false);
            }
        }
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
                        <PictureGrid
                            mode={mode}
                            pictures={challenge.pictures}
                            onPicturesChange={handlePicturesChange}
                        />
                    </Grid>
                    <Grid item xs={2} style={{ height: '100%' }} className={classes.centerAll} />
                </Grid>
            </div>
            <div className={classes.answerContainer}>
                <Grid container justify='space-evenly' spacing={2} style={{ height: '100%' }}>
                    <Grid item xs={5} className={classes.optionContainer}>
                        <SelectableOption
                            mode={mode}
                            text={options?.language === Language.En ? 'True' : 'Verdadero'}
                            icon="wb_sunny"
                            valid={challenge.answer}
                            color='#4caf50'
                            fontSize={42}
                            showResults={highlightResults}
                            onValidChange={(valid: boolean) => {
                                handleAnswerChange(true);
                            }}
                            onClick={() => { handlerOptionClick(true); }}
                        />
                    </Grid>
                    <Grid item xs={5} className={classes.optionContainer}>
                        <SelectableOption
                            mode={mode}
                            text={options?.language === Language.En ? 'False' : 'Falso'}
                            icon="brightness_2"
                            valid={!challenge.answer}
                            color='#f44336'
                            fontSize={42}
                            showResults={highlightResults}
                            onValidChange={(valid: boolean) => {
                                handleAnswerChange(false);
                            }}
                            onClick={() => { handlerOptionClick(false); }}
                        />
                    </Grid>
                </Grid>
            </div>
        </Card>
    );
};
