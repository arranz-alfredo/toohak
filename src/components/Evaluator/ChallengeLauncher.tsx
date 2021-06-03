import React, { useEffect } from 'react';
import { Grid, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import { ChallengeType, Language } from 'enums';
import { getChallengeTypeDescription } from 'utils';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        border: 'solid 1px',
        backgroundColor: theme.palette.primary.light,
    }
}));

interface ChallengeLauncherProps {
    challengeType: ChallengeType,
    challengeNumber: number,
    challengeTotalCount: number,
    language: Language,
    delay: number,
    onEnd: () => void
}

export const ChallengeLauncher: React.FC<ChallengeLauncherProps> = (props: ChallengeLauncherProps) => {
    const { challengeType, challengeNumber, challengeTotalCount, language, delay, onEnd } = props;

    const classes = useStyles();

    useEffect(() => {
        setTimeout(() => { onEnd(); }, delay * 1000);
    }, []);

    return (
        <Grid container direction="column" justify="center" alignItems="center" spacing={2} className={classes.root}>
            <Grid item>
                <Typography variant="h2">
                    {
                        getChallengeTypeDescription(challengeType, language)
                    }
                </Typography>
            </Grid>
            <Grid item style={{width: '100%'}}>
                <LinearProgress color="secondary" />
            </Grid>
            <Grid item>
                <Typography variant="h4">
                    {
                        language === Language.En ? (
                            `Question ${challengeNumber.toString()} of ${challengeTotalCount.toString()}`
                        ) : (
                            `Pregunta ${challengeNumber.toString()} de ${challengeTotalCount.toString()}`
                        )
                    }
                </Typography>
            </Grid>
        </Grid>
    );
};
