import React, { useRef, useState } from 'react';
import { Card, Chip, Divider, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { ComponentMode } from '../../enums/ComponentMode';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
        // border: 'solid 1px'
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
        padding: '5px'
    }
}));

interface GroupState {
    title: string,
    items: string[]
}

interface DropGroupProps {
    mode: ComponentMode,
    title: string,
    items: string[],
    fontSize?: number,
    onTitleChange?: (newTitle: string) => void,
    onItemsChange?: (newTitle: string[]) => void
}

export const DropGroup: React.FC<DropGroupProps> = (props: DropGroupProps) => {
    const { mode, title, items, fontSize, onTitleChange, onItemsChange } = props;

    const [groupState, setGroupState] = useState<GroupState>({ title: title || '', items: items || [] });
    const inputTitle = useRef({} as HTMLInputElement);
    const inputItem = useRef({} as HTMLInputElement);

    const classes = useStyles();

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

    const handleItemKeyPress = (evt: React.KeyboardEvent<HTMLDivElement>) => {
        if (evt.code === 'Enter' && inputItem.current.value !== '') {
            addItem();
        }
    };

    const addItem = () => {
        const updatedItems = [...(groupState.items), inputItem.current.value];
        const newState = {
            ...groupState,
            items: updatedItems
        };
        setGroupState(newState);
        if (onItemsChange) {
            onItemsChange(updatedItems);
        }
        inputItem.current.value = '';
    };

    const handleRemoveItem = (itemIdx: number) => {
        const updatedItems = groupState.items.filter((anItem: string, idx: number) => itemIdx !== idx);
        const newState = {
            ...groupState,
            items: updatedItems
        };
        setGroupState(newState);
        if (onItemsChange) {
            onItemsChange(updatedItems);
        }
    };

    return (
        <Card elevation={4} className={classes.root}>
            <Grid container direction="column" className={classes.fullHeight}>
                <Grid item className={classes.titleContainer}>
                    {
                        mode === ComponentMode.Play ? (
                            <Typography style={{fontSize}}>
                                { title }
                            </Typography>
                        ): (
                            <TextField
                                inputRef={ inputTitle }
                                value={ groupState.title }
                                inputProps={
                                    {
                                        style: {
                                            width: '100%',
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
                <Divider />
                <Grid item>
                    <Grid container direction="column" alignItems="center" className={classes.itemsContainer} spacing={2}>
                        {
                            groupState.items.map((anItem: string, itemIdx: number) => (
                                <Grid item key={`item_${itemIdx}`}>
                                    <Chip
                                        label={anItem}
                                        color="secondary"
                                        size="medium"
                                        style={{ fontSize, color: '#ffffff' }}
                                        onDelete={() => handleRemoveItem(itemIdx)}
                                    />
                                </Grid>
                            ))
                        }
                        {
                            mode === ComponentMode.Design && (
                                <Grid item key="newItem">
                                    <TextField
                                        inputRef={ inputItem }
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
                                        onKeyPress={handleItemKeyPress}
                                    />
                                </Grid>
                            )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
};
