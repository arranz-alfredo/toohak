import React, { useEffect, useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Challenge } from '../../types/Challenge';
import { ChallengeThumbnail } from './ChallengeThumbnail';

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowY: 'auto'
    },
    fullWidth: {
        width: '100%',
    }
});

interface ChallengeSelectorProps {
    challenges: Challenge[],
    compactList?: boolean,
    selected?: Challenge,
    onSelect?: (challenge: Challenge) => void,
    onDelete?: (challenge: Challenge) => void
}

export const ChallengeSelector: React.FC<ChallengeSelectorProps> = (props: ChallengeSelectorProps) => {
    const { challenges, compactList, selected, onSelect, onDelete } = props;

    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | undefined>(selected || undefined);

    const classes = useStyles();

    useEffect(() => {
        setSelectedChallenge(selected);
    }, [selected]);

    const handleThumbnailClick = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        if (onSelect) {
            onSelect(challenge);
        }
    };

    const handleThumbnailDelete = (challenge: Challenge) => {
        if (onDelete) {
            onDelete(challenge);
        }
    };

    return (
        <Grid container direction='column' alignItems='center' spacing={2} className={classes.root}>
            {
                challenges.map((aChallenge: Challenge, idx: number) => (
                    <Grid item key={idx} className={classes.fullWidth}>
                        <ChallengeThumbnail
                            challenge={aChallenge}
                            position={idx + 1}
                            selected={selectedChallenge?.id === aChallenge.id}
                            compact={compactList}
                            onClick={handleThumbnailClick}
                            onDelete={handleThumbnailDelete}
                        />
                    </Grid>
                ))
            }
        </Grid>
    );
};
