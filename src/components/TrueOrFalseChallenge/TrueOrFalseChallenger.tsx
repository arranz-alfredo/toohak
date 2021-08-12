import React, { useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import useSound from 'use-sound';
import { SelectableOption } from '../Common/SelectableOption';
import { TrueOrFalseChallenge } from '../../types/TrueOrFalseChallenge';
import { ComponentMode } from '../../enums/ComponentMode';

import correct from '../../assets/sounds/correct.wav';
import incorrect from '../../assets/sounds/incorrect.wav';
import { ChallengeOptions, PictureChallenge } from '../../types/Challenge';
import { Language } from '../../enums/Language';
import { PictureChallengeTemplate } from 'components';

const useStyles = makeStyles((theme) => ({
    optionContainer: {
        height: 'calc(100% - 80px)',
        marginTop: '40px'
    }
}));

interface TrueOrFalseChallengerProps {
    mode: ComponentMode,
    challenge: TrueOrFalseChallenge,
    options?: ChallengeOptions,
    onChallengeChange?: (updatedChallenge: TrueOrFalseChallenge) => void,
    onSuccess?: () => void,
    onError?: () => void
}

export const TrueOrFalseChallenger: React.FC<TrueOrFalseChallengerProps> = (props: TrueOrFalseChallengerProps) => {
    const { mode, challenge, options, onChallengeChange, onSuccess, onError } = props;

    const [stopTimer, setStopTimer] = useState<boolean>(false);
    const [highlightResults, setHighlightResults] = useState<boolean>(false);

    const [playCorrect] = useSound(correct);
    const [playIncorrect] = useSound(incorrect);

    const classes = useStyles();

    const handlePictureChallengeChange = (picChallenge: PictureChallenge) => {
        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                ...(picChallenge as TrueOrFalseChallenge)
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
        <PictureChallengeTemplate
            mode={mode}
            challenge={challenge}
            options={options}
            onChallengeChange={handlePictureChallengeChange}
            stopTime={stopTimer}
            onTimeUp={handlerTimeUp}
            showCheck={false}
        >
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
        </PictureChallengeTemplate>
    );
};
