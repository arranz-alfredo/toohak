import React, { Fragment, useState } from 'react';
import { Box, Button, Dialog, DialogTitle, Divider, Grid, Icon, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Menu, MenuItem, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Test } from '../../types/Test';
import { colors } from '../../theme';
import { Project } from '../../types/Project';
import { isValidTest } from '../../utils/utilValidationTypes';
import { TestForm } from './TestForm';
import { DialogConfirm } from '../common/DialogConfirm';

const useStyles = makeStyles((theme) => ({
    inline: {
        display: 'inline',
    },
    listItemSecondaryAction: {
        visibility: 'hidden'
    },
    listItem: {
        '&:hover $listItemSecondaryAction': {
            visibility: 'inherit'
        }
    },
    bottomContainer: {
        marginTop: '10px'
    },
    play: {
        color: colors.action
    },
    dialogContainer: {
        padding: '20px'
    }
}));

interface TestListProps {
    project: Project,
    onCreateTest: (projectId: string, test: Test) => void
    onDeleteTest: (projectId: string, test: Test) => void
}

export const TestList: React.FC<TestListProps> = (props: TestListProps) => {
    const { project, onCreateTest, onDeleteTest } = props;

    const [selectedTest, setSelectedTest] = React.useState<Test | undefined>();
    const [anchorElEdit, setAnchorElEdit] = React.useState<Element | null>(null);
    const [openTestForm, setOpenTestForm] = useState<boolean>(false);
    const [openRemoveTestConfirm, setOpenRemoveTestConfirm] = useState<boolean>(false);

    const classes = useStyles();

    const handleCreateTestClick = () => {
        setOpenTestForm(true);
    };

    const handleTestFormAccept = (newTest: Test) => {
        onCreateTest(project.id, newTest);
        setSelectedTest(undefined);
        setOpenTestForm(false);
    };

    const handleTestFormCancel = () => {
        setSelectedTest(undefined);
        setOpenTestForm(false);
    };

    const handleEditClick = (evt: React.MouseEvent<HTMLButtonElement>, test: Test) => {
        setSelectedTest(test);
        setAnchorElEdit(evt.currentTarget);
    };

    const handleCloseEditMenu = () => {
        setAnchorElEdit(null);
    };

    const handleEditDataClick = () => {
        setAnchorElEdit(null);
        setOpenTestForm(true);
    };

    const handleRemoveTestClick = (test: Test) => {
        setSelectedTest(test);
        setOpenRemoveTestConfirm(true);
    };

    const handleConfirmRemoveTest = () => {
        if (selectedTest != null) {
            onDeleteTest(project.id, selectedTest);
        }
        setSelectedTest(undefined);
        setOpenRemoveTestConfirm(false);
    };

    const handleRefuseRemoveTest = () => {
        setSelectedTest(undefined);
        setOpenRemoveTestConfirm(false);
    };

    return (
        <Fragment>
            <Menu
                id="addNewMenu"
                anchorEl={anchorElEdit}
                keepMounted
                open={Boolean(anchorElEdit)}
                onClose={handleCloseEditMenu}
            >
                <MenuItem onClick={handleEditDataClick}>
                    <Typography variant="subtitle2">
                        Editar datos generales
                    </Typography>
                </MenuItem>
                <MenuItem component={Link} to={`/designer/${project.id}/${selectedTest?.id}`}>
                    <Typography variant="subtitle2">
                        Editar preguntas
                    </Typography>
                </MenuItem>
            </Menu>
            <Dialog
                open={openTestForm}
                fullWidth
                maxWidth='sm'
            >
                <DialogTitle>Cuestionario</DialogTitle>
                <Box className={classes.dialogContainer}>
                    <TestForm
                        test={selectedTest}
                        onAccept={handleTestFormAccept}
                        onCancel={handleTestFormCancel}
                    />
                </Box>
            </Dialog>
            <DialogConfirm
                open={openRemoveTestConfirm}
                text='¿Seguro que deseas eliminar el proyecto?'
                width='xs'
                onConfirm={handleConfirmRemoveTest}
                onRefuse={handleRefuseRemoveTest}
            />
            <Grid container>
                <Grid item xs={12}>
                    {
                        project.tests.length === 0
                        && <Typography>No hay cuestionarios</Typography>
                    }
                    {
                        project.tests.length > 0
                        && <List>
                            {
                                project.tests.map((aTest: Test) => (
                                    <Fragment key={`fragment_${aTest.id}`}>
                                        <ListItem
                                            button
                                            key={aTest.id}
                                            alignItems='flex-start'
                                            classes={{ container: classes.listItem }}
                                        >
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <ListItemText
                                                        primary={
                                                            aTest.name
                                                        }
                                                        secondary={
                                                            <Typography
                                                                component='span'
                                                                variant='body2'
                                                                className={classes.inline}
                                                                color='textPrimary'
                                                            >
                                                                {aTest.description}
                                                            </Typography>
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <ListItemText
                                                        secondary={`${aTest.challenges.length} pregunta${aTest.challenges.length !== 1 ? 's' : ''}`}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
                                                <Grid container>
                                                    <Grid item>
                                                        {
                                                            isValidTest(aTest) ? (
                                                                <IconButton title='Jugar!' component={Link} to={`/play/${project.id}/${aTest.id}`}>
                                                                    <Icon className={classes.play}>play_circle_filled</Icon>
                                                                </IconButton>
                                                            ) : (
                                                                <IconButton title='Errores en el cuestionario'>
                                                                    <Icon color='error'>error</Icon>
                                                                </IconButton>
                                                            )
                                                        }
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton title='Editar' onClick={(evt: React.MouseEvent<HTMLButtonElement>) => {
                                                            evt.stopPropagation();
                                                            handleEditClick(evt, aTest);
                                                        }}>
                                                            <Icon color='primary'>edit</Icon>
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton title='Eliminar' onClick={(evt) => {
                                                            evt.stopPropagation();
                                                            handleRemoveTestClick(aTest);
                                                        }}>
                                                            <Icon>delete</Icon>
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider variant='inset' component='li' />
                                    </Fragment>
                                ))
                            }
                        </List>
                    }
                    <Grid item xs={12} className={classes.bottomContainer}>
                        <Grid container justify='flex-end'>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handleCreateTestClick}
                            >
                                Nuevo cuestionario
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Fragment>
    );
};
