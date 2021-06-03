import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { SortChallenge, SortChallengeConfig } from 'types';
import { ComponentMode } from 'enums';
import { SortChallenger, SortConfigurator } from 'components';

const useStyles = makeStyles({
    fullHeight: {
        height: '100%',
    }
});

interface SortChallengeDesignerProps {
    challenge: SortChallenge,
    onChallengeChange: (challenge: SortChallenge) => void
}

export const SortChallengeDesigner: React.FC<SortChallengeDesignerProps> = (
    props: SortChallengeDesignerProps
) => {
    const { challenge, onChallengeChange } = props;

    const classes = useStyles();

    const readjustItems = (itemCount: number): string[] => {
        let items = [...challenge.items];
        if (itemCount > items.length) {
            const newItems = Array.from(Array(itemCount - items.length))
                .map(() => (''));
            items = [...items, ...newItems];
        } else if (itemCount < items.length) {
            items = items.slice(0, itemCount);
        }
        return items;
    };

    const handlerChallengeChange = (updatedChallenge: SortChallenge) => {
        onChallengeChange(updatedChallenge);
    };

    const handleConfigChange = (config: SortChallengeConfig) => {
        const items = readjustItems(config.itemCount);
        const updatedChallenge: SortChallenge = {
            ...challenge,
            items,
            config
        };
        onChallengeChange(updatedChallenge);
    };

    return (
        <Grid container className={classes.fullHeight} spacing={2}>
            <Grid item xs={10} className={classes.fullHeight}>
                <SortChallenger
                    mode={ComponentMode.Design}
                    challenge={challenge}
                    onChallengeChange={handlerChallengeChange}
                />
            </Grid>
            <Grid item xs={2} className={classes.fullHeight}>
                <SortConfigurator config={challenge.config} onConfigChange={handleConfigChange} />
            </Grid>
        </Grid>
    );
};
