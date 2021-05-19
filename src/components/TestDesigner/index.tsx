import React, { Fragment, useEffect, useState } from 'react';
import { Grid, Icon, IconButton, ListItemIcon, makeStyles, Menu, MenuItem, Typography } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { useProjects } from '../../hooks/useProjects';
import { Project } from '../../types/Project';
import { Test } from '../../types/Test';
import { ChallengeSelector } from '../ChallengeSelector';
import { ChallengeDesigner } from '../ChallengeDesigner';
import { Challenge } from '../../types/Challenge';
import { ChallengeType } from '../../enums/ChallengeType';
import { getChallengeTypeDescription, getChallengeTypeIcon, getDefaultChallenge } from '../../utils/utilChallenges';
import { colors } from '../../theme';
import { DialogConfirm } from '../DialogConfirm';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Language } from '../../enums/Language';

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
                return {
                    ...aTest,
                    challenges: [...aTest.challenges, newChallenge]
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
        console.log('handleChallengeChange');
        console.log({ ...updatedChallenge });
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
                                                <MenuItem onClick={() => {
                                                    handleNewChallengeOptionClick(ChallengeType.SelectAnswer);
                                                }}>
                                                    <ListItemIcon>{getChallengeTypeIcon(ChallengeType.SelectAnswer, 'large')}</ListItemIcon>
                                                    <Typography variant='button'>
                                                        {getChallengeTypeDescription(ChallengeType.SelectAnswer)}
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem onClick={() => {
                                                    handleNewChallengeOptionClick(ChallengeType.TrueOrFalse);
                                                }}>
                                                    <ListItemIcon>{getChallengeTypeIcon(ChallengeType.TrueOrFalse, 'large')}</ListItemIcon>
                                                    <Typography variant='button'>
                                                        {getChallengeTypeDescription(ChallengeType.TrueOrFalse)}
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem disabled onClick={handleCloseNewChallengeMenu}>
                                                    <ListItemIcon>{getChallengeTypeIcon(ChallengeType.FillGaps, 'large')}</ListItemIcon>
                                                    <Typography variant='button'>
                                                        {getChallengeTypeDescription(ChallengeType.FillGaps)}
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem disabled onClick={handleCloseNewChallengeMenu}>
                                                    <ListItemIcon>{getChallengeTypeIcon(ChallengeType.Match, 'large')}</ListItemIcon>
                                                    <Typography variant='button'>
                                                        {getChallengeTypeDescription(ChallengeType.Match)}
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem disabled onClick={handleCloseNewChallengeMenu}>
                                                    <ListItemIcon>{getChallengeTypeIcon(ChallengeType.Sort, 'large')}</ListItemIcon>
                                                    <Typography variant='button'>
                                                        {getChallengeTypeDescription(ChallengeType.Sort)}
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem onClick={() => {
                                                    handleNewChallengeOptionClick(ChallengeType.Classify);
                                                }}>
                                                    <ListItemIcon>{getChallengeTypeIcon(ChallengeType.Classify, 'large')}</ListItemIcon>
                                                    <Typography variant='button'>
                                                        {getChallengeTypeDescription(ChallengeType.Classify)}
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem onClick={() => {
                                                    handleNewChallengeOptionClick(ChallengeType.FillTable);
                                                }}>
                                                    <ListItemIcon>{getChallengeTypeIcon(ChallengeType.FillTable, 'large')}</ListItemIcon>
                                                    <Typography variant='button'>
                                                        {getChallengeTypeDescription(ChallengeType.FillTable)}
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem disabled onClick={handleCloseNewChallengeMenu}>
                                                    <ListItemIcon>{getChallengeTypeIcon(ChallengeType.Crossword, 'large')}</ListItemIcon>
                                                    <Typography variant='button'>
                                                        {getChallengeTypeDescription(ChallengeType.Crossword)}
                                                    </Typography>
                                                </MenuItem>
                                            </Menu>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item className={classes.challengesContainer}>
                            <ChallengeSelector
                                challenges={test.challenges}
                                compactList={compactList}
                                selected={selectedChallenge}
                                onSelect={handleSelectChallenge}
                                onDelete={handleDeleteChallenge}
                            />
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
