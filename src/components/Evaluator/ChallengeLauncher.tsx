import { makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { ChallengeType } from '../../enums/ChallengeType';
import { Language } from '../../enums/Language';
import { getChallengeTypeDescription } from '../../utils/utilChallenges';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        border: 'solid 1px',
        backgroundColor: '#81d4fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '32px'
    }
}));

interface ChallengeLauncherProps {
    challengeType: ChallengeType,
    language: Language,
    delay: number,
    onEnd: () => void
}

export const ChallengeLauncher: React.FC<ChallengeLauncherProps> = (props: ChallengeLauncherProps) => {
    const { challengeType, language, delay, onEnd } = props;

    const classes = useStyles();

    useEffect(() => {
        setTimeout(() => { onEnd(); }, delay * 1000);
    }, []);

    return (
        <div className={classes.root}>
            {
                getChallengeTypeDescription(challengeType, language)
            }
        </div>
    );
};
