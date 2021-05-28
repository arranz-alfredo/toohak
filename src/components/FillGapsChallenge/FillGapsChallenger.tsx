import React, { useEffect, useRef, useState } from 'react';
import { Card, Fab, Grid, Icon, IconButton, makeStyles, TextField } from '@material-ui/core';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useSound from 'use-sound';
import { ChallengeQuestion } from '../common/ChallengeQuestion';
import { FillGapsChallenge, FillGapsChallengeExpression, FillGapsChallengeSentence } from '../../types/FillGapsChallenge';
import { ComponentMode } from '../../enums/ComponentMode';
import { Countdown } from '../common/Countdown';
import correct from '../../assets/sounds/correct.wav';
import incorrect from '../../assets/sounds/incorrect.wav';
import { FillMethod } from '../../enums/FillMethod';
import { FillGapsSentence, FillGapsSentenceAnswer } from './FillGapsSentence';
import { DragableItem } from '../common/DragableItem';
import { joinSentence, splitSentence } from '../../utils/utilStrings';
import { DialogFillGapsCandidates } from './DialogFillGapsCandidates';
import { ChallengeOptions } from '../../types/Challenge';
import { Language } from '../../enums/Language';

const useStyles = makeStyles((theme) => ({
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
    },
}));

const initialFillGapsState = (challenge: FillGapsChallenge): FillGapsSentenceAnswer[][] => {
    return challenge.sentences.map((aSentence: FillGapsChallengeSentence) => ([]));
};

const reorderItems = (sentences: FillGapsChallengeSentence[], mode: ComponentMode): Item[] => {
    let list: Item[] = [];
    sentences.forEach((aSentence: FillGapsChallengeSentence, sentenceIdx: number) => {
        aSentence.hiddenExpressions.forEach((aHiddenExpression: FillGapsChallengeExpression, hiddenExpressionIdx: number) => {
            list.push({
                sentenceText: aSentence.text,
                sentenceIdx,
                hiddenExpression: aHiddenExpression,
                hiddenExpressionIdx
            });
        });
    });
    if (mode === ComponentMode.Play) {
        list = list.sort(() => Math.random() - 0.5);
    }
    return list;
};

interface FillGapsChallengerProps {
    mode: ComponentMode
    challenge: FillGapsChallenge
    options?: ChallengeOptions
    onChallengeChange?: (updatedChallenge: FillGapsChallenge) => void
    onSuccess?: () => void
    onError?: () => void
}

interface Item {
    sentenceText: string,
    sentenceIdx: number,
    hiddenExpression: FillGapsChallengeExpression,
    hiddenExpressionIdx: number
}

export const FillGapsChallenger: React.FC<FillGapsChallengerProps> = (props: FillGapsChallengerProps) => {
    const { mode, challenge, options, onChallengeChange, onSuccess, onError } = props;

    const [stopTimer, setStopTimer] = useState<boolean>(false);
    const [highlightResults, setHighlightResults] = useState<boolean>(false);

    const inputSentence = useRef({} as HTMLInputElement);

    const [fillGapsState, setFillGapsState] = useState<FillGapsSentenceAnswer[][]>(initialFillGapsState(challenge));
    const [openCandidatesDialog, setOpenCandidatesDialog] = useState<boolean>(false);
    const [selectedExpression, setSelectedExpression] = useState<number[]>();
    const [draggableItems, setDragabbleItems] = useState<Item[]>(reorderItems(challenge.sentences, mode));

    const [playCorrect] = useSound(correct);
    const [playIncorrect] = useSound(incorrect);

    const classes = useStyles();

    useEffect(() => {
        setDragabbleItems(reorderItems(challenge.sentences, mode));
    }, [challenge.sentences]);

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

    const handleSentenceChange = (updatedSentence: FillGapsChallengeSentence, sentenceIdx: number) => {
        if (onChallengeChange) {
            const updatedSentences = challenge.sentences.map((
                aSentence: FillGapsChallengeSentence,
                idx: number
            ) => idx === sentenceIdx ? updatedSentence : aSentence);
            onChallengeChange({
                ...challenge,
                sentences: updatedSentences
            });
        }
    };

    const addSentence = () => {
        if (onChallengeChange) {
            const newSentence: FillGapsChallengeSentence = {
                text: inputSentence.current.value,
                hiddenExpressions: [] as FillGapsChallengeExpression[]
            };
            onChallengeChange({
                ...challenge,
                sentences: [...challenge.sentences, newSentence]
            });
            setFillGapsState([
                ...fillGapsState,
                []
            ]);
        }
        inputSentence.current.value = '';
    };

    const handleSentenceKeyPress = (evt: React.KeyboardEvent<HTMLDivElement>) => {
        if (evt.code === 'Enter' && inputSentence.current.value !== '') {
            addSentence();
        }
    };

    const handleSentenceRemove = (sentenceIdx: number) => {
        if (onChallengeChange) {
            const updatedSentences = challenge.sentences
                .filter((aSentence: FillGapsChallengeSentence, idx: number) => idx !== sentenceIdx);
            onChallengeChange({
                ...challenge,
                sentences: updatedSentences
            });
            setFillGapsState(fillGapsState.filter(
                (aFillGapsState: FillGapsSentenceAnswer[], idx: number) => idx !== sentenceIdx
            ));
        }
    };

    const handleAddCandidateClick = (sentenceIdx: number, hiddenExpIdx: number) => {
        setSelectedExpression([sentenceIdx, hiddenExpIdx]);
        setOpenCandidatesDialog(true);
    };

    const handleCandidateAccept = (newCandidates: string[]) => {
        if (onChallengeChange && selectedExpression) {
            const updatedSentences = challenge.sentences.map((
                aSentence: FillGapsChallengeSentence,
                sentenceIdx: number
            ) => sentenceIdx !== selectedExpression[0] ? aSentence : (
                {
                    ...aSentence,
                    hiddenExpressions: aSentence.hiddenExpressions.map((
                        aHiddenExpression: FillGapsChallengeExpression,
                        hiddenExpresionIdx: number
                    ) => hiddenExpresionIdx !== selectedExpression[1] ? aHiddenExpression : (
                        {
                            ...aHiddenExpression,
                            alternatives: [...newCandidates]
                        }
                    ))
                }
            ));
            onChallengeChange({
                ...challenge,
                sentences: updatedSentences
            });
        }
        setOpenCandidatesDialog(false);
    };

    const expressionInSentence = (sentence: string, expression: FillGapsChallengeExpression): string => {
        return joinSentence(
            splitSentence(sentence)
                .slice(expression.initPosition, expression.initPosition + expression.wordCount)
        );
    };

    const handleSentenceAnswer = (sentenceIdx: number, answer: FillGapsSentenceAnswer[]) => {
        console.log(answer);
        const updatedState = fillGapsState.map((aFillGapsState: FillGapsSentenceAnswer[], idx: number) => (
            idx === sentenceIdx ? [...answer] : [...aFillGapsState]
        ));
        setFillGapsState(updatedState);
    };

    const completed = () => {
        return challenge.sentences
            .reduce((acc: boolean, current: FillGapsChallengeSentence, sentenceIdx: number) => (
                acc
                && current.hiddenExpressions.length === fillGapsState[sentenceIdx].length
                && fillGapsState[sentenceIdx].every((el: FillGapsSentenceAnswer) => (
                    el.value != null && el.value !== ''
                ))
            ), true);
    };

    const isDropped = (item: Item): boolean => {
        const text = expressionInSentence(
            item.sentenceText,
            item.hiddenExpression
        );

        return fillGapsState.some((sentencesAnswer: FillGapsSentenceAnswer[]) => (
            sentencesAnswer.some((aSentenceAnswer: FillGapsSentenceAnswer) => (
                aSentenceAnswer.value === text
            ))
        ));
    };

    const handleCheckClick = () => {
        const correct = challenge.sentences.reduce(
            (accSentences: boolean, currentSentence: FillGapsChallengeSentence, sentenceIdx: number) => {
                const words: string[] = splitSentence(currentSentence.text);
                const correctExpressions = currentSentence.hiddenExpressions.reduce(
                    (accExpressions: boolean, currentExpression: FillGapsChallengeExpression, expressionIdx: number) => {
                        const hiddenAnswer = fillGapsState[sentenceIdx]
                            .find((anAnswer: FillGapsSentenceAnswer) => anAnswer.hiddenIdx === expressionIdx);

                        return hiddenAnswer != null && accExpressions && (
                            joinSentence(words.slice(
                                currentExpression.initPosition,
                                currentExpression.initPosition + currentExpression.wordCount
                            )) === hiddenAnswer?.value
                            || currentExpression.alternatives.indexOf(hiddenAnswer.value) >= 0
                        );
                    },
                    true
                );
                return accSentences && correctExpressions;
            },
            true
        );
        showResult(correct);
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
            <div className={classes.answerContainer}>
                <Grid container justify='center' className={classes.fullHeight}>
                    <Grid item xs={2} className={classes.fullHeight}>
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
                    <Grid item xs={8} className={classes.fullHeight}>
                        {
                            selectedExpression && (
                                <DialogFillGapsCandidates
                                    open={openCandidatesDialog}
                                    text={
                                        expressionInSentence(
                                            challenge.sentences[selectedExpression[0]].text,
                                            challenge.sentences[selectedExpression[0]].hiddenExpressions[selectedExpression[1]]
                                        )
                                    }
                                    candidates={
                                        challenge.sentences[selectedExpression[0]]
                                            .hiddenExpressions[selectedExpression[1]].alternatives
                                    }
                                    onAccept={handleCandidateAccept}
                                    onCancel={() => { setOpenCandidatesDialog(false); }}
                                />
                            )
                        }
                        <DndProvider backend={HTML5Backend}>
                            <Grid
                                container
                                spacing={2}
                                direction="column"
                                className={classes.fullHeight}
                            >
                                {
                                    (
                                        mode === ComponentMode.Design ||
                                        challenge.config.fillMethod === FillMethod.Dragging
                                    ) && (
                                        <Grid
                                            item
                                            // xs={12}
                                            className={classes.optionsContainer}
                                        >
                                            <Grid container spacing={2} justify="space-around" alignItems="center">
                                                {
                                                    draggableItems.map((anItem: Item) => !isDropped(anItem) && (
                                                        <Grid item key={`gridItem_${anItem.sentenceIdx}_${anItem.hiddenExpression.initPosition}`}>
                                                            <DragableItem
                                                                name={expressionInSentence(
                                                                    anItem.sentenceText,
                                                                    anItem.hiddenExpression
                                                                )}
                                                                key={`dragable_${anItem.sentenceIdx}_${anItem.hiddenExpression.initPosition}`}
                                                                style={{fontSize: challenge.config.textFontSize}}
                                                                iconButton={
                                                                    mode === ComponentMode.Design ? (
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => {
                                                                                handleAddCandidateClick(
                                                                                    anItem.sentenceIdx,
                                                                                    anItem.hiddenExpressionIdx
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Icon>add_circle</Icon>
                                                                        </IconButton>
                                                                    ) : undefined
                                                                }
                                                            />
                                                        </Grid>
                                                    ))
                                                }
                                            </Grid>
                                        </Grid>
                                    )
                                }
                                <Grid
                                    item
                                    xs
                                >
                                    <Grid container direction="column" justify="space-around" className={`${classes.fullWidth} ${classes.fullHeight}`}>
                                        {
                                            challenge.sentences.map((
                                                aSentence: FillGapsChallengeSentence,
                                                sentenceIdx: number
                                            ) => (
                                                <Grid
                                                    item
                                                    key={`sentence_${sentenceIdx}`}
                                                >
                                                    <FillGapsSentence
                                                        mode={mode}
                                                        sentence={aSentence}
                                                        fillMethod={challenge.config.fillMethod}
                                                        showResults={highlightResults}
                                                        fontSize={challenge.config.textFontSize}
                                                        onSentenceChange={(
                                                            updatedSentence: FillGapsChallengeSentence
                                                        ) => handleSentenceChange(updatedSentence, sentenceIdx)}
                                                        onSentenceRemove={() => { handleSentenceRemove(sentenceIdx); }}
                                                        onAnswersChange={(answer: FillGapsSentenceAnswer[]) => {
                                                            handleSentenceAnswer(sentenceIdx, answer);
                                                        }}
                                                    />
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                </Grid>
                                {
                                    mode === ComponentMode.Design && (
                                        <Grid item>
                                            <TextField
                                                inputRef={inputSentence}
                                                variant="outlined"
                                                style={{width: '100%'}}
                                                InputProps={
                                                    {
                                                        style: {
                                                            fontSize: challenge.config.textFontSize,
                                                            color: '#000000'
                                                        }
                                                    }
                                                }
                                                label="Nueva frase"
                                                onKeyPress={handleSentenceKeyPress}
                                            />
                                        </Grid>
                                    )
                                }
                            </Grid>
                        </DndProvider>
                    </Grid>
                    <Grid item xs={2} style={{ height: '100%' }} className={classes.centerAll}>
                        {
                            <Fab
                                variant="extended"
                                size="large"
                                color="primary"
                                disabled={mode === ComponentMode.Design || !completed()}
                                onClick={() => { handleCheckClick(); }}
                            >
                                <Icon>check</Icon>&nbsp;{options?.language === Language.En ? 'Check' : 'Corregir'}
                            </Fab>
                        }
                    </Grid>
                </Grid>
            </div>
        </Card>
    );
};
