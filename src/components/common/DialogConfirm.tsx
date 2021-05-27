import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, Grid, Typography } from '@material-ui/core';

interface DialogConfirmProps {
    open: boolean,
    text: string,
    acceptButtonText?: string,
    cancelButtonText?: string,
    width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    onConfirm: () => void,
    onRefuse: () => void
}

export const DialogConfirm: React.FC<DialogConfirmProps> = (props: DialogConfirmProps) => {
    const {open, text, acceptButtonText, cancelButtonText, width, onConfirm, onRefuse} = props;

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth={ width ? width : 'sm' }
        >
            <DialogContent>
                <Grid container justify='center'>
                    <Grid item>
                        <Typography variant='button'>{text}</Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onConfirm} color='primary' variant='contained'>
                    { acceptButtonText ? acceptButtonText : 'Aceptar' }
                </Button>
                <Button onClick={onRefuse} color='primary'>
                    { cancelButtonText ? cancelButtonText : 'Cancelar' }
                </Button>
            </DialogActions>
        </Dialog>
    );
};
