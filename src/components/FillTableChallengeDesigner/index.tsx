import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { FillTableChallenge, FillTableChallengeCell, FillTableChallengeConfig } from '../../types/FillTableChallenge';
import { FillTableChallenger } from '../FillTableChallenger';
import { FillTableConfigurator } from '../FillTableConfigurator';
import { ComponentMode } from '../../enums/ComponentMode';

const useStyles = makeStyles({
    fullHeight: {
        height: '100%',
    }
});

interface FillTableChallengeDesignerProps {
    challenge: FillTableChallenge,
    onChallengeChange: (challenge: FillTableChallenge) => void
}

export const FillTableChallengeDesigner: React.FC<FillTableChallengeDesignerProps> = (
    props: FillTableChallengeDesignerProps
) => {
    const { challenge, onChallengeChange } = props;

    const classes = useStyles();

    const readjustTable = (rowCount: number, columnCount: number): FillTableChallengeCell[][] => {
        let items = [...challenge.items];
        if (rowCount > items.length) {
            const auxColumn = Array.from(Array(items[0].length)).map(() => ({ text: '', hidden: false}));
            const newRows = Array.from(Array(rowCount - items.length))
                .map(() => [...auxColumn]);
            items = [...items, ...newRows];
        } else if (rowCount < items.length) {
            items = items.slice(0, rowCount);
        }

        if (columnCount > items[0].length) {
            const newColumns = Array.from(Array(columnCount - items[0].length))
                .map(() => ({ text: '', hidden: false}));
            items = items.map((anItem: FillTableChallengeCell[]) => [...anItem, ...newColumns]);
        } else if (columnCount < items[0].length) {
            items = items.map((anItem: FillTableChallengeCell[]) => anItem.slice(0, columnCount));
        }

        return items;
    };

    const handlerChallengeChange = (updatedChallenge: FillTableChallenge) => {
        onChallengeChange(updatedChallenge);
    };

    const handleConfigChange = (config: FillTableChallengeConfig) => {
        const items = readjustTable(config.rowCount, config.columnCount);
        const updatedChallenge: FillTableChallenge = {
            ...challenge,
            items,
            config
        };
        onChallengeChange(updatedChallenge);
    };

    return (
        <Grid container className={classes.fullHeight} spacing={2}>
            <Grid item xs={10} className={classes.fullHeight}>
                <FillTableChallenger
                    mode={ComponentMode.Design}
                    challenge={challenge}
                    onChallengeChange={handlerChallengeChange}
                />
            </Grid>
            <Grid item xs={2} className={classes.fullHeight}>
                <FillTableConfigurator config={challenge.config} onConfigChange={handleConfigChange} />
            </Grid>
        </Grid>
    );
};
