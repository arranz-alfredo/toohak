import React from 'react';
import { Challenge, ChallengeOptions, ChallengePicture, PictureChallenge } from 'types';
import { ComponentMode } from 'enums';
import { BasicChallengeTemplate, PictureGrid } from 'components';

interface PictureChallengeTemplateProps {
    mode: ComponentMode,
    challenge: PictureChallenge,
    options?: ChallengeOptions,
    onChallengeChange?: (updatedChallenge: PictureChallenge) => void,
    stopTime?: boolean,
    onTimeUp?: () => void,
    showCheck?: boolean,
    disabledCheck?: boolean,
    onCheckClick?: () => void,
    children?: React.ReactChild | React.ReactChild[]
}

export const PictureChallengeTemplate: React.FC<PictureChallengeTemplateProps> = (props: PictureChallengeTemplateProps) => {
    const {
        mode, challenge, options, onChallengeChange,
        stopTime, onTimeUp, showCheck, disabledCheck, onCheckClick,
        children
    } = props;

    const handleChallengeChange = (newChallenge: Challenge) => {
        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                ...(newChallenge as PictureChallenge)
            });
        }
    };

    const handlePicturesChange = (newPictures: ChallengePicture[]) => {
        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                pictures: [...newPictures]
            });
        }
    };

    return (
        <BasicChallengeTemplate
            mode={mode}
            challenge={challenge}
            options={options}
            onChallengeChange={handleChallengeChange}
            stopTime={stopTime}
            onTimeUp={onTimeUp}
            showCheck={showCheck}
            disabledCheck={disabledCheck}
            onCheckClick={onCheckClick}
            centralComponent={
                <PictureGrid
                    mode={mode}
                    pictures={challenge.pictures}
                    onPicturesChange={handlePicturesChange}
                />
            }
            bottomComponent={
                children
            }
        />
    );
};
