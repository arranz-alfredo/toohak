import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { TrueOrFalseChallenge, TrueOrFalseChallengeConfig } from '../../types/TrueOrFalseChallenge';
import { TrueOrFalseChallenger } from '../TrueOrFalseChallenger';
import { TrueOrFalseConfigurator } from '../TrueOrFalseConfigurator';
import { ComponentMode } from '../../enums/ComponentMode';
import { ChallengePicture } from '../../types/Challenge';
import { PictureType } from '../../enums/PictureType';

const useStyles = makeStyles({
    fullHeight: {
        height: '100%',
    }
});

interface TrueOrFalseChallengeDesignerProps {
    challenge: TrueOrFalseChallenge,
    onChallengeChange: (challenge: TrueOrFalseChallenge) => void
}

export const TrueOrFalseChallengeDesigner: React.FC<TrueOrFalseChallengeDesignerProps> = (
    props: TrueOrFalseChallengeDesignerProps
) => {
    const { challenge, onChallengeChange } = props;

    const classes = useStyles();

    const readjustPictures = (pictureCount: number): ChallengePicture[] => {
        let pictures = [...challenge.pictures];
        if (pictureCount > pictures.length) {
            const newPictures = Array.from(Array(pictureCount - pictures.length))
                .map(() => ({ type: PictureType.None, data: ''}));
            pictures = [...pictures, ...newPictures];
        } else if (pictureCount < pictures.length) {
            pictures = pictures.slice(0, pictureCount);
        }
        return pictures;
    };

    const handlerChallengeChange = (updatedChallenge: TrueOrFalseChallenge) => {
        onChallengeChange(updatedChallenge);
    };

    const handleConfigChange = (config: TrueOrFalseChallengeConfig) => {
        const pictures = readjustPictures(config.pictureCount);
        const updatedChallenge: TrueOrFalseChallenge = {
            ...challenge,
            pictures: [...pictures],
            config
        };
        onChallengeChange(updatedChallenge);
    };

    return (
        <Grid container className={classes.fullHeight} spacing={2}>
            <Grid item xs={10} className={classes.fullHeight}>
                <TrueOrFalseChallenger
                    mode={ComponentMode.Design}
                    challenge={challenge}
                    onChallengeChange={handlerChallengeChange}
                />
            </Grid>
            <Grid item xs={2} className={classes.fullHeight}>
                <TrueOrFalseConfigurator config={challenge.config} onConfigChange={handleConfigChange} />
            </Grid>
        </Grid>
    );
};
