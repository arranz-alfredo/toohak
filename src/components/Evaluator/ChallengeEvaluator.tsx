import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Challenge, ChallengeOptions, ClassifyChallenge, FillGapsChallenge, FillTableChallenge, MatchChallenge, SelectAnswerChallenge, TheOddOneChallenge, TrueOrFalseChallenge } from 'types';
import { ChallengeType, ComponentMode } from 'enums';
import { ClassifyChallenger, FillGapsChallenger, FillTableChallenger, MatchChallenger, SelectAnswerChallenger, TheOddOneChallenger, TrueOrFalseChallenger } from 'components';

const useStyles = makeStyles((theme) => ({
    fullHeight: {
        height: '100%'
    }
}));

interface ChallengeEvaluatorProps {
    challenge: Challenge,
    options: ChallengeOptions,
    onSuccess?: () => void,
    onError?: () => void
}

export const ChallengeEvaluator: React.FC<ChallengeEvaluatorProps> = (props: ChallengeEvaluatorProps) => {
    const { challenge, options, onSuccess, onError } = props;

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
                            options={options}
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
                            options={options}
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
                            options={options}
                            onSuccess={handlerSucessChallenge}
                            onError={handlerErrorChallenge}
                        />
                    )
                }
                {
                    challenge?.type === ChallengeType.Match
                    && (
                        <MatchChallenger
                            mode={ComponentMode.Play}
                            challenge={challenge as MatchChallenge}
                            options={options}
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
                            options={options}
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
                            options={options}
                            onSuccess={handlerSucessChallenge}
                            onError={handlerErrorChallenge}
                        />
                    )
                }
                {
                    challenge?.type === ChallengeType.TheOddOne
                    && (
                        <TheOddOneChallenger
                            mode={ComponentMode.Play}
                            challenge={challenge as TheOddOneChallenge}
                            options={options}
                            onSuccess={handlerSucessChallenge}
                            onError={handlerErrorChallenge}
                        />
                    )
                }
            </Grid>
        </Grid>
    );
};
