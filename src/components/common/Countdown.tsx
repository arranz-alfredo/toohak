import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@material-ui/core';
import { ComponentMode } from 'enums';

interface CountdownProps {
    mode: ComponentMode,
    time: number,
    stopTimer?: boolean,
    onTimeUp?: () => void
}


export const Countdown: React.FC<CountdownProps> = (props: CountdownProps) => {
    const { mode, time, stopTimer, onTimeUp } = props;

    const [timeRemaining, setTimeRemaining] = useState<number>(time);
    const [stop, setStop] = useState<boolean>(stopTimer || false);


    useEffect(() => {
        setTimeRemaining(time);
    }, [time]);

    useEffect(() => {
        setStop(stopTimer || false);
    }, [stopTimer]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (mode === ComponentMode.Play && !stop) {
            timeoutId = setTimeout(() => {
                if (timeRemaining === 0) {
                    if (onTimeUp) {
                        onTimeUp();
                    }
                } else {
                    setTimeRemaining(timeRemaining - 1);
                }
            }, 1000);
        }
        return () => {
            if (timeoutId != null) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeRemaining, onTimeUp]);

    return (
        <Grid container justify="center" alignItems="center" style={{height: '100%'}}>
            <Grid item>
                <Box position="relative" display="inline-flex">
                    <CircularProgress
                        variant="determinate"
                        color={timeRemaining > 5 ? 'primary': 'secondary'}
                        size="75px"
                        value={Math.round((timeRemaining * 100.0) / (time * 1.0))} />
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="h5" component="div" color="textSecondary">{timeRemaining}</Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};
