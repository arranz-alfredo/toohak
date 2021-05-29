import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Dialog, Grid, Icon, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    dialogContainer: {
        padding: '20px'
    },
}));

interface DialogFillGapsCandidatesProps {
    open: boolean,
    text: string,
    candidates: string[],
    onAccept: (alternatives: string[]) => void,
    onCancel: () => void
}

export const DialogFillGapsCandidates: React.FC<DialogFillGapsCandidatesProps> = (props: DialogFillGapsCandidatesProps) => {
    const { open, text, candidates, onAccept, onCancel } = props;

    const [formState, setFormState] = useState<string[]>(candidates);

    const inputCandidate = useRef({} as HTMLInputElement);

    const classes = useStyles();

    useEffect(() => {
        if (candidates != null) {
            setFormState(candidates);
        }
    }, [candidates]);

    const addCandidate = () => {
        setFormState([
            ...formState,
            inputCandidate.current.value
        ]);
        inputCandidate.current.value = '';
    };

    const handleCandidateKeyPress = (evt: React.KeyboardEvent<HTMLDivElement>) => {
        if (evt.code === 'Enter' && inputCandidate.current.value !== '') {
            addCandidate();
        }
    };

    const handleDeleteCandidate = (candidateIdx: number) => {
        setFormState(
            formState.filter((aCandidate: string, idx: number) => idx !== candidateIdx)
        );
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
            <Box className={classes.dialogContainer}>
                <Grid
                    container
                    direction='column'
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            {`Otros textos validos para "${text}"`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <List>
                            {
                                formState.map((aCandidate: string, candidateIdx: number) => (
                                    <ListItem>
                                        <ListItemText primary={aCandidate} />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" onClick={() => { handleDeleteCandidate(candidateIdx); }}>
                                                <Icon>delete</Icon>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            inputRef={inputCandidate}
                            variant="outlined"
                            style={{ width: '100%' }}
                            label="Nuevo candidato"
                            onKeyPress={handleCandidateKeyPress}
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
