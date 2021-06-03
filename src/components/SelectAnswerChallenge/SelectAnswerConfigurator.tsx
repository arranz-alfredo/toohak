import React, { useEffect, useRef, useState } from 'react';
import { FormControlLabel, Grid, makeStyles, Switch, TextField, Typography } from '@material-ui/core';
import { SelectAnswerChallengeConfig } from 'types';

const useStyles = makeStyles({
    fullWidth: {
        width: '100%',
    }
});

interface SelectAnswerConfiguratorProps {
    config: SelectAnswerChallengeConfig,
    onConfigChange?: (config: SelectAnswerChallengeConfig) => void
}

export const SelectAnswerConfigurator: React.FC<SelectAnswerConfiguratorProps> = (props: SelectAnswerConfiguratorProps) => {
    const { config, onConfigChange } = props;

    const [formData, setFormData] = useState<SelectAnswerChallengeConfig>(config);

    const inputTimeLimit = useRef({} as HTMLInputElement);
    const inputQuestionFontSize = useRef({} as HTMLInputElement);
    const inputPictureCount = useRef({} as HTMLInputElement);
    const checkPictureLabel = useRef({} as HTMLInputElement);
    const inputAnswerFontSize = useRef({} as HTMLInputElement);
    const checkMultiselect = useRef({} as HTMLInputElement);

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
                    inputRef={inputPictureCount}
                    type='number'
                    label='Número de imágenes'
                    inputProps={{ min: 1, max: 9 }}
                    value={formData.pictureCount}
                    color='secondary'
                    className={classes.fullWidth}
                    onInput={() => { handleConfigParameterChange('pictureCount', parseInt(inputPictureCount.current.value)); }}
                />
            </Grid>
            <Grid item>
                <FormControlLabel
                    control={
                        <Switch
                            inputRef={checkPictureLabel}
                            name='checkPictureLabel'
                            checked={formData.pictureLabel}
                            color='secondary'
                            onChange={() => { handleConfigParameterChange('pictureLabel', checkPictureLabel.current.checked); }}
                        />}
                    label='Numerar imágenes'
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
                <FormControlLabel
                    control={
                        <Switch
                            inputRef={checkMultiselect}
                            name='checkMultiselect'
                            checked={formData.multiselect}
                            color='secondary'
                            onChange={() => { handleConfigParameterChange('multiselect', checkMultiselect.current.checked); }}
                        />
                    }
                    label='Respuesta múltiple'
                />
            </Grid>
        </Grid>
    );
};
