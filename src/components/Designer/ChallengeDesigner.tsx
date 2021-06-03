import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { ClassifyChallengeDesigner, FillGapsChallengeDesigner, FillTableChallengeDesigner, MatchChallengeDesigner, SelectAnswerChallengeDesigner, SortChallengeDesigner, TrueOrFalseChallengeDesigner } from 'components';
import { Challenge, ClassifyChallenge, FillGapsChallenge, FillTableChallenge, MatchChallenge, SelectAnswerChallenge, SortChallenge, TrueOrFalseChallenge } from 'types';
import { ChallengeType } from 'enums';

const useStyles = makeStyles(() => ({
    fullHeight: {
        height: '100%'
    }
}));

interface ChallengeDesignerProps {
    challenge: Challenge,
    onChallengeChange: (challenge: Challenge) => void
}

export const ChallengeDesigner: React.FC<ChallengeDesignerProps> = (props: ChallengeDesignerProps) => {
    const { challenge, onChallengeChange } = props;

    const classes = useStyles();

    const handleChallengeChange = (updatedChallenge: Challenge) => {
        onChallengeChange(updatedChallenge);
    };

    return (
        <Grid container className={classes.fullHeight}>
            <Grid item xs={12}>
                {
                    challenge?.type === ChallengeType.SelectAnswer
                    && (
                        <SelectAnswerChallengeDesigner
                            challenge={challenge as SelectAnswerChallenge}
                            onChallengeChange={handleChallengeChange}
                        />
                    )
                }
                {
                    challenge?.type === ChallengeType.TrueOrFalse
                    && (
                        <TrueOrFalseChallengeDesigner
                            challenge={challenge as TrueOrFalseChallenge}
                            onChallengeChange={handleChallengeChange}
                        />
                    )
                }
                {
                    challenge?.type === ChallengeType.FillGaps
                    && (
                        <FillGapsChallengeDesigner
                            challenge={challenge as FillGapsChallenge}
                            onChallengeChange={handleChallengeChange}
                        />
                    )
                }
                {
                    challenge?.type === ChallengeType.Match
                    && (
                        <MatchChallengeDesigner
                            challenge={challenge as MatchChallenge}
                            onChallengeChange={handleChallengeChange}
                        />
                    )
                }
                {
                    challenge?.type === ChallengeType.Sort
                    && (
                        <SortChallengeDesigner
                            challenge={challenge as SortChallenge}
                            onChallengeChange={handleChallengeChange}
                        />
                    )
                }
                {
                    challenge?.type === ChallengeType.Classify
                    && (
                        <ClassifyChallengeDesigner
                            challenge={challenge as ClassifyChallenge}
                            onChallengeChange={handleChallengeChange}
                        />
                    )
                }
                {
                    challenge?.type === ChallengeType.FillTable
                    && (
                        <FillTableChallengeDesigner
                            challenge={challenge as FillTableChallenge}
                            onChallengeChange={handleChallengeChange}
                        />
                    )
                }
            </Grid>
        </Grid>
    );
};
