import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { ChallengePicture, SelectAnswerChallenge, SelectAnswerChallengeAnswer, SelectAnswerChallengeConfig } from 'types';
import { ComponentMode, PictureType } from 'enums';
import { SelectAnswerChallenger, SelectAnswerConfigurator } from 'components';

const useStyles = makeStyles({
    fullHeight: {
        height: '100%',
    }
});

interface SelectAnswerChallengeDesignerProps {
    challenge: SelectAnswerChallenge,
    onChallengeChange: (challenge: SelectAnswerChallenge) => void
}

export const SelectAnswerChallengeDesigner: React.FC<SelectAnswerChallengeDesignerProps> = (
    props: SelectAnswerChallengeDesignerProps
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

    const readjustValidAnswers = (multiselect: boolean): SelectAnswerChallengeAnswer[] => {
        let validPresent = false;
        const answers: SelectAnswerChallengeAnswer[] = challenge.answers.map((anAnswer: SelectAnswerChallengeAnswer) => {
            if (!multiselect) {
                if (anAnswer.valid && !validPresent) {
                    validPresent = true;
                    return { ...anAnswer };
                }
                return { ...anAnswer, valid: false };
            }
            return { ...anAnswer };
        });
        return answers;
    };

    const handlerChallengeChange = (updatedChallenge: SelectAnswerChallenge) => {
        onChallengeChange(updatedChallenge);
    };

    const handleConfigChange = (config: SelectAnswerChallengeConfig) => {
        const pictures = readjustPictures(config.pictureCount);
        const answers = readjustValidAnswers(config.multiselect);
        const updatedChallenge: SelectAnswerChallenge = {
            ...challenge,
            pictures: [...pictures],
            answers: [...answers],
            config
        };
        onChallengeChange(updatedChallenge);
    };

    return (
        <Grid container className={classes.fullHeight} spacing={2}>
            <Grid item xs={10} className={classes.fullHeight}>
                <SelectAnswerChallenger
                    mode={ComponentMode.Design}
                    challenge={challenge}
                    onChallengeChange={handlerChallengeChange}
                />
            </Grid>
            <Grid item xs={2} className={classes.fullHeight}>
                <SelectAnswerConfigurator config={challenge.config} onConfigChange={handleConfigChange} />
            </Grid>
        </Grid>
    );
};
