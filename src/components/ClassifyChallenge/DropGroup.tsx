import React, { useEffect, useRef, useState } from 'react';
import { Card, Chip, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { ComponentMode } from '../../enums/ComponentMode';
import { useDrop } from 'react-dnd';
import { DragableItem } from '../common/DragableItem';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
    },
    fullWidth: {
        width: '100%'
    },
    fullHeight: {
        height: '100%'
    },
    titleContainer: {
        width: '100%',
        padding: '5px',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
    },
    itemsContainer: {
        padding: '5px',
        height: '100%'
    }
}));

interface GroupState {
    title: string,
    validItems: string[],
    droppedItems: string[]
}

interface DropGroupProps {
    mode: ComponentMode,
    title: string,
    validItems: string[],
    showResults: boolean,
    fontSize?: number,
    onTitleChange?: (newTitle: string) => void,
    onItemsChange?: (newTitle: string[]) => void,
    droppedItems?: string[]
    onDrop?: (item: unknown) => void
}

export const DropGroup: React.FC<DropGroupProps> = (props: DropGroupProps) => {
    const {
        mode,
        title,
        validItems,
        showResults,
        fontSize,
        onTitleChange,
        onItemsChange,
        droppedItems,
        onDrop
    } = props;

    const handleDrop = (item: unknown) => {
        if(onDrop) {
            onDrop(item);
        }
    };

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'dnd',
        drop: handleDrop,
        collect: (monitor: { isOver: () => boolean, canDrop: () => boolean }) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        })
    });

    const [groupState, setGroupState] = useState<GroupState>({
        title: title || '',
        validItems: validItems || [],
        droppedItems: droppedItems || []
    });

    const inputTitle = useRef({} as HTMLInputElement);
    const inputItem = useRef({} as HTMLInputElement);

    const classes = useStyles();

    useEffect(() => {
        if (droppedItems != null) {
            setGroupState({
                ...groupState,
                droppedItems: [...droppedItems]
            });
        }
    }, [droppedItems]);


    const handleTitleChange = () => {
        const newState = {
            ...groupState,
            title: inputTitle.current.value
        };
        setGroupState(newState);
        if (onTitleChange) {
            onTitleChange(inputTitle.current.value);
        }
    };

    const handleValidItemKeyPress = (evt: React.KeyboardEvent<HTMLDivElement>) => {
        if (evt.code === 'Enter' && inputItem.current.value !== '') {
            addValidItem();
        }
    };

    const addValidItem = () => {
        const updatedItems = [...(groupState.validItems), inputItem.current.value];
        const newState: GroupState = {
            ...groupState,
            validItems: updatedItems
        };
        setGroupState(newState);
        if (onItemsChange) {
            onItemsChange(updatedItems);
        }
        inputItem.current.value = '';
    };

    const handleRemoveValidItem = (itemIdx: number) => {
        const updatedItems = groupState.validItems.filter((anItem: string, idx: number) => itemIdx !== idx);
        const newState: GroupState = {
            ...groupState,
            validItems: updatedItems
        };
        setGroupState(newState);
        if (onItemsChange) {
            onItemsChange(updatedItems);
        }
    };

    const getDragableItemStyle = (item: string) => showResults ? (
        validItems.indexOf(item) >= 0 ? {
            fontSize: `${fontSize}px`,
            backgroundColor: '#4caf50'
        } : {
            fontSize: `${fontSize}px`,
            backgroundColor: '#f44336'
        }
    ) : {fontSize: `${fontSize}px`};

    return (
        <Card
            elevation={4}
            className={classes.root}
            style={{
                backgroundColor: (isOver && canDrop) ? '#efefef' : '#ffffff'
            }}
        >
            <Grid container direction="column" className={`${classes.fullHeight} ${classes.fullWidth}`}>
                <Grid item className={classes.titleContainer}>
                    {
                        mode === ComponentMode.Play ? (
                            <Typography style={{ fontSize }}>
                                { title}
                            </Typography>
                        ) : (
                            <TextField
                                inputRef={inputTitle}
                                value={groupState.title}
                                style={{
                                    width: '100%'
                                }}
                                inputProps={
                                    {
                                        style: {
                                            fontSize,
                                            textAlign: 'center',
                                            color: '#ffffff'

                                        }
                                    }
                                }
                                onInput={handleTitleChange}
                            />
                        )
                    }
                </Grid>
                <Grid item xs>
                    <Grid container direction="column" alignItems="center" className={classes.itemsContainer} spacing={2}>
                        {
                            mode === ComponentMode.Design
                            && groupState.validItems.map((anItem: string, itemIdx: number) => (
                                <Grid item key={`item_${itemIdx}`}>
                                    <Chip
                                        label={anItem}
                                        color="secondary"
                                        size="medium"
                                        style={{ fontSize, color: '#ffffff' }}
                                        onDelete={() => handleRemoveValidItem(itemIdx)}
                                    />
                                </Grid>
                            ))
                        }
                        {
                            mode === ComponentMode.Design && (
                                <Grid item key="newItem">
                                    <TextField
                                        inputRef={inputItem}
                                        variant="outlined"
                                        InputProps={
                                            {
                                                style: {
                                                    fontSize,
                                                    color: '#000000'
                                                }
                                            }
                                        }
                                        label="Nuevo elemento"
                                        onKeyPress={handleValidItemKeyPress}
                                    />
                                </Grid>
                            )
                        }
                        {
                            mode === ComponentMode.Play && (
                                <Grid item key="dropItem" xs className={`${classes.fullWidth} ${classes.fullHeight}`}>
                                    <div
                                        ref={drop}
                                        className={`${classes.fullWidth} ${classes.fullHeight}`}
                                    >
                                        <Grid container direction="column" alignItems="center" spacing={1} className={classes.fullHeight}>
                                            {
                                                groupState.droppedItems.map((aDroppedItem: string) => (
                                                    <Grid
                                                        item
                                                        key={`gridItem_${aDroppedItem}`}
                                                    >
                                                        <DragableItem
                                                            key={aDroppedItem}
                                                            name={aDroppedItem}
                                                            style={getDragableItemStyle(aDroppedItem)}
                                                        />
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
                                    </div>
                                </Grid>
                            )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
};
