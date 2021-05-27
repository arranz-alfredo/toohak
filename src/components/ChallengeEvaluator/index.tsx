import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { ComponentMode } from '../../enums/ComponentMode';
import { Challenge } from '../../types/Challenge';
import { ChallengeType } from '../../enums/ChallengeType';
import { SelectAnswerChallenger } from '../SelectAnswerChallenger';
import { SelectAnswerChallenge } from '../../types/SelectAnswerChallenge';
import { TrueOrFalseChallenge } from '../../types/TrueOrFalseChallenge';
import { TrueOrFalseChallenger } from '../TrueOrFalseChallenger';
import { ClassifyChallenger } from '../ClassifyChallenger';
import { ClassifyChallenge } from '../../types/ClassifyChallenge';
import { FillTableChallenger } from '../FillTableChallenger';
import { FillTableChallenge } from '../../types/FillTableChallenge';
import { FillGapsChallenger } from '../FillGapsChallenger';
import { FillGapsChallenge } from '../../types/FillGapsChallenge';

const useStyles = makeStyles((theme) => ({
    fullHeight: {
        height: '100%'
    }
}));

interface ChallengeEvaluatorProps {
    challenge: Challenge;
    onSuccess?: () => void
    onError?: () => void
}

export const ChallengeEvaluator: React.FC<ChallengeEvaluatorProps> = (props: ChallengeEvaluatorProps) => {
    const { challenge, onSuccess, onError } = props;

    const classes = useStyles();

    const handlerSucessChallenge = () => {
        if (onSuccess) {
            onSuccess();
        }
    };

    const handlerErrorChallenge = () => {
        if (onError) {
            onError();
        }
    };

    return (
        <Grid container className={classes.fullHeight}>
            <Grid item xs={12}>
                {
                    challenge?.type === ChallengeType.SelectAnswer
                    && (
                        <SelectAnswerChallenger
                            mode={ComponentMode.Play}
                            challenge={challenge as SelectAnswerChallenge}
                            onSuccess={handlerSucessChallenge}
                            onError={handlerErrorChallenge}
                        />
                    )
                }
                {
                    challenge?.type === ChallengeType.TrueOrFalse
                    && (
                        <TrueOrFalseChallenger
                            mode={ComponentMode.Play}
                            challenge={challenge as TrueOrFalseChallenge}
                            onSuccess={handlerSucessChallenge}
                            onError={handlerErrorChallenge}
                        />
                    )
                }
                {
                    challenge?.type === ChallengeType.FillGaps
                    && (
                        <FillGapsChallenger
                            mode={ComponentMode.Play}
                            challenge={challenge as FillGapsChallenge}
                            onSuccess={handlerSucessChallenge}
                            onError={handlerErrorChallenge}
                        />
                    )
                }
                {
                    challenge?.type === ChallengeType.Classify
                    && (
                        <ClassifyChallenger
                            mode={ComponentMode.Play}
                            challenge={challenge as ClassifyChallenge}
                            onSuccess={handlerSucessChallenge}
                            onError={handlerErrorChallenge}
                        />
                    )
                }
                {
                    challenge?.type === ChallengeType.FillTable
                    && (
                        <FillTableChallenger
                            mode={ComponentMode.Play}
                            challenge={challenge as FillTableChallenge}
                            onSuccess={handlerSucessChallenge}
                            onError={handlerErrorChallenge}
                        />
                    )
                }
            </Grid>
        </Grid>
    );
};
