import React, { useEffect, useRef, useState } from 'react';
import { FormControlLabel, Grid, makeStyles, Switch, TextField, Typography } from '@material-ui/core';
import { ChallengeConfig, FillTableChallengeConfig } from 'types';
import { ChallengeConfigurator } from 'components';

const useStyles = makeStyles({
    fullWidth: {
        width: '100%',
    }
});

interface FillTableConfiguratorProps {
    config: FillTableChallengeConfig,
    onConfigChange?: (config: FillTableChallengeConfig) => void
}

export const FillTableConfigurator: React.FC<FillTableConfiguratorProps> = (props: FillTableConfiguratorProps) => {
    const { config, onConfigChange } = props;

    const [formData, setFormData] = useState<FillTableChallengeConfig>(config);

    const inputItemsFontSize = useRef({} as HTMLInputElement);
    const inputRowCount = useRef({} as HTMLInputElement);
    const checkFirstRowFixed = useRef({} as HTMLInputElement);
    const inputColumnCount = useRef({} as HTMLInputElement);
    const checkFirstColumnFixed = useRef({} as HTMLInputElement);

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
                    inputRef={inputRowCount}
                    type='number'
                    label='Número de filas'
                    inputProps={{ min: 1 }}
                    value={formData.rowCount}
                    color='secondary'
                    className={classes.fullWidth}
                    onInput={() => { handleConfigParameterChange('rowCount', parseInt(inputRowCount.current.value)); }}
                />
            </Grid>
            <Grid item>
                <FormControlLabel
                    control={
                        <Switch
                            inputRef={checkFirstRowFixed}
                            name='checkMultiselect'
                            checked={formData.firstRowFixed}
                            color='secondary'
                            onChange={() => { handleConfigParameterChange('firstRowFixed', checkFirstRowFixed.current.checked); }}
                        />
                    }
                    label='Primera fila fija'
                />
            </Grid>
            <Grid item>
                <TextField
                    inputRef={inputColumnCount}
                    type='number'
                    label='Número de columnas'
                    inputProps={{ min: 1 }}
                    value={formData.columnCount}
                    color='secondary'
                    className={classes.fullWidth}
                    onInput={() => { handleConfigParameterChange('columnCount', parseInt(inputColumnCount.current.value)); }}
                />
            </Grid>
            <Grid item>
                <FormControlLabel
                    control={
                        <Switch
                            inputRef={checkFirstColumnFixed}
                            name='checkFirstColumnFixed'
                            checked={formData.firstColumnFixed}
                            color='secondary'
                            onChange={() => { handleConfigParameterChange('firstColumnFixed', checkFirstColumnFixed.current.checked); }}
                        />
                    }
                    label='Primera columna fija'
                />
            </Grid>
        </Grid>
    );
};
