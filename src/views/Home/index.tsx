import React from 'react';
import { Grid } from '@material-ui/core';
import { useProjects } from 'hooks/useProjects';
import { ProjectList } from 'components';

export const Home: React.FC = () => {
    const { projects, setProjects } = useProjects();

    return (
        <Grid
            container
            justify="center"
        >
            <Grid item xs={12} lg={10} xl={7}>
                <ProjectList
                    projects={projects}
                    setProjects={setProjects}
                />
            </Grid>
        </Grid>
    );
};
