import React, { useEffect, useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Challenge } from 'types';
import { ChallengeThumbnail } from 'components';

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
    onChallengeReorder?: (orderedChallenges: Challenge[]) => void,
    onSelect?: (challenge: Challenge) => void,
    onDelete?: (challenge: Challenge) => void
}

export const ChallengeSelector: React.FC<ChallengeSelectorProps> = (props: ChallengeSelectorProps) => {
    const { challenges, compactList, selected, onChallengeReorder, onSelect, onDelete } = props;

    const [localChallenges, setLocalChallenges] = useState<Challenge[]>(challenges);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | undefined>(selected || undefined);

    const classes = useStyles();

    useEffect(() => {
        console.log(challenges);
        setLocalChallenges(challenges);
    }, [challenges]);

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

    const handleChallengeMove = (dragIndex: number, hoverIndex: number) => {
        if (onChallengeReorder) {
            const filteredCards = challenges.filter(
                (aChallenge: Challenge, idx: number) => idx !== dragIndex
            );
            const newChallenges = [
                ...filteredCards.slice(0, hoverIndex),
                challenges[dragIndex],
                ...filteredCards.slice(hoverIndex)
            ];
            setLocalChallenges(newChallenges);
            onChallengeReorder(newChallenges);
        }
    };

    return (
        <Grid container direction='column' alignItems='center' spacing={2} className={classes.root}>
            {
                localChallenges.map((aChallenge: Challenge, idx: number) => (
                    <ChallengeThumbnail
                        key={aChallenge.id}
                        challenge={aChallenge}
                        index={idx}
                        selected={selectedChallenge?.id === aChallenge.id}
                        compact={compactList}
                        onChallengeMove={handleChallengeMove}
                        onClick={handleThumbnailClick}
                        onDelete={handleThumbnailDelete}
                    />
                ))
            }
        </Grid>
    );
};
