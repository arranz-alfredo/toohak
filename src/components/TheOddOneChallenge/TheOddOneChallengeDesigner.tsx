import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { TheOddOneChallenge, TheOddOneChallengeConfig, TheOddOneChallengeSerie } from 'types';
import { ComponentMode } from 'enums';
import { TheOddOneChallenger, TheOddOneConfigurator } from 'components';

const useStyles = makeStyles({
    fullHeight: {
        height: '100%',
    }
});

interface TheOddOneChallengeDesignerProps {
    challenge: TheOddOneChallenge,
    onChallengeChange: (challenge: TheOddOneChallenge) => void
}

export const TheOddOneChallengeDesigner: React.FC<TheOddOneChallengeDesignerProps> = (
    props: TheOddOneChallengeDesignerProps
) => {
    const { challenge, onChallengeChange } = props;

    const classes = useStyles();

    const readjustSeries = (seriesCount: number, seriesLength: number): TheOddOneChallengeSerie[] => {
        let series = [...challenge.series];

        series = series.map((aSerie: TheOddOneChallengeSerie) => {
            if (aSerie.elements.length === seriesLength) {
                return { ...aSerie };
            } else if (aSerie.elements.length < seriesLength) {
                const newElements = Array.from(Array(seriesLength - aSerie.elements.length)).map(() => '');
                return {
                    ...aSerie,
                    elements: [
                        ...aSerie.elements,
                        ...newElements
                    ]
                };
            } else {
                const newOddOneIndex = aSerie.theOddOneIndex >= seriesLength ? -1 : aSerie.theOddOneIndex;
                return {
                    elements: aSerie.elements.slice(0, seriesLength),
                    theOddOneIndex: newOddOneIndex
                };
            }
        });

        if (seriesCount > series.length) {
            const newSeries = Array.from(Array(seriesCount - series.length))
                .map(() => ({
                    elements: Array.from(Array(seriesLength)).map(() => ''),
                    theOddOneIndex: -1
                }));
            series = [...series, ...newSeries];
        } else if (seriesCount < series.length) {
            series = series.slice(0, seriesCount);
        }
        return series;
    };

    const handlerChallengeChange = (updatedChallenge: TheOddOneChallenge) => {
        onChallengeChange(updatedChallenge);
    };

    const handleConfigChange = (config: TheOddOneChallengeConfig) => {
        const series = readjustSeries(config.seriesCount, config.seriesLength);
        const updatedChallenge: TheOddOneChallenge = {
            ...challenge,
            series,
            config
        };
        onChallengeChange(updatedChallenge);
    };

    return (
        <Grid container className={classes.fullHeight} spacing={2}>
            <Grid item xs={10} className={classes.fullHeight}>
                <TheOddOneChallenger
                    mode={ComponentMode.Design}
                    challenge={challenge}
                    onChallengeChange={handlerChallengeChange}
                />
            </Grid>
            <Grid item xs={2} className={classes.fullHeight}>
                <TheOddOneConfigurator config={challenge.config} onConfigChange={handleConfigChange} />
            </Grid>
        </Grid>
    );
};
