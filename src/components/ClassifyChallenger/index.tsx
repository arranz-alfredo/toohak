import React, { useState } from 'react';
import { Card, Fab, Grid, Icon, makeStyles } from '@material-ui/core';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useSound from 'use-sound';
import { ChallengeQuestion } from '../ChallengeQuestion';
import { ClassifyChallenge, ClassifyChallengeGroup } from '../../types/ClassifyChallenge';
import { ComponentMode } from '../../enums/ComponentMode';
import { Countdown } from '../Countdown';

import correct from '../../assets/sounds/correct.wav';
import incorrect from '../../assets/sounds/incorrect.wav';
import { DropGroup } from '../DropGroup';
import { DragableItem } from '../DragableItem';

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
    classifyContainer: {
        height: '80%'
    },
    centerAll: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    optionsContainer: {
        height: '20%',
        border: 'solid 1px gray',
        backgroundColor: '#ffffff'
    },
    groupsContainer: {
        height: '80%'
    },
}));

interface dropState {
    groupName: string,
    items: string[]
}

const initialClassifyState = (challenge: ClassifyChallenge): dropState[] => {
    return challenge.groups.map((aGroup: ClassifyChallengeGroup) => (
        {
            groupName: aGroup.name,
            items: []
        }
    ));
};

interface ClassifyChallengerProps {
    mode: ComponentMode
    challenge: ClassifyChallenge
    onChallengeChange?: (updatedChallenge: ClassifyChallenge) => void
    onSuccess?: () => void
    onError?: () => void
}

export const ClassifyChallenger: React.FC<ClassifyChallengerProps> = (props: ClassifyChallengerProps) => {
    const { mode, challenge, onChallengeChange, onSuccess, onError } = props;

    const [classifyState, setClassifyState] =useState<dropState[]>(initialClassifyState(challenge));

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

    const handlerTimeUp = () => {
        showResult(false);
    };

    const handleCheckClick = () => {
        const correct = challenge.groups.reduce(
            (accGroups: boolean, currentGroup: ClassifyChallengeGroup) => {
                const correctItems = currentGroup.items.reduce(
                    (accItems: boolean, currentItem: string) => {
                        const theGroup = classifyState.find((aGroup: dropState) => aGroup.groupName === currentGroup.name);
                        if (theGroup != null) {
                            return accItems && theGroup.items.indexOf(currentItem) >= 0;
                        }
                        return false;
                    },
                    true
                );
                return accGroups && correctItems;
            },
            true
        );
        showResult(correct);
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

    const isDropped = (itemName: string) => classifyState.reduce(
        (acc: boolean, current: dropState) => acc || current.items.indexOf(itemName) >= 0,
        false
    );

    const completed = () => {
        const optionCount = challenge.groups.reduce(
            (acc: number, current: ClassifyChallengeGroup) => acc + current.items.length,
            0
        );
        const dropCount = classifyState.reduce(
            (acc: number, current: dropState) => acc + current.items.length,
            0
        );
        return optionCount === dropCount;
    };

    const handleDrop = (groupName: string, droppedItem: any) => {
        const newDroppedItems: dropState[] = classifyState.map((aGroup: { groupName: string, items: string[]}) => {
            if (aGroup.groupName !== groupName) {
                return {
                    ...aGroup,
                    items: aGroup.items.filter((anItem: string) => anItem !== droppedItem.name)
                };
            }

            const idxItem = aGroup.items.findIndex((anItem: string) => anItem === droppedItem.name);
            if (idxItem >= 0) {
                return {...aGroup};
            }
            return {
                ...aGroup,
                items: [
                    ...aGroup.items,
                    droppedItem.name
                ]
            };
        });
        setClassifyState(newDroppedItems);
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
            <div className={classes.classifyContainer}>
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
                        <DndProvider backend={HTML5Backend}>
                            <Grid container spacing={2} className={classes.fullHeight}>
                                <Grid item xs={12} className={classes.optionsContainer}>
                                    <Grid container spacing={2} justify="space-around" alignItems="center">
                                        {
                                            challenge.groups.map((aGroup: ClassifyChallengeGroup) => (
                                                aGroup.items.map((anItem: string, idx: number) => (
                                                    !isDropped(anItem) && (
                                                        <Grid item key={`gridItem_${idx}`}>
                                                            <DragableItem
                                                                name={anItem}
                                                                type="classifyElement"
                                                                key={`dragable_${idx}`}
                                                                style={{fontSize: challenge.config.itemsFontSize}}
                                                            />
                                                        </Grid>
                                                    )
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
                                                        validItems={aGroup.items}
                                                        showResults={highlightResults}
                                                        fontSize={challenge.config.itemsFontSize}
                                                        onTitleChange={(newName: string) => handleNameChange(idx, newName)}
                                                        onItemsChange={(newItems: string[]) => handleItemsChange(idx, newItems)}
                                                        acceptTypes={['classifyElement']}
                                                        droppedItems={
                                                            classifyState
                                                                .find((auxGroup: dropState) => auxGroup.groupName === aGroup.name)
                                                                ?.items
                                                        }
                                                        onDrop={(droppedItem: unknown) => handleDrop(aGroup.name, droppedItem)}
                                                    />
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                </Grid>
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
                                <Icon>check</Icon>&nbsp;Corregir
                            </Fab>
                        }
                    </Grid>
                </Grid>
            </div>
        </Card>
    );
};
