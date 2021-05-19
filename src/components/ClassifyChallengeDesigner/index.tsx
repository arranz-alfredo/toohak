import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { ClassifyChallenge, ClassifyChallengeConfig, ClassifyChallengeGroup } from '../../types/ClassifyChallenge';
import { ClassifyChallenger } from '../ClassifyChallenger';
import { ClassifyConfigurator } from '../ClassifyConfigurator';
import { ComponentMode } from '../../enums/ComponentMode';

const useStyles = makeStyles({
    fullHeight: {
        height: '100%',
    }
});

interface ClassifyChallengeDesignerProps {
    challenge: ClassifyChallenge,
    onChallengeChange: (challenge: ClassifyChallenge) => void
}

export const ClassifyChallengeDesigner: React.FC<ClassifyChallengeDesignerProps> = (
    props: ClassifyChallengeDesignerProps
) => {
    const { challenge, onChallengeChange } = props;

    const classes = useStyles();

    const readjustGroups = (groupCount: number): ClassifyChallengeGroup[] => {
        let groups = [...challenge.groups];
        if (groupCount > groups.length) {
            const newGroups = Array.from(Array(groupCount - groups.length))
                .map(() => ({ name: '', items: []}));
            groups = [...groups, ...newGroups];
        } else if (groupCount < groups.length) {
            groups = groups.slice(0, groupCount);
        }
        return groups;
    };

    const handlerChallengeChange = (updatedChallenge: ClassifyChallenge) => {
        onChallengeChange(updatedChallenge);
    };

    const handleConfigChange = (config: ClassifyChallengeConfig) => {
        const groups = readjustGroups(config.groupCount);
        const updatedChallenge: ClassifyChallenge = {
            ...challenge,
            groups,
            config
        };
        onChallengeChange(updatedChallenge);
    };

    return (
        <Grid container className={classes.fullHeight} spacing={2}>
            <Grid item xs={10} className={classes.fullHeight}>
                <ClassifyChallenger
                    mode={ComponentMode.Design}
                    challenge={challenge}
                    onChallengeChange={handlerChallengeChange}
                />
            </Grid>
            <Grid item xs={2} className={classes.fullHeight}>
                <ClassifyConfigurator config={challenge.config} onConfigChange={handleConfigChange} />
            </Grid>
        </Grid>
    );
};
