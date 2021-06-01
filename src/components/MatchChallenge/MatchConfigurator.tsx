import React, { useEffect, useRef, useState } from 'react';
import { FormControlLabel, Grid, makeStyles, Switch, TextField, Typography } from '@material-ui/core';
import { MatchChallengeConfig } from '../../types/MatchChallenge';

const useStyles = makeStyles({
    fullWidth: {
        width: '100%',
    }
});

interface MatchConfiguratorProps {
    config: MatchChallengeConfig,
    onConfigChange?: (config: MatchChallengeConfig) => void
}

export const MatchConfigurator: React.FC<MatchConfiguratorProps> = (props: MatchConfiguratorProps) => {
    const { config, onConfigChange } = props;

    const [formData, setFormData] = useState<MatchChallengeConfig>(config);

    const inputTimeLimit = useRef({} as HTMLInputElement);
    const inputQuestionFontSize = useRef({} as HTMLInputElement);
    const inputAnswerFontSize = useRef({} as HTMLInputElement);
    const inputPairsCount = useRef({} as HTMLInputElement);

    const classes = useStyles();

    useEffect(() => {
        setFormData(config);
    }, [config]);

    const handleConfigParameterChange = (parameter: string, value: number | boolean) => {
        const newConfig = {
            ...formData,
            [parameter]: value
        };
        setFormData(newConfig);
        if (onConfigChange) {
            onConfigChange(newConfig);
        }
    };

    return (
        <Grid container direction='column' spacing={2}>
            <Grid item>
                <Typography variant='h5'>Configuración</Typography>
            </Grid>
            <Grid item>
                <TextField
                    inputRef={inputTimeLimit}
                    type='number'
                    label='Límite de tiempo (segundos)'
                    inputProps={{ min: 10 }}
                    value={formData.timeLimit}
                    color='secondary'
                    className={classes.fullWidth}
                    onInput={() => { handleConfigParameterChange('timeLimit', parseInt(inputTimeLimit.current.value)); }}
                />
            </Grid>
            <Grid item>
                <TextField
                    inputRef={inputQuestionFontSize}
                    type='number'
                    label='Tamaño de letra del título'
                    inputProps={{ min: 1 }}
                    value={formData.questionFontSize}
                    color='secondary'
                    className={classes.fullWidth}
                    onInput={() => { handleConfigParameterChange('questionFontSize', parseInt(inputQuestionFontSize.current.value)); }}
                />
            </Grid>
            <Grid item>
                <TextField
                    inputRef={inputAnswerFontSize}
                    type='number'
                    label='Tamaño de letra de las respuestas'
                    inputProps={{ min: 1 }}
                    value={formData.answerFontSize}
                    color='secondary'
                    className={classes.fullWidth}
                    onInput={() => { handleConfigParameterChange('answerFontSize', parseInt(inputAnswerFontSize.current.value)); }}
                />
            </Grid>
            <Grid item>
                <TextField
                    inputRef={inputPairsCount}
                    type='number'
                    label='Número de parejas'
                    inputProps={{ min: 1 }}
                    value={formData.pairsCount}
                    color='secondary'
                    className={classes.fullWidth}
                    onInput={() => { handleConfigParameterChange('pairsCount', parseInt(inputPairsCount.current.value)); }}
                />
            </Grid>
        </Grid>
    );
};
