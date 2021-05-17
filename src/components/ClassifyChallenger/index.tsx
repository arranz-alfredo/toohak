import React, { useState } from 'react';
import { Card, Fab, Grid, Icon, makeStyles } from '@material-ui/core';
import useSound from 'use-sound';
import { ChallengeQuestion } from '../ChallengeQuestion';
import { ClassifyChallenge, ClassifyChallengeGroup } from '../../types/ClassifyChallenge';
import { ComponentMode } from '../../enums/ComponentMode';
import { Countdown } from '../Countdown';

import correct from '../../assets/sounds/correct.wav';
import incorrect from '../../assets/sounds/incorrect.wav';
import { DropGroup } from '../DropGroup';

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

interface ClassifyChallengerProps {
    mode: ComponentMode
    challenge: ClassifyChallenge
    onChallengeChange?: (updatedChallenge: ClassifyChallenge) => void
    onSuccess?: () => void
    onError?: () => void
}

export const ClassifyChallenger: React.FC<ClassifyChallengerProps> = (props: ClassifyChallengerProps) => {
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

    const handleNameChange = (groupIdx: number, updatedName: string) => {
        const updatedGroups = challenge.groups.map((aGroup: ClassifyChallengeGroup, idx: number) => {
            return {
                ...aGroup,
                name: idx !== groupIdx ? aGroup.name : updatedName
            };
        });

        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                groups: updatedGroups
            });
        }
    };

    const handleItemsChange = (groupIdx: number, updatedItems: string[]) => {
        const updatedGroups = challenge.groups.map((aGroup: ClassifyChallengeGroup, idx: number) => {
            if (idx !== groupIdx) {
                return { ...aGroup };
            }
            return {
                ...aGroup,
                items: [...updatedItems]
            };
        });

        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                groups: updatedGroups
            });
        }
    };

    // const handleAnswerChange = (position: number, updatedAnswer: ClassifyChallengeAnswer) => {
    //     const updatedAnswers = challenge.answers.map((anAnswer: ClassifyChallengeAnswer, idx: number) => {
    //         if (idx !== position) {
    //             if (!challenge.config.multiselect) {
    //                 return {
    //                     ...anAnswer,
    //                     valid: false
    //                 };
    //             }
    //             return { ...anAnswer };
    //         }
    //         return { ...updatedAnswer };
    //     });

    //     if (onChallengeChange) {
    //         onChallengeChange({
    //             ...challenge,
    //             answers: updatedAnswers
    //         });
    //     }
    // };

    const handlerTimeUp = () => {
        showResult(false);
    };

    // const handlerOptionClick = (answerIdx: number) => {
    //     if (mode === ComponentMode.Play) {
    //         if (challenge.config.multiselect) {
    //             const theIndex = selectedAnswers.findIndex((anAnswerIdx: number) => anAnswerIdx === answerIdx);
    //             if (theIndex === -1) {
    //                 setSelectedAnswers([...selectedAnswers, answerIdx]);
    //             } else {
    //                 setSelectedAnswers(selectedAnswers.filter((anAnswerIdx: number) => anAnswerIdx !== answerIdx));
    //             }
    //         } else {
    //             if (challenge.answers[answerIdx].valid) {
    //                 showResult(true);
    //             } else {
    //                 showResult(false);
    //             }
    //         }
    //     }
    // };

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
                        <Grid container spacing={2} className={classes.fullHeight}>
                            <Grid item xs={12} className={classes.optionsContainer}>
                                <Grid container spacing={2} justify="space-evenly" alignItems="center">
                                    {
                                        challenge.groups.map((aGroup: ClassifyChallengeGroup) => (
                                            aGroup.items.map((anItem: string) => (
                                                <Grid item className={classes.fullHeight}>
                                                    {/* <Chip
                                                        label={anItem}
                                                        color="secondary"
                                                        style={{ fontSize: challenge.config.itemsFontSize, color: '#ffffff' }}
                                                        disabled
                                                    /> */}
                                                    <div
                                                        className={classes.item}
                                                        draggable={mode === ComponentMode.Play}
                                                    >
                                                        {anItem}
                                                    </div>
                                                </Grid>
                                            ))
                                        ))
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className={classes.groupsContainer}>
                                <Grid container justify="space-evenly" spacing={2} style={{ height: '100%' }}>
                                    {
                                        challenge.groups.map((aGroup: ClassifyChallengeGroup, idx: number) => (
                                            <Grid
                                                item
                                                xs={4}
                                                key={`group_${idx}`}
                                            >
                                                <DropGroup
                                                    mode={mode}
                                                    title={aGroup.name}
                                                    items={aGroup.items}
                                                    fontSize={challenge.config.itemsFontSize}
                                                    onTitleChange={(newName: string) => handleNameChange(idx, newName)}
                                                    onItemsChange={(newItems: string[]) => handleItemsChange(idx, newItems)}
                                                />
                                            </Grid>
                                        ))
                                    }                                    
                                </Grid>
                            </Grid>
                        </Grid>
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
