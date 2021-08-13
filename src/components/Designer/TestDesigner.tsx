import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Grid, Icon, IconButton, ListItemIcon, makeStyles, Menu, MenuItem, Typography } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import { useProjects } from 'hooks/useProjects';
import { Challenge, Project, Test } from 'types';
import { ChallengeType, Language } from 'enums';
import { ChallengeDesigner, ChallengeSelector, DialogConfirm } from 'components';
import { getChallengeTypeDescription, getChallengeTypeIcon, getDefaultChallenge } from 'utils';
import { colors } from 'theme';

const useStyles = makeStyles((theme) => ({
    fullHeight: {
        height: '100%'
    },
    fullWidth: {
        width: '100%'
    },
    listContainer: {
        paddingRight: '10px',
        height: '100%',
        width: '100%',
        overflow: 'hidden'
    },
    challengesContainer: {
        height: 'calc(100% - 50px)',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        listStyle: 'none',
        '&::-webkit-scrollbar': {
            width: '0.2em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(255,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(255,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: colors.primary.light,
            outline: '1px solid slategrey'
        }
    },
    challengeSelector: {
        flexGrow: 1
    }
}));

const addMenuItems = [
    { type: ChallengeType.SelectAnswer, disabled: false },
    { type: ChallengeType.TrueOrFalse, disabled: false },
    { type: ChallengeType.FillGaps, disabled: false },
    { type: ChallengeType.Match, disabled: false },
    { type: ChallengeType.Sort, disabled: true },
    { type: ChallengeType.Classify, disabled: false },
    { type: ChallengeType.FillTable, disabled: false },
    { type: ChallengeType.TheOddOne, disabled: false },
    { type: ChallengeType.Crossword, disabled: true }
];

interface TestDesignerProps {
    projectId: string,
    testId: string
}

export const TestDesigner: React.FC<TestDesignerProps> = (props: TestDesignerProps) => {
    const { projectId, testId } = props;

    const { projects, setProjects } = useProjects();

    const [test, setTest] = useState<Test>({
        id: uuidv4(),
        name: 'Nuevo cuestionario',
        description: '',
        language: Language.Es,
        challenges: []
    });

    const [compactList, setCompactList] = useState<boolean>(false);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deletedChallenge, setDeletedChallenge] = useState<Challenge>();
    const [openRemoveChallengeConfirm, setOpenRemoveChallengeConfirm] = useState<boolean>(false);

    const classes = useStyles();

    useEffect(() => {
        const project = projects.find((aProject: Project) => aProject.id === projectId);
        if (project != null) {
            const test = project.tests.find((aTest: Test) => aTest.id === testId);
            if (test != null) {
                setTest(test);
                if (test.challenges.length > 0) {
                    if (selectedChallenge == null) {
                        setSelectedChallenge(test.challenges[0]);
                    } else {
                        setSelectedChallenge({ ...selectedChallenge });
                    }
                }
            }
        }
    }, [projects, projectId, testId]);

    const handleReorderChallenges = useCallback(
        (reorderedChallenges: Challenge[]) => {
            const updatedProjects = projects.map((aProject: Project) => {
                if (aProject.id !== projectId) {
                    return { ...aProject };
                }
                const updatedTests = aProject.tests.map((aTest: Test) => {
                    if (aTest.id !== testId) {
                        return { ...aTest };
                    }
                    return {
                        ...aTest,
                        challenges: reorderedChallenges
                    };
                });
                return {
                    ...aProject,
                    tests: [...updatedTests]
                };
            });
            setProjects(updatedProjects);
        },
        [projects]
    );

    const handleSelectChallenge = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
    };

    const handleDeleteChallenge = (challenge: Challenge) => {
        setDeletedChallenge(challenge);
        setOpenRemoveChallengeConfirm(true);
    };

    const handleClickNewChallengeMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNewChallengeOptionClick = (type: ChallengeType) => {
        const newChallenge: Challenge = getDefaultChallenge(type);
        const updatedProjects = projects.map((aProject: Project) => {
            if (aProject.id !== projectId) {
                return { ...aProject };
            }
            const updatedTests = aProject.tests.map((aTest: Test) => {
                if (aTest.id !== testId) {
                    return { ...aTest };
                }
                const selectedPosition = selectedChallenge != null ? (
                    test.challenges.findIndex(
                        (aChallenge: Challenge) => aChallenge.id === selectedChallenge?.id
                    )
                ) : 0;
                return {
                    ...aTest,
                    challenges: [
                        ...aTest.challenges.slice(0, selectedPosition + 1),
                        newChallenge,
                        ...aTest.challenges.slice(selectedPosition + 1)
                    ]
                };
            });
            return {
                ...aProject,
                tests: [...updatedTests]
            };
        });
        setProjects(updatedProjects);
        setSelectedChallenge(newChallenge);
        setAnchorEl(null);
    };

    const handleCloseNewChallengeMenu = () => {
        setAnchorEl(null);
    };

    const handleChallengeChange = (updatedChallenge: Challenge) => {
        const updatedProjects = projects.map((aProject: Project) => {
            if (aProject.id !== projectId) {
                return aProject;
            }
            const updatedTests = aProject.tests.map((aTest: Test) => {
                if (aTest.id !== testId) {
                    return { ...aTest };
                }
                const updatedChallenges = aTest.challenges.map((aChallenge: Challenge) => {
                    if (aChallenge.id !== updatedChallenge.id) {
                        return { ...aChallenge };
                    }
                    return { ...updatedChallenge };
                });
                return {
                    ...aTest,
                    challenges: [...updatedChallenges]
                };
            });
            return {
                ...aProject,
                tests: [...updatedTests]
            };
        });
        setProjects(updatedProjects);
        setSelectedChallenge({ ...updatedChallenge });
    };

    const handleConfirmRemoveChallenge = () => {
        const updatedProjects = projects.map((aProject: Project) => {
            if (aProject.id !== projectId) {
                return aProject;
            }
            const updatedTests = aProject.tests.map((aTest: Test) => {
                if (aTest.id !== testId) {
                    return aTest;
                }
                if (deletedChallenge?.id === selectedChallenge?.id) {
                    setSelectedChallenge(aTest.challenges.find(
                        (aChallenge: Challenge) => aChallenge.id !== deletedChallenge?.id
                    ));
                }
                const updatedChallenges = aTest.challenges.filter((
                    aChallenge: Challenge
                ) => aChallenge.id !== deletedChallenge?.id);
                return {
                    ...aTest,
                    challenges: [...updatedChallenges]
                };
            });
            return {
                ...aProject,
                tests: [...updatedTests]
            };
        });
        setProjects(updatedProjects);
        setOpenRemoveChallengeConfirm(false);
    };

    const handleRefuseRemoveChallenge = () => {
        setOpenRemoveChallengeConfirm(false);
    };

    const handleListModeChange = (event: React.MouseEvent<HTMLElement>, newListMode: boolean) => {
        setCompactList(newListMode);
    };

    const renderAddMenuItem = (challengeType: ChallengeType, disabled: boolean): React.ReactNode => {
        return (
            <MenuItem key={`item_${challengeType}`} disabled={disabled} onClick={() => {
                handleNewChallengeOptionClick(challengeType);
            }}>
                <ListItemIcon>{getChallengeTypeIcon(challengeType, 'large')}</ListItemIcon>
                <Typography variant='button'>
                    {getChallengeTypeDescription(challengeType)}
                </Typography>
            </MenuItem>
        );
    };

    return (
        <Fragment>
            <DialogConfirm
                open={openRemoveChallengeConfirm}
                text='¿Seguro que deseas eliminar la pregunta?'
                width='xs'
                onConfirm={handleConfirmRemoveChallenge}
                onRefuse={handleRefuseRemoveChallenge}
            />
            <Grid container className={classes.fullHeight} spacing={2}>
                <Grid item xs={2} className={classes.listContainer}>
                    <Grid container direction='column' className={classes.fullHeight}>
                        <Grid item className={classes.fullWidth}>
                            <Grid container justify='space-between' alignItems='center'>
                                <Grid item>
                                    <Typography variant='h5'>Preguntas</Typography>
                                </Grid>
                                <Grid item>
                                    <Grid container justify='flex-end' alignItems='center'>
                                        <Grid item>
                                            <ToggleButtonGroup size="small" value={compactList} exclusive onChange={handleListModeChange}>
                                                <ToggleButton value={false}>
                                                    <Icon>crop_din</Icon>
                                                </ToggleButton>
                                                <ToggleButton value={true}>
                                                    <Icon>reorder</Icon>
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </Grid>
                                        <Grid item>
                                            <IconButton onClick={handleClickNewChallengeMenu}>
                                                <Icon color='primary'>add_circle</Icon>
                                            </IconButton>
                                            <Menu
                                                id='new-challenge-menu'
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={Boolean(anchorEl)}
                                                onClose={handleCloseNewChallengeMenu}
                                            >
                                                {
                                                    addMenuItems.map((anItem) => (
                                                        renderAddMenuItem(anItem.type, anItem.disabled)
                                                    ))
                                                }
                                            </Menu>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item className={classes.challengesContainer}>
                            <DndProvider backend={HTML5Backend}>
                                <ChallengeSelector
                                    challenges={test.challenges}
                                    compactList={compactList}
                                    selected={selectedChallenge}
                                    onChallengeReorder={handleReorderChallenges}
                                    onSelect={handleSelectChallenge}
                                    onDelete={handleDeleteChallenge}
                                />
                            </DndProvider>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={10}>
                    {
                        selectedChallenge && (
                            <ChallengeDesigner
                                challenge={selectedChallenge}
                                onChallengeChange={handleChallengeChange}
                            />
                        )
                    }
                </Grid>
            </Grid>
        </Fragment>
    );
};
