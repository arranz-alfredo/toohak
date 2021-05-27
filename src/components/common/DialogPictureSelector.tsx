import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Dialog, DialogTitle, Grid, makeStyles, TextField } from '@material-ui/core';
import { ChallengePicture } from '../../types/Challenge';
import { PictureType } from '../../enums/PictureType';

const useStyles = makeStyles(() => ({
    dialogContainer: {
        padding: '20px'
    },
}));

interface DialogPictureFormProps {
    open: boolean,
    picture: ChallengePicture
    onAccept: (picture: ChallengePicture) => void
    onCancel: () => void
}

export const DialogPictureForm: React.FC<DialogPictureFormProps> = (props: DialogPictureFormProps) => {
    const {open, picture, onAccept, onCancel} = props;

    const [formState, setFormState] = useState<ChallengePicture>(picture);

    const inputUrl = useRef({} as HTMLInputElement);

    const classes = useStyles();

    useEffect(() => {
        if (picture != null) {
            setFormState(picture);
        }
    }, [picture]);

    const handleUrlChange = () => {
        setFormState({
            ...formState,
            data: inputUrl.current.value
        });
    };

    const handleAcceptClick = () => {
        const newPicture = {
            type: PictureType.Url,
            data: inputUrl.current.value
        };

        onAccept(newPicture);
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
            <DialogTitle>Imagen</DialogTitle>
            <Box className={classes.dialogContainer}>
                <Grid
                    container
                    direction='column'
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <TextField
                            inputRef={inputUrl}
                            label='URL de la imagen'
                            fullWidth
                            value={formState.data}
                            onInput={handleUrlChange}
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
