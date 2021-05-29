import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Challenge } from '../../types/Challenge';
import { ChallengeType } from '../../enums/ChallengeType';
import { SelectAnswerChallengeDesigner } from '../SelectAnswerChallenge/SelectAnswerChallengeDesigner';
import { SelectAnswerChallenge } from '../../types/SelectAnswerChallenge';
import { TrueOrFalseChallengeDesigner } from '../TrueOrFalseChallenge/TrueOrFalseChallengeDesigner';
import { TrueOrFalseChallenge } from '../../types/TrueOrFalseChallenge';
import { ClassifyChallengeDesigner } from '../ClassifyChallenge/ClassifyChallengeDesigner';
import { ClassifyChallenge } from '../../types/ClassifyChallenge';
import { SortChallenge } from '../../types/SortChallenge';
import { SortChallengeDesigner } from '../SortChallenge/SortChallengeDesigner';
import { FillTableChallengeDesigner } from '../FillTableChallenge/FillTableChallengeDesigner';
import { FillTableChallenge } from '../../types/FillTableChallenge';
import { FillGapsChallengeDesigner } from '../FillGapsChallenge/FillGapsChallengeDesigner';
import { FillGapsChallenge } from '../../types/FillGapsChallenge';

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
