import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Grid, TextField, Typography } from '@material-ui/core';
import { useDrag } from 'react-dnd';
import { MatchItem } from 'types';
import { ComponentMode } from 'enums';

interface MatchSourceProps {
    mode: ComponentMode,
    item: MatchItem,
    fontSize: number,
    arrowNode: React.ReactNode,
    onTextChange?: (newText: string) => void
}

export const MatchSource: React.FC<MatchSourceProps> = (props: MatchSourceProps) => {
    const { mode, item, fontSize, arrowNode, onTextChange } = props;

    const [textValue, setTextValue] = useState<string>(item.text);

    const inputText = useRef({} as HTMLInputElement);

    useEffect(() => {
        setTextValue(item.text);
    }, [item]);

    const handleTextChange = () => {
        setTextValue(inputText.current.value);
        if (onTextChange) {
            onTextChange(inputText.current.value);
        }
    };

    const [/* { opacity } */, drag] = useDrag(
        () => ({
            type: 'dnd',
            item: { ...item },
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.4 : 1,
            }),
        }),
        [item],
    );

    return (
        <Card style={{width: '100%'}}>
            <CardContent>
                <Grid container alignItems="center">
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
                    <Grid item xs={1} container justify="center">
                        <div ref={drag}>
                            {arrowNode}
                        </div>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
