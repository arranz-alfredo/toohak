import React, { useEffect, useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useSound from 'use-sound';
import correct from 'assets/sounds/correct.wav';
import incorrect from 'assets/sounds/incorrect.wav';
import { Challenge, ChallengeOptions, ClassifyChallenge, ClassifyChallengeGroup } from 'types';
import { ComponentMode } from 'enums';
import { BasicChallengeTemplate, DragableItem, DropGroup } from 'components';

const useStyles = makeStyles(() => ({
    fullHeight: {
        height: '100%'
    },
    optionsContainer: {
        height: '20%',
        border: 'solid 1px gray',
        backgroundColor: '#ffffff'
    },
    groupsContainer: {
        height: '80%'
    }
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

const reorderItems = (groups: ClassifyChallengeGroup[], mode: ComponentMode): string[] => {
    let list: string[] = groups.reduce((acc: string[], current: ClassifyChallengeGroup) => [...acc, ...current.items], []);
    if (mode === ComponentMode.Play) {
        list = list.sort(() => Math.random() - 0.5);
    }
    return list;
};

interface ClassifyChallengerProps {
    mode: ComponentMode,
    challenge: ClassifyChallenge,
    options?: ChallengeOptions,
    onChallengeChange?: (updatedChallenge: ClassifyChallenge) => void,
    onSuccess?: () => void,
    onError?: () => void
}

export const ClassifyChallenger: React.FC<ClassifyChallengerProps> = (props: ClassifyChallengerProps) => {
    const { mode, challenge, options, onChallengeChange, onSuccess, onError } = props;

    const [classifyState, setClassifyState] = useState<dropState[]>(initialClassifyState(challenge));

    const [stopTimer, setStopTimer] = useState<boolean>(false);
    const [highlightResults, setHighlightResults] = useState<boolean>(false);

    const [draggableItems, setDragabbleItems] = useState<string[]>(reorderItems(challenge.groups, mode));

    const [playCorrect] = useSound(correct);
    const [playIncorrect] = useSound(incorrect);

    const classes = useStyles();

    useEffect(() => {
        setDragabbleItems(reorderItems(challenge.groups, mode));
    }, [challenge.groups]);

    const handleChallengeChange = (newChallenge: Challenge) => {
        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                ...(newChallenge as ClassifyChallenge)
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
        const newDroppedItems: dropState[] = classifyState.map((aGroup: { groupName: string, items: string[] }) => {
            if (aGroup.groupName !== groupName) {
                return {
                    ...aGroup,
                    items: aGroup.items.filter((anItem: string) => anItem !== droppedItem.name)
                };
            }

            const idxItem = aGroup.items.findIndex((anItem: string) => anItem === droppedItem.name);
            if (idxItem >= 0) {
                return { ...aGroup };
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
                <Grid item xs={12} className={classes.fullHeight}>
                    <DndProvider backend={HTML5Backend}>
                        <Grid container spacing={2} className={classes.fullHeight}>
                            <Grid item xs={12} className={classes.optionsContainer}>
                                <Grid container spacing={2} justify="space-around" alignItems="center">
                                    {
                                        draggableItems.map((anItem: string, idx: number) => !isDropped(anItem) && (
                                            !isDropped(anItem) && (
                                                <Grid item key={`gridItem_${idx}`}>
                                                    <DragableItem
                                                        name={anItem}
                                                        key={`dragable_${idx}`}
                                                        style={{ fontSize: challenge.config.itemsFontSize }}
                                                    />
                                                </Grid>
                                            )
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
            }
        />
    );
};
