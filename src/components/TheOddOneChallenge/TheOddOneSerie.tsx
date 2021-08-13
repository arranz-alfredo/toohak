import React, { useState } from 'react';
import { Grid, makeStyles, Radio, TextField, Typography } from '@material-ui/core';
import { TheOddOneChallengeSerie } from 'types';
import { ComponentMode } from 'enums';

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        backgroundColor: '#ffffff',
        padding: '5px'
    },
    selectableAnswer: {
        cursor: 'pointer',
        borderRadius: '10px',
        padding: '2px',
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color:'#ffffff'
        }
    },
    selectedAnswer: {
        backgroundColor: theme.palette.primary.main,
        color:'#ffffff'
    },
    correct: {
        backgroundColor: '#4caf50',
        color:'#ffffff'
    },
    error: {
        backgroundColor: '#f44336',
        color:'#ffffff'
    }
}));

interface TheOddOneSerieProps {
    mode: ComponentMode,
    serie: TheOddOneChallengeSerie,
    showResults: boolean,
    fontSize: number,
    onSerieChange: (newSerie: TheOddOneChallengeSerie) => void,
    onAnswerChange: (selectedIdx: number) => void
}

export const TheOddOneSerie: React.FC<TheOddOneSerieProps> = (props: TheOddOneSerieProps) => {
    const { mode, serie, showResults, fontSize, onSerieChange, onAnswerChange } = props;

    const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);

    const classes = useStyles();

    const handleSelectedChange = (selIdx: number) => {
        if (onSerieChange) {
            onSerieChange({
                ...serie,
                theOddOneIndex: selIdx
            });
        }
    };

    const handleTextChange = (elementIdx: number, newText: string) => {
        if (onSerieChange) {
            const auxElements = [...serie.elements];
            auxElements.splice(elementIdx, 1, newText);
            onSerieChange({
                ...serie,
                elements: auxElements
            });
        }
    };

    const handleAnswerChange = (answerIdx: number) => {
        if (onAnswerChange && mode === ComponentMode.Play) {
            setSelectedAnswer(answerIdx);
            onAnswerChange(answerIdx);
        }
    };

    const getElementStyle = (elementIdx: number) => {
        if (elementIdx === selectedAnswer) {
            if (showResults) {
                return elementIdx === serie.theOddOneIndex ? classes.correct : classes.error;
            } else {
                return classes.selectedAnswer;
            }
        }
        return '';
    };

    return (
        <Grid container justify="space-evenly" alignItems="center" className={classes.mainContainer}>
            {
                serie.elements.map((anElement: string, elementIdx: number) => (
                    <>
                        <Grid
                            item
                            key={`element_${elementIdx}`}
                            onClick={() => handleAnswerChange(elementIdx)}
                        >
                            {
                                mode === ComponentMode.Design ? (
                                    <>
                                        <Radio
                                            value={elementIdx}
                                            checked={serie.theOddOneIndex === elementIdx}
                                            name="radio-button-demo"
                                            onChange={() => handleSelectedChange(elementIdx)}
                                        />
                                        <TextField
                                            value={anElement}
                                            inputProps={{
                                                style: {
                                                    fontSize: `${fontSize ? fontSize : 50}px`
                                                }
                                            }}
                                            onInput={
                                                (event: React.FormEvent<HTMLInputElement>) => handleTextChange(
                                                    elementIdx,
                                                    (event.target as any).value
                                                )
                                            }
                                        />
                                    </>
                                ) : (
                                    <Typography
                                        style={{
                                            fontSize: `${fontSize ? fontSize: 50}px`
                                        }}
                                        className={
                                            `${classes.selectableAnswer} ${getElementStyle(elementIdx)}`
                                        }
                                    >
                                        {anElement}
                                    </Typography>
                                )
                            }
                        </Grid>
                        {
                            elementIdx < serie.elements.length - 1 && (
                                <Grid
                                    item
                                    key={`separator_${elementIdx}`}
                                >
                                    -
                                </Grid>
                            )
                        }
                    </>
                ))
            }
        </Grid>
    );
};
