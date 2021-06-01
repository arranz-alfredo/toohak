import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { MatchChallenge, MatchChallengeConfig, MatchChallengePair } from '../../types/MatchChallenge';
import { MatchChallenger } from './MatchChallenger';
import { MatchConfigurator } from './MatchConfigurator';
import { ComponentMode } from '../../enums/ComponentMode';

const useStyles = makeStyles({
    fullHeight: {
        height: '100%',
    }
});

interface MatchChallengeDesignerProps {
    challenge: MatchChallenge,
    onChallengeChange: (challenge: MatchChallenge) => void
}

export const MatchChallengeDesigner: React.FC<MatchChallengeDesignerProps> = (
    props: MatchChallengeDesignerProps
) => {
    const { challenge, onChallengeChange } = props;

    const classes = useStyles();

    const readjustPairs = (pairsCount: number): MatchChallengePair[] => {
        let pairs = [...challenge.pairs];
        if (pairsCount > pairs.length) {
            const newPairs = Array.from(Array(pairsCount - pairs.length))
                .map(() => ({ source: '', destination: ''}));
            pairs = [...pairs, ...newPairs];
        } else if (pairsCount < pairs.length) {
            pairs = pairs.slice(0, pairsCount);
        }
        return pairs;
    };

    const handlerChallengeChange = (updatedChallenge: MatchChallenge) => {
        onChallengeChange(updatedChallenge);
    };

    const handleConfigChange = (config: MatchChallengeConfig) => {
        const pairs = readjustPairs(config.pairsCount);
        const updatedChallenge: MatchChallenge = {
            ...challenge,
            pairs,
            config
        };
        onChallengeChange(updatedChallenge);
    };

    return (
        <Grid container className={classes.fullHeight} spacing={2}>
            <Grid item xs={10} className={classes.fullHeight}>
                <MatchChallenger
                    mode={ComponentMode.Design}
                    challenge={challenge}
                    onChallengeChange={handlerChallengeChange}
                />
            </Grid>
            <Grid item xs={2} className={classes.fullHeight}>
                <MatchConfigurator config={challenge.config} onConfigChange={handleConfigChange} />
            </Grid>
        </Grid>
    );
};
