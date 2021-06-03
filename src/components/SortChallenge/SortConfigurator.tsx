import React, { useEffect, useRef, useState } from 'react';
import { Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { ChallengeConfig, SortChallengeConfig } from 'types';
import { ChallengeConfigurator } from 'components';

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
