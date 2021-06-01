import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Grid, TextField, Typography } from '@material-ui/core';
import { ComponentMode } from '../../enums/ComponentMode';
import { useDrop } from 'react-dnd';
import { MatchItem } from '../../types/MatchChallenge';

interface MatchDestinationProps {
    mode: ComponentMode,
    item: MatchItem,
    fontSize: number,
    arrowNode: React.ReactNode,
    onTextChange?: (newText: string) => void,
    onDrop?: (text: MatchItem) => void
}

export const MatchDestination: React.FC<MatchDestinationProps> = (props: MatchDestinationProps) => {
    const { mode, item, fontSize, arrowNode, onTextChange, onDrop } = props;

    const [textValue, setTextValue] = useState<string>(item.text);

    const inputText = useRef({} as HTMLInputElement);

    useEffect(() => {
        setTextValue(item.text);
    }, [item.text]);

    const handleTextChange = () => {
        setTextValue(inputText.current.value);
        if (onTextChange) {
            onTextChange(inputText.current.value);
        }
    };

    const handleDrop = (item: any) => {
        if (onDrop) {
            onDrop(item);
        }
    };

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'dnd',
        drop: handleDrop,
        collect: (monitor: { isOver: () => boolean, canDrop: () => boolean }) => {
            return ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop()
            });
        }
    });

    return (
        <Card style={{width: '100%'}}>
            <CardContent>
                <Grid container alignItems="center">
                    <Grid item xs={1} container justify="center">
                        <div ref={drop}>
                            {arrowNode}
                        </div>
                    </Grid>
                    <Grid item xs container justify="center">
                        {
                            mode === ComponentMode.Design ? (
                                <TextField
                                    inputRef={inputText}
                                    value={textValue}
                                    onInput={handleTextChange}
                                    style={{width: '95%'}}
                                    inputProps={{
                                        style: {
                                            fontSize: `${fontSize ? fontSize : 22}px`,
                                        }
                                    }}
                                />
                            ) : (
                                <Typography>
                                    {textValue}
                                </Typography>
                            )
                        }
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
