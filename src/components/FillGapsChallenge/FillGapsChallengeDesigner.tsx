import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { FillGapsChallenge, FillGapsChallengeConfig } from 'types';
import { ComponentMode } from 'enums';
import { FillGapsChallenger, FillGapsConfigurator } from 'components';

const useStyles = makeStyles({
    fullHeight: {
        height: '100%',
    }
});

interface FillGapsChallengeDesignerProps {
    challenge: FillGapsChallenge,
    onChallengeChange: (challenge: FillGapsChallenge) => void
}

export const FillGapsChallengeDesigner: React.FC<FillGapsChallengeDesignerProps> = (
    props: FillGapsChallengeDesignerProps
) => {
    const { challenge, onChallengeChange } = props;

    const classes = useStyles();

    const handlerChallengeChange = (updatedChallenge: FillGapsChallenge) => {
        onChallengeChange(updatedChallenge);
    };

    const handleConfigChange = (config: FillGapsChallengeConfig) => {
        const updatedChallenge: FillGapsChallenge = {
            ...challenge,
            config
        };
        onChallengeChange(updatedChallenge);
    };

    return (
        <Grid container className={classes.fullHeight} spacing={2}>
            <Grid item xs={10} className={classes.fullHeight}>
                <FillGapsChallenger
                    mode={ComponentMode.Design}
                    challenge={challenge}
                    onChallengeChange={handlerChallengeChange}
                />
            </Grid>
            <Grid item xs={2} className={classes.fullHeight}>
                <FillGapsConfigurator config={challenge.config} onConfigChange={handleConfigChange} />
            </Grid>
        </Grid>
    );
};
