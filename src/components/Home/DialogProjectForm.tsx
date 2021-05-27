import React from 'react';
import { Box, Dialog, DialogTitle, makeStyles } from '@material-ui/core';
import { Project } from '../../types/Project';
import { ProjectForm } from './ProjectForm';

const useStyles = makeStyles(() => ({
    dialogContainer: {
        padding: '20px'
    },
}));

interface DialogProjectFormProps {
    open: boolean,
    project?: Project
    onAccept: (project: Project) => void
    onCancel: () => void
}

export const DialogProjectForm: React.FC<DialogProjectFormProps> = (props: DialogProjectFormProps) => {
    const {open, project, onAccept, onCancel} = props;

    const classes = useStyles();

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth='sm'
        >
            <DialogTitle>Proyecto</DialogTitle>
            <Box className={classes.dialogContainer}>
                <ProjectForm
                    project={project}
                    onAccept={onAccept}
                    onCancel={onCancel}
                />
            </Box>
        </Dialog>
    );
};
