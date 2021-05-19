import React, { useEffect } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Challenge } from '../../types/Challenge';
import { ChallengeType } from '../../enums/ChallengeType';
import { SelectAnswerChallengeDesigner } from '../SelectAnswerChallengeDesigner';
import { SelectAnswerChallenge } from '../../types/SelectAnswerChallenge';
import { TrueOrFalseChallengeDesigner } from '../TrueOrFalseChallengeDesigner';
import { TrueOrFalseChallenge } from '../../types/TrueOrFalseChallenge';
import { ClassifyChallengeDesigner } from '../ClassifyChallengeDesigner';
import { ClassifyChallenge } from '../../types/ClassifyChallenge';
import { SortChallenge } from '../../types/SortChallenge';
import { SortChallengeDesigner } from '../SortChallengeDesigner';
import { FillTableChallengeDesigner } from '../FillTableChallengeDesigner';
import { FillTableChallenge } from '../../types/FillTableChallenge';

const useStyles = makeStyles(() => ({
    fullHeight: {
        height: '100%'
    }
}));

interface ChallengeDesignerProps {
    challenge: Challenge;
    onChallengeChange: (challenge: Challenge) => void
}

export const ChallengeDesigner: React.FC<ChallengeDesignerProps> = (props: ChallengeDesignerProps) => {
    const { challenge, onChallengeChange } = props;

    const classes = useStyles();

    useEffect(() => {
        console.log('ChallengeDesigner.useEffect');
        console.log(challenge);
    }, [challenge]);

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
