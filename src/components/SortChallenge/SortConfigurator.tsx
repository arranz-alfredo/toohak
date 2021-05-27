import React, { useEffect, useRef, useState } from 'react';
import { Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { SortChallengeConfig } from '../../types/SortChallenge';

const useStyles = makeStyles({
    fullWidth: {
        width: '100%',
    }
});

interface SortConfiguratorProps {
    config: SortChallengeConfig,
    onConfigChange?: (config: SortChallengeConfig) => void
}

export const SortConfigurator: React.FC<SortConfiguratorProps> = (props: SortConfiguratorProps) => {
    const { config, onConfigChange } = props;

    const [formData, setFormData] = useState<SortChallengeConfig>(config);

    const inputTimeLimit = useRef({} as HTMLInputElement);
    const inputQuestionFontSize = useRef({} as HTMLInputElement);
    const inputItemsFontSize = useRef({} as HTMLInputElement);
    const inputItemCount = useRef({} as HTMLInputElement);

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
                    inputRef={inputItemsFontSize}
                    type='number'
                    label='Tamaño de letra de los elementos'
                    inputProps={{ min: 1 }}
                    value={formData.itemsFontSize}
                    color='secondary'
                    className={classes.fullWidth}
                    onInput={() => { handleConfigParameterChange('itemsFontSize', parseInt(inputItemsFontSize.current.value)); }}
                />
            </Grid>
            <Grid item>
                <TextField
                    inputRef={inputItemCount}
                    type='number'
                    label='Número de elementos'
                    inputProps={{ min: 1 }}
                    value={formData.itemCount}
                    color='secondary'
                    className={classes.fullWidth}
                    onInput={() => { handleConfigParameterChange('groupCount', parseInt(inputItemCount.current.value)); }}
                />
            </Grid>
        </Grid>
    );
};
