import React, { useEffect, useRef, useState } from 'react';
import { FormControlLabel, Grid, makeStyles, Switch, TextField, Typography } from '@material-ui/core';
import { ChallengeConfig, TrueOrFalseChallengeConfig } from 'types';
import { ChallengeConfigurator } from 'components/Common';

const useStyles = makeStyles({
    fullWidth: {
        width: '100%',
    }
});

interface TrueOrFalseConfiguratorProps {
    config: TrueOrFalseChallengeConfig,
    onConfigChange?: (config: TrueOrFalseChallengeConfig) => void
}

export const TrueOrFalseConfigurator: React.FC<TrueOrFalseConfiguratorProps> = (props: TrueOrFalseConfiguratorProps) => {
    const { config, onConfigChange } = props;

    const [formData, setFormData] = useState<TrueOrFalseChallengeConfig>(config);

    const inputPictureCount = useRef({} as HTMLInputElement);
    const checkPictureLabel = useRef({} as HTMLInputElement);

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
        </Grid>
    );
};
