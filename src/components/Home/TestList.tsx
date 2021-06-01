import React, { Fragment, useState } from 'react';
import { Box, Button, Dialog, DialogTitle, Divider, Grid, Icon, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Menu, MenuItem, Snackbar, SnackbarContent, Typography } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { Test, TestOptions } from '../../types/Test';
import { colors } from '../../theme';
import { Project } from '../../types/Project';
import { isValidTest } from '../../utils/utilValidationTypes';
import { TestForm } from './TestForm';
import { DialogConfirm } from '../common/DialogConfirm';
import { DialogTestOptions } from './DialogTestOptions';
import { JsonLoader } from '../common/JsonLoader';

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
    },
    messageControl: {
        backgroundColor: colors.error,
        color: colors.font.errorContrast
    }
}));

interface PlayOptionsState {
    projectId?: string,
    testId?: string,
    openOptions: boolean
}
interface TestListProps {
    project: Project,
    onCreateTest: (projectId: string, test: Test, openDesign: boolean) => void,
    onDeleteTest: (projectId: string, test: Test) => void
}

export const TestList: React.FC<TestListProps> = (props: TestListProps) => {
    const { project, onCreateTest, onDeleteTest } = props;

    const history = useHistory();

    const [selectedTest, setSelectedTest] = React.useState<Test | undefined>();
    const [anchorElEdit, setAnchorElEdit] = React.useState<Element | null>(null);
    const [openTestForm, setOpenTestForm] = useState<boolean>(false);
    const [openRemoveTestConfirm, setOpenRemoveTestConfirm] = useState<boolean>(false);
    const [playOptionsState, setPlayOptionsState] = useState<PlayOptionsState>();
    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [messageText, setMessageText] = useState<string>('');

    const classes = useStyles();

    const handleCreateTestClick = () => {
        setOpenTestForm(true);
    };

    const handleImportTest = (test: unknown) => {
        const newTest = test as Test;
        if (!isValidTest(newTest)) {
            setMessageText('El proyecto es inválido');
            setOpenMessage(true);
        }
        const exist = project.tests.find((aTest: Test) => aTest.id === newTest.id) != null;
        if (!exist) {
            onCreateTest(project.id, newTest, false);
        } else {
            setMessageText('El proyecto ya existe');
            setOpenMessage(true);
        }
    };

    const handleImportTestError = () => {
        setMessageText('Se produjo un error en la importación');
        setOpenMessage(true);
    };

    const handleTestFormAccept = (newTest: Test) => {
        onCreateTest(project.id, newTest, true);
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

    const handleExportTestClick = (test: Test) => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(test)));
        element.setAttribute('download', test.name.replace(/ /g, '_'));
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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

    const handlePlayClick = (projectId: string, testId: string) => {
        setPlayOptionsState({
            projectId,
            testId,
            openOptions: true
        });
    };

    const handleAcceptPlayOptions = (testOptions: TestOptions) => {
        history.push(`/play/${playOptionsState?.projectId}/${playOptionsState?.testId}?ignoreTimeLimit=${testOptions.ignoreTimeLimit}&autoNext=${testOptions.autoNext}`, playOptionsState);
        setPlayOptionsState({
            openOptions: false
        });
    };

    const handleCancelPlayOptions = () => {
        setPlayOptionsState({
            openOptions: false
        });
    };

    const handleMessageClose = () => {
        setOpenMessage(false);
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
            <Snackbar
                open={openMessage}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                autoHideDuration={3000}
                onClose={handleMessageClose}
            >
                <SnackbarContent
                    message={
                        <Grid container spacing={4}>
                            <Grid item xs={1}>
                                <Icon>error</Icon>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography>{messageText}</Typography>
                            </Grid>
                        </Grid>
                    }
                    className={classes.messageControl}
                />
            </Snackbar>
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
                                                                <IconButton title='Jugar!' onClick={() => { handlePlayClick(project.id, aTest.id); }}>
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
                                                        <IconButton title='Editar cuestionario' onClick={(evt: React.MouseEvent<HTMLButtonElement>) => {
                                                            evt.stopPropagation();
                                                            handleEditClick(evt, aTest);
                                                        }}>
                                                            <Icon color='primary'>edit</Icon>
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton title='Descargar cuestionario' onClick={(evt) => {
                                                            evt.stopPropagation();
                                                            handleExportTestClick(aTest);
                                                        }}>
                                                            <Icon>download</Icon>
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton title='Eliminar cuestionario' onClick={(evt) => {
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
                        <Grid container justify='flex-end' spacing={1}>
                            <Grid item>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={handleCreateTestClick}
                                >
                                    Nuevo cuestionario
                                </Button>
                            </Grid>
                            <Grid item>
                                <JsonLoader
                                    label="Importar cuestionario"
                                    onDataLoaded={handleImportTest}
                                    onError={handleImportTestError}
                                />
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {
                playOptionsState && (
                    <DialogTestOptions
                        open={playOptionsState.openOptions}
                        onAccept={handleAcceptPlayOptions}
                        onCancel={handleCancelPlayOptions}
                    />
                )
            }
        </Fragment>
    );
};
