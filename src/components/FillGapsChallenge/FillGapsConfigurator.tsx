import React, { useEffect, useRef, useState } from 'react';
import { FormControl, FormControlLabel, Grid, InputLabel, makeStyles, MenuItem, Select, Switch, TextField, Typography } from '@material-ui/core';
import { ChallengeConfig, FillGapsChallengeConfig } from 'types';
import { FillMethod } from 'enums';
import { ChallengeConfigurator } from 'components';

const useStyles = makeStyles({
    fullWidth: {
        width: '100%',
    }
});

interface FillGapsConfiguratorProps {
    config: FillGapsChallengeConfig,
    onConfigChange?: (config: FillGapsChallengeConfig) => void
}

export const FillGapsConfigurator: React.FC<FillGapsConfiguratorProps> = (props: FillGapsConfiguratorProps) => {
    const { config, onConfigChange } = props;

    const [formData, setFormData] = useState<FillGapsChallengeConfig>(config);

    const inputTextFontSize = useRef({} as HTMLInputElement);
    const inputFillMethod = useRef({} as HTMLSelectElement);
    const checkCapitalLetters = useRef({} as HTMLInputElement);
    const checkAccentMarks = useRef({} as HTMLInputElement);

    const classes = useStyles();

    useEffect(() => {
        setFormData(config);
    }, [config]);

    const handleConfigParameterChange = (parameter: string, value: number | boolean | string) => {
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
                    inputRef={inputTextFontSize}
                    type='number'
                    label='Tamaño de letra de los elementos'
                    inputProps={{ min: 1 }}
                    value={formData.textFontSize}
                    color='secondary'
                    className={classes.fullWidth}
                    onInput={() => { handleConfigParameterChange('textFontSize', parseInt(inputTextFontSize.current.value)); }}
                />
            </Grid>
            <Grid item>
                <FormControl className={classes.fullWidth}>
                    <InputLabel>Modo de rellenado</InputLabel>
                    <Select
                        inputRef={inputFillMethod}
                        label="Modo de rellenado"
                        value={formData.fillMethod}
                        color='secondary'
                        className={classes.fullWidth}
                        onChange={(evt: React.ChangeEvent<{name?: string | undefined, value: unknown}>) => {
                            handleConfigParameterChange('fillMethod', evt.target.value as string);
                        }}
                    >
                        <MenuItem value={FillMethod.Writing}>Escribiendo</MenuItem>
                        <MenuItem value={FillMethod.Dragging}>Arrastrando</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item>
                <FormControlLabel
                    control={
                        <Switch
                            inputRef={checkCapitalLetters}
                            name='checkMultiselect'
                            checked={formData.checkCapitalLetters}
                            color='secondary'
                            onChange={() => { handleConfigParameterChange('checkCapitalLetters', checkCapitalLetters.current.checked); }}
                        />
                    }
                    label='Comprobar mayúsculas/minúsculas'
                />
            </Grid>
            <Grid item>
                <FormControlLabel
                    control={
                        <Switch
                            inputRef={checkAccentMarks}
                            name='checkAccentMarks'
                            checked={formData.checkAccentMarks}
                            color='secondary'
                            onChange={() => { handleConfigParameterChange('checkAccentMarks', checkAccentMarks.current.checked); }}
                        />
                    }
                    label='Comprobar tildes'
                />
            </Grid>
        </Grid>
    );
};
