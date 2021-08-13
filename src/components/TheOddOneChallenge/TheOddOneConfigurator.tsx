import React, { useEffect, useRef, useState } from 'react';
import { Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { ChallengeConfig, TheOddOneChallengeConfig } from 'types';
import { ChallengeConfigurator } from 'components';

const useStyles = makeStyles({
    fullWidth: {
        width: '100%',
    }
});

interface TheOddOneConfiguratorProps {
    config: TheOddOneChallengeConfig,
    onConfigChange?: (config: TheOddOneChallengeConfig) => void
}

export const TheOddOneConfigurator: React.FC<TheOddOneConfiguratorProps> = (props: TheOddOneConfiguratorProps) => {
    const { config, onConfigChange } = props;

    const [formData, setFormData] = useState<TheOddOneChallengeConfig>(config);

    const inputAnswerFontSize = useRef({} as HTMLInputElement);
    const inputSeriesCount = useRef({} as HTMLInputElement);
    const inputSeriesLength = useRef({} as HTMLInputElement);

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

    const handleBaseConfigChange = (newBaseConfig: ChallengeConfig) => {
        const newConfig = {
            ...formData,
            ...newBaseConfig
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
                <ChallengeConfigurator
                    config={config}
                    onConfigChange={handleBaseConfigChange}
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
                    inputRef={inputSeriesCount}
                    type='number'
                    label='Número de series'
                    inputProps={{ min: 1 }}
                    value={formData.seriesCount}
                    color='secondary'
                    className={classes.fullWidth}
                    onInput={() => { handleConfigParameterChange('seriesCount', parseInt(inputSeriesCount.current.value)); }}
                />
            </Grid>
            <Grid item>
                <TextField
                    inputRef={inputSeriesLength}
                    type='number'
                    label='Elementos en cada serie'
                    inputProps={{ min: 3 }}
                    value={formData.seriesLength}
                    color='secondary'
                    className={classes.fullWidth}
                    onInput={() => { handleConfigParameterChange('seriesLength', parseInt(inputSeriesLength.current.value)); }}
                />
            </Grid>
        </Grid>
    );
};
