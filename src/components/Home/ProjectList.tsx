import React, { ChangeEvent, Fragment, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogTitle, Divider, Grid, Icon, IconButton, makeStyles, Snackbar, SnackbarContent, Typography } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { Project } from '../../types/Project';
import { colors } from '../../theme';
import { TestList } from './TestList';
import { DialogConfirm } from '../common/DialogConfirm';
import { JsonLoader } from '../common/JsonLoader';
import { isValidProject } from '../../utils/utilValidationTypes';
import { ProjectForm } from './ProjectForm';
import { Test } from '../../types/Test';

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15)
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: colors.secondary.main
    },
    gridContainer: {
        padding: '0px 10px'
    },
    gridItems: {
        flexGrow: 1,
    },
    messageControl: {
        backgroundColor: colors.error,
        color: colors.font.errorContrast
    },
    dialogContainer: {
        padding: '20px'
    }
}));

interface ProjectListProps {
    projects: Project[],
    setProjects: (newProjects: Project[]) => void
}

export const ProjectList: React.FC<ProjectListProps> = (props: ProjectListProps) => {
    const { projects, setProjects } = props;

    const history = useHistory();

    const [expandedProject, setExpandedProject] = React.useState<string | false>(false);
    const [openProjectForm, setOpenProjectForm] = useState<boolean>(false);
    const [openRemoveProjectConfirm, setOpenRemoveProjectConfirm] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<Project>();
    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [messageText, setMessageText] = useState<string>('');

    const classes = useStyles();

    const handleExpandChange = (project: Project, isExpanded: boolean) => {
        setExpandedProject(isExpanded ? project.id : false);
    };

    const handleNewProjectClick = () => {
        setOpenProjectForm(true);
    };

    const handleEditProjectClick = (project: Project) => {
        setSelectedProject(project);
        setOpenProjectForm(true);
    };

    const handleRemoveProjectClick = (project: Project) => {
        setSelectedProject(project);
        setOpenRemoveProjectConfirm(true);
    };

    const handleExportProjectClick = (project: Project) => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(project)));
        element.setAttribute('download', project.name.replace(/ /g, '_'));
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleProjectFormAccept = (newProject: Project) => {
        if (selectedProject != null) {
            setProjects(projects.map((aProject: Project) => aProject.id === newProject.id ? newProject : aProject));
        } else {
            setProjects([
                ...projects,
                {
                    ...newProject
                }
            ]);
        }
        setSelectedProject(undefined);
        setOpenProjectForm(false);
    };

    const handleProjectFormCancel = () => {
        setSelectedProject(undefined);
        setOpenProjectForm(false);
    };

    const handleImportProject = (project: unknown) => {
        const newProject = project as Project;
        if (!isValidProject(newProject)) {
            setMessageText('El proyecto es inválido');
            setOpenMessage(true);
        }
        const exist = projects.find((aProject: Project) => aProject.id === newProject.id) != null;
        if (!exist) {
            setProjects([
                ...projects,
                {
                    ...newProject
                }
            ]);
        } else {
            setMessageText('El proyecto ya existe');
            setOpenMessage(true);
        }
    };

    const handleImportProjectError = () => {
        setMessageText('Se produjo un error en la importación');
        setOpenMessage(true);
    };

    const handleConfirmRemoveProject = () => {
        if (selectedProject != null) {
            setProjects(projects.filter((aProject: Project) => aProject.id !== selectedProject.id));
        }
        setOpenRemoveProjectConfirm(false);
    };

    const handleRefuseRemoveProject = () => {
        setOpenRemoveProjectConfirm(false);
    };

    const handleCreateTest = (projectId: string, test: Test) => {
        const theProject = projects.find((aProject: Project) => aProject.id === projectId);
        const updating = theProject != null && theProject.tests.some((aTest: Test) => aTest.id === test.id);

        const updatedProjects = projects.map((aProject: Project) => {
            if (aProject.id !== projectId) {
                return {...aProject};
            }
            if (updating) {
                const updatedTests = aProject.tests.map((aTest: Test) => aTest.id === test.id ? {...test} : {...aTest});
                return {
                    ...aProject,
                    tests: [...updatedTests]
                };
            }
            return {
                ...aProject,
                tests: [...aProject.tests, test]
            };
        });
        setProjects(updatedProjects);
        if (!updating) {
            history.push(`/designer/${projectId}/${test.id}`);
        }
    };

    const handleDeleteTest = (projectId: string, test: Test) => {
        const updatedProjects = projects.map((aProject: Project) => {
            if (aProject.id !== projectId) {
                return {...aProject};
            }
            const updatedTests = aProject.tests.filter((aTest: Test) => aTest.id !== test.id);
            return {
                ...aProject,
                tests: [...updatedTests]
            };
        });
        setProjects(updatedProjects);
    };

    const handleMessageClose = () => {
        setOpenMessage(false);
    };

    return (
        <Fragment>
            <Dialog
                open={openProjectForm}
                fullWidth
                maxWidth='sm'
            >
                <DialogTitle>Proyecto</DialogTitle>
                <Box className={classes.dialogContainer}>
                    <ProjectForm
                        project={selectedProject}
                        onAccept={handleProjectFormAccept}
                        onCancel={handleProjectFormCancel}
                    />
                </Box>
            </Dialog>
            <DialogConfirm
                open={openRemoveProjectConfirm}
                text='¿Seguro que deseas eliminar el proyecto?'
                width='xs'
                onConfirm={handleConfirmRemoveProject}
                onRefuse={handleRefuseRemoveProject}
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
                    <Grid container direction='row' justify='center' alignItems='center' spacing={2} className={classes.gridContainer}>
                        <Grid item className={classes.gridItems}>
                            <Typography variant='h6'>
                                Proyectos
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                style={{ color: colors.primary.dark }}
                                onClick={handleNewProjectClick}
                            >
                                Nuevo proyecto
                            </Button>
                        </Grid>
                        <Grid item>
                            <JsonLoader
                                onDataLoaded={handleImportProject}
                                onError={handleImportProjectError}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    {
                        projects.map((aProject: Project) => (
                            <Accordion
                                key={aProject.id}
                                expanded={expandedProject === aProject.id}
                                onChange={ (event: ChangeEvent<unknown>, isExpanded: boolean) => {
                                    handleExpandChange(aProject, isExpanded);
                                }}
                            >
                                <AccordionSummary title={aProject.description}>
                                    <Grid container justify='space-between' alignItems='center'>
                                        <Grid item xs={3}>
                                            <Typography className={classes.heading}>{aProject.name}</Typography>
                                        </Grid>
                                        <Grid item xs={7}>
                                            <Typography className={classes.secondaryHeading}>
                                                {`${aProject.tests.length} cuestionario${aProject.tests.length !== 1 ? 's' : ''}`}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <IconButton
                                                title='Descargar'
                                                color='primary'
                                                onClick={(evt) => {
                                                    evt.stopPropagation();
                                                    handleExportProjectClick(aProject);
                                                }}
                                            >
                                                <Icon>download</Icon>
                                            </IconButton>
                                            {
                                                <IconButton
                                                    title='Editar'
                                                    color='primary'
                                                    onClick={(evt) => {
                                                        evt.stopPropagation();
                                                        handleEditProjectClick(aProject);
                                                    }}
                                                >
                                                    <Icon>edit</Icon>
                                                </IconButton>
                                            }
                                            {
                                                <IconButton
                                                    title='Eliminar'
                                                    onClick={(evt) => {
                                                        evt.stopPropagation();
                                                        handleRemoveProjectClick(aProject);
                                                    }}
                                                >
                                                    <Icon>delete</Icon>
                                                </IconButton>
                                            }
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TestList
                                        project={aProject}
                                        onCreateTest={handleCreateTest}
                                        onDeleteTest={handleDeleteTest}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        ))
                    }
                </Grid>
            </Grid>
        </Fragment>
    );
};
