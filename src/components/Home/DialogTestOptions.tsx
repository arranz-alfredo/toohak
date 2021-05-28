import React, { useRef, useState } from 'react';
import { Box, Button, Dialog, DialogTitle, FormControlLabel, Grid, makeStyles, Switch } from '@material-ui/core';
import { TestOptions } from '../../types/Test';

const useStyles = makeStyles(() => ({
    dialogContainer: {
        padding: '20px'
    },
}));

interface DialogTestOptionsProps {
    open: boolean,
    onAccept: (options: TestOptions) => void
    onCancel: () => void
}

export const DialogTestOptions: React.FC<DialogTestOptionsProps> = (props: DialogTestOptionsProps) => {
    const {open, onAccept, onCancel} = props;

    const [formState, setFormState] = useState<TestOptions>({ ignoreTimeLimit: false, autoNext: true });

    const checkIgnoreTimeLimit = useRef({} as HTMLInputElement);
    const checkAutoNextChallenge = useRef({} as HTMLInputElement);

    const classes = useStyles();

    const handleAttributeChange = (attribute: string, value: boolean) => {
        setFormState({
            ...formState,
            [attribute]: value
        });
    };

    const handleAcceptClick = () => {
        onAccept(formState);
    };

    const handleCancelClick = () => {
        onCancel();
    };

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth='sm'
        >
            <DialogTitle>Opciones del cuestionario</DialogTitle>
            <Box className={classes.dialogContainer}>
                <Grid
                    container
                    direction='column'
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    inputRef={checkIgnoreTimeLimit}
                                    name='checkMultiselect'
                                    checked={formState.ignoreTimeLimit}
                                    color='secondary'
                                    onChange={() => { handleAttributeChange('ignoreTimeLimit', checkIgnoreTimeLimit.current.checked); }}
                                />
                            }
                            label='Desactivar tiempo límite de las preguntas'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    inputRef={checkAutoNextChallenge}
                                    name='checkMultiselect'
                                    checked={formState.autoNext}
                                    color='secondary'
                                    onChange={() => { handleAttributeChange('autoNext', checkAutoNextChallenge.current.checked); }}
                                />
                            }
                            label='Avanzar automáticamente a la siguiente pregunta'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justify='flex-end' spacing={1}>
                            <Grid item>
                                <Button variant='contained' color='primary' onClick={handleAcceptClick}>Aceptar</Button>
                            </Grid>
                            <Grid item>
                                <Button color='primary' onClick={handleCancelClick}>Cancelar</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Dialog>
    );
};
