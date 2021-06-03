import React, { useEffect, useRef, useState } from 'react';
import { Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { ChallengeConfig } from 'types';

const useStyles = makeStyles({
    fullWidth: {
        width: '100%',
    }
});

interface ChallengeConfiguratorProps {
    config: ChallengeConfig,
    onConfigChange?: (config: ChallengeConfig) => void
}

export const ChallengeConfigurator: React.FC<ChallengeConfiguratorProps> = (props: ChallengeConfiguratorProps) => {
    const { config, onConfigChange } = props;

    const [formData, setFormData] = useState<ChallengeConfig>(config);

    const inputTimeLimit = useRef({} as HTMLInputElement);
    const inputQuestionFontSize = useRef({} as HTMLInputElement);

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
        </Grid>
    );
};
