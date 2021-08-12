import React, { useState } from 'react';
import { Grid, Icon, IconButton, makeStyles, TextField, Typography } from '@material-ui/core';
import { FillGapsChallengeExpression, FillGapsChallengeSentence } from 'types';
import { ComponentMode, FillMethod } from 'enums';
import { DropGap } from 'components';
import { checkEqual, joinSentence, splitSentence } from 'utils';
import { colors } from 'theme';

const useStyles = makeStyles((theme) => ({
    word: {
        padding: '2px',
    },
    selectableWord: {
        padding: '2px',
        // backgroundColor: '#f0f0f0',
        '& :hover': {
            backgroundColor: theme.palette.primary.light,
            color:'#ffffff',
            cursor: 'pointer',
            borderRadius: '10px'
        }
    },
    selected: {
        backgroundColor: theme.palette.primary.main,
        borderRadius: '10px',
        color:'#ffffff',
    }
}));

interface SentencePart {
    type: 'text' | 'hidden',
    hiddenIdx: number,
    value: string,
    answer: string
}

export interface FillGapsSentenceAnswer {
    hiddenIdx: number,
    value: string
}

const sentenceParts = (sentence: FillGapsChallengeSentence): SentencePart[] => {
    const result: SentencePart[] = [];
    let currentIdx = 0;
    const words = splitSentence(sentence.text);
    sentence.hiddenExpressions.forEach((anExp: FillGapsChallengeExpression, idx: number) => {
        if (anExp.initPosition > currentIdx) {
            result.push({
                type: 'text',
                hiddenIdx: -1,
                value: joinSentence(words.slice(currentIdx, anExp.initPosition)),
                answer: ''
            });
        }
        result.push({
            type: 'hidden',
            hiddenIdx: idx,
            value: joinSentence(words.slice(anExp.initPosition, anExp.initPosition + anExp.wordCount)),
            answer: ''
        });
        currentIdx = anExp.initPosition + anExp.wordCount;
    });
    if (currentIdx < words.length - 1) {
        result.push({
            type: 'text',
            hiddenIdx: -1,
            value: joinSentence(words.slice(currentIdx)),
            answer: ''
        });
    }
    return result;
};

interface FillGapsSentenceProps {
    mode: ComponentMode,
    sentence: FillGapsChallengeSentence,
    fillMethod: FillMethod,
    checkCapitalLetters: boolean,
    checkAccentMarks: boolean,
    showResults: boolean,
    fontSize: number,
    onSentenceChange: (newSentence: FillGapsChallengeSentence) => void,
    onSentenceRemove: () => void,
    onAnswersChange: (answers: FillGapsSentenceAnswer[]) => void
}

export const FillGapsSentence: React.FC<FillGapsSentenceProps> = (props: FillGapsSentenceProps) => {
    const {mode,
        sentence,
        fillMethod,
        checkCapitalLetters,
        checkAccentMarks,
        showResults,
        fontSize,
        onSentenceChange,
        onSentenceRemove,
        onAnswersChange
    } = props;

    const [parts, setParts] = useState<SentencePart[]>(sentenceParts(sentence));

    const classes = useStyles();

    const handleWordClick = (wordIdx: number) => {
        let updatedHiddenExpressions: FillGapsChallengeExpression[] = [];

        if (sentence.hiddenExpressions.length === 0) {
            //Primera expresion
            console.log('');
            updatedHiddenExpressions.push({
                initPosition: wordIdx,
                wordCount: 1,
                alternatives: []
            });
        }

        sentence.hiddenExpressions.some((anExp: FillGapsChallengeExpression, idx: number) => {
            let completeArrayFrom = -1;
            if (idx === 0 && wordIdx < anExp.initPosition - 1) {
                //Antes de la primera expresion y no contigua
                // console.log('Antes de la primera expresion y no contigua');
                updatedHiddenExpressions = [
                    { initPosition: wordIdx, wordCount: 1, alternatives:[] },
                    ...sentence.hiddenExpressions
                ];
                return true;
            } else if (wordIdx === anExp.initPosition - 1) {
                //Contigua a la expresion por delante
                // console.log('Contigua a la expresion por delante');
                updatedHiddenExpressions.push(
                    { initPosition: wordIdx, wordCount: anExp.wordCount + 1, alternatives: [...anExp.alternatives] }
                );
                completeArrayFrom = idx;
            } else if (wordIdx === anExp.initPosition) {
                //Sobre la primera palabra de la expresion
                // console.log('Sobre la primera palabra de la expresion');
                if (anExp.wordCount === 1) {
                    //Si la expresion solo tiene una palabra
                    // console.log('Si la expresion solo tiene una palabra');
                } else {
                    //Si la expresion tiene más de una palabra
                    // console.log('Si la expresion tiene más de una palabra');
                    updatedHiddenExpressions.push(
                        { initPosition: wordIdx + 1, wordCount: anExp.wordCount - 1, alternatives: [...anExp.alternatives] }
                    );
                }
                completeArrayFrom = idx;
            } else if (wordIdx > anExp.initPosition && wordIdx < anExp.initPosition + anExp.wordCount - 1) {
                //Sobre una palabra interior de la expresion
                // console.log('Sobre una palabra interior de la expresion');
                updatedHiddenExpressions = [
                    ...updatedHiddenExpressions,
                    {
                        initPosition: anExp.initPosition,
                        wordCount: wordIdx - anExp.initPosition,
                        alternatives: []
                    },
                    {
                        initPosition: wordIdx + 1,
                        wordCount: anExp.initPosition + anExp.wordCount - wordIdx - 1,
                        alternatives: []
                    }
                ];
                completeArrayFrom = idx;
            } else if (wordIdx === anExp.initPosition + anExp.wordCount - 1) {
                //Sobre la ultima palabra de la expresion
                // console.log('Sobre la ultima palabra de la expresion');
                if (anExp.wordCount === 1) {
                    //Si la expresion solo tiene una palabra
                    // console.log('Si la expresion solo tiene una palabra');
                } else {
                    //Si la expresion tiene más de una palabra
                    // console.log('Si la expresion tiene más de una palabra');
                    updatedHiddenExpressions.push(
                        {
                            initPosition: anExp.initPosition,
                            wordCount: anExp.wordCount - 1,
                            alternatives: [...anExp.alternatives]
                        }
                    );
                }
                completeArrayFrom = idx;
            } else if (idx < sentence.hiddenExpressions.length - 1
                && wordIdx > anExp.initPosition + anExp.wordCount
                && wordIdx < sentence.hiddenExpressions[idx + 1].initPosition - 1) {
                //Entre dos expresiones de manera no contigua
                // console.log('Entre dos expresiones de manera no contigua');
                updatedHiddenExpressions = [
                    ...updatedHiddenExpressions,
                    {...anExp},
                    { initPosition: wordIdx, wordCount: 1, alternatives: [] }
                ];
                completeArrayFrom = idx;
            } else if (idx < sentence.hiddenExpressions.length - 1
                && wordIdx === anExp.initPosition + anExp.wordCount
                && wordIdx === sentence.hiddenExpressions[idx + 1].initPosition - 1) {
                //Entre dos expresiones de manera contigua a ambas
                // console.log('Entre dos expresiones de manera contigua a ambas');
                updatedHiddenExpressions.push({
                    initPosition: anExp.initPosition,
                    wordCount: anExp.wordCount + sentence.hiddenExpressions[idx + 1].wordCount + 1,
                    alternatives: []
                });
                completeArrayFrom = idx + 1;
            } else if (wordIdx === anExp.initPosition + anExp.wordCount) {
                //Contigua a la expresion por detras
                // console.log('Contigua a la expresion por detras');
                updatedHiddenExpressions.push({
                    initPosition: anExp.initPosition,
                    wordCount: anExp.wordCount + 1,
                    alternatives: [...anExp.alternatives]
                });
                completeArrayFrom = idx;
            } else if (idx === sentence.hiddenExpressions.length - 1) {
                //Despues de la ultima expresion y de manera no contigua
                // console.log('Despues de la ultima expresion y de manera no contigua');
                updatedHiddenExpressions = [
                    ...updatedHiddenExpressions,
                    {...anExp},
                    { initPosition: wordIdx, wordCount: 1, alternatives: [] }
                ];
                return true;
            }

            if (completeArrayFrom !== -1) {
                if (idx < sentence.hiddenExpressions.length - 1) {
                    updatedHiddenExpressions = [
                        ...updatedHiddenExpressions,
                        ...sentence.hiddenExpressions.slice(completeArrayFrom + 1)
                    ];
                }
                return true;
            }

            updatedHiddenExpressions.push({...anExp});
            return false;
        });

        onSentenceChange({
            ...sentence,
            hiddenExpressions: updatedHiddenExpressions
        });
    };

    const handleDeleteClick = () => {
        if (onSentenceRemove) {
            onSentenceRemove();
        }
    };

    const selected = (wordIdx: number) => {
        return sentence.hiddenExpressions.some(
            (anExpression: FillGapsChallengeExpression) => (
                wordIdx >= anExpression.initPosition
                && wordIdx <= anExpression.initPosition + anExpression.wordCount - 1
            )
        );
    };

    const handlePartChange = (partIdx: number, text: string) => {
        const updatedParts = parts.map((aPart: SentencePart, idx: number) => (
            {
                ...aPart,
                answer: idx === partIdx ? text : aPart.answer
            }
        ));
        setParts(updatedParts);
        onAnswersChange(updatedParts.filter(
            (aPart: SentencePart) => aPart.type === 'hidden'
        ).map(
            (aPart: SentencePart) => ({
                hiddenIdx: aPart.hiddenIdx,
                value: aPart.answer
            }))
        );
    };

    const getPartStyle = (validValues: string[], value: string) => showResults ? (
        validValues.some(
            (aValidValue: string) => checkEqual(
                aValidValue,
                value,
                checkCapitalLetters,
                checkAccentMarks
            )
        ) ? { color: '#4caf50' } : { color: '#f44336' }
    ) : {};

    return (
        <Grid container alignItems="center" spacing={1}>
            <Grid item>
                <Icon fontSize="small" color="secondary">navigate_next</Icon>
            </Grid>
            {
                mode === ComponentMode.Design
                && splitSentence(sentence.text).map((aWord: string, idx: number) => (
                    <Grid
                        item
                        key={`word_${idx}`}
                        className={`${classes.selectableWord} ${selected(idx) ? classes.selected : ''}`}
                        onClick={() => { handleWordClick(idx); }}
                    >
                        <Typography style={{fontSize: `${fontSize ? fontSize: 50}px`}}>
                            {aWord}
                        </Typography>
                    </Grid>
                ))
            }
            {
                mode === ComponentMode.Design && (
                    <Grid item>
                        <IconButton size="small" onClick={handleDeleteClick}>
                            <Icon>delete</Icon>
                        </IconButton>
                    </Grid>
                )
            }
            {
                mode === ComponentMode.Play && (
                    parts.map((aPart: SentencePart, idx: number) => (
                        aPart.type === 'text' ? (aPart.value.split(' ').map((aWord: string) => (
                            <Grid
                                item
                                key={`part_${idx}`}
                                className={classes.word}
                            >
                                <Typography style={{fontSize: `${fontSize ? fontSize: 50}px`}}>
                                    {aWord}
                                </Typography>
                            </Grid>
                        ))) : (
                            <Grid
                                item
                                key={`part_${idx}`}
                            >
                                {
                                    fillMethod === FillMethod.Writing ? (
                                        <TextField
                                            key={`input_${idx}`}
                                            value={aPart.answer}
                                            color="primary"
                                            inputProps={{
                                                style: {
                                                    fontSize: `${fontSize ? fontSize : 50}px`,
                                                    textAlign: 'center',
                                                    color: colors.primary.main,
                                                    ...getPartStyle(
                                                        [
                                                            aPart.value,
                                                            ...sentence.hiddenExpressions[aPart.hiddenIdx].alternatives
                                                        ],
                                                        aPart.answer
                                                    )
                                                }
                                            }}
                                            onInput={
                                                (evt: React.FormEvent<HTMLInputElement>) => {
                                                    handlePartChange(idx, (evt.target as any).value);
                                                }
                                            }
                                        />
                                    ) : (
                                        <DropGap
                                            key={`input_${idx}`}
                                            value={aPart.answer}
                                            style={getPartStyle(
                                                [
                                                    aPart.value,
                                                    ...sentence.hiddenExpressions[aPart.hiddenIdx].alternatives
                                                ],
                                                aPart.answer
                                            )}
                                            fontSize={fontSize}
                                            onDrop={(droppedText: string) => {
                                                handlePartChange(idx, droppedText);
                                            }}
                                        />
                                    )
                                }
                            </Grid>
                        )
                    ))
                )
            }
        </Grid>
    );
};
