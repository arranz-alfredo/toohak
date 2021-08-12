import React, { useEffect, useState } from 'react';
import { /* Card, Fab, */ Grid, /* Icon, */ makeStyles } from '@material-ui/core';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Xarrow from 'react-xarrows/lib';
import useSound from 'use-sound';
import correct from '../../assets/sounds/correct.wav';
import incorrect from '../../assets/sounds/incorrect.wav';
import { Challenge, ChallengeOptions, MatchChallenge, MatchChallengePair, MatchItem } from 'types';
import { ComponentMode /*, Language */, MatchElement } from 'enums';
import { BasicChallengeTemplate, /* ChallengeQuestion, Countdown, */ MatchDestination, MatchSource } from 'components';
import { colors } from 'theme';

const useStyles = makeStyles(() => ({
    // root: {
    //     height: '100%',
    //     backgroundColor: '#f0f0f0'
    // },
    fullHeight: {
        height: '100%'
    },
    // fullWidth: {
    //     width: '100%'
    // },
    // titleContainer: {
    //     height: '20%'
    // },
    // answerContainer: {
    //     height: '80%',
    //     width: '100%'
    // },
    // centerAll: {
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // },
    // optionsContainer: {
    //     border: 'solid 1px gray',
    //     backgroundColor: '#ffffff',
    //     minHeight: '60px'
    // },
    // sentencesContainer: {
    //     paddingLeft: '10px'
    // }
}));

interface MatchAnswer {
    source: MatchItem,
    destination: MatchItem
}

const reorderItems = (texts: string[], mode: ComponentMode): string[] => {
    let list: string[] = [...texts];
    if (mode === ComponentMode.Play) {
        list = list.sort(() => Math.random() - 0.5);
    }
    return list;
};

interface MatchChallengerProps {
    mode: ComponentMode,
    challenge: MatchChallenge,
    options?: ChallengeOptions,
    onChallengeChange?: (updatedChallenge: MatchChallenge) => void,
    onSuccess?: () => void,
    onError?: () => void
}

export const MatchChallenger: React.FC<MatchChallengerProps> = (props: MatchChallengerProps) => {
    const { mode, challenge, options, onChallengeChange, onSuccess, onError } = props;

    const [stopTimer, setStopTimer] = useState<boolean>(false);
    const [highlightResults, setHighlightResults] = useState<boolean>(false);

    const [sourceItems, setSourceItems] = useState<string[]>(reorderItems(
        challenge.pairs.map((aPair: MatchChallengePair) => aPair.source),
        mode
    ));
    const [destinationItems, setDestinationItems] = useState<string[]>(reorderItems(
        challenge.pairs.map((aPair: MatchChallengePair) => aPair.destination),
        mode
    ));

    const [matchState, setMatchState] = useState<MatchAnswer[]>([]);

    const [playCorrect] = useSound(correct);
    const [playIncorrect] = useSound(incorrect);

    const classes = useStyles();

    useEffect(() => {
        setSourceItems(reorderItems(
            challenge.pairs.map((aPair: MatchChallengePair) => aPair.source),
            mode
        ));
        setDestinationItems(reorderItems(
            challenge.pairs.map((aPair: MatchChallengePair) => aPair.destination),
            mode
        ));
    }, [challenge.pairs]);

    const handleChallengeChange = (newChallenge: Challenge) => {
        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                ...(newChallenge as MatchChallenge)
            });
        }
    };

    const handlerTimeUp = () => {
        showResult(false);
    };

    const showResult = (success: boolean) => {
        setStopTimer(true);
        setHighlightResults(true);

        if (success) {
            playCorrect();
        } else {
            playIncorrect();
        }

        setTimeout(() => {
            if (success) {
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                if (onError) {
                    onError();
                }
            }
        }, 2000);
    };

    const handleTextChange = (newText: string, element: MatchElement, pairIdx: number) => {
        if (onChallengeChange) {
            const pairAttribute = element === MatchElement.Source ? 'source' : 'destination';
            const newChallenge: MatchChallenge = {
                ...challenge,
                pairs: challenge.pairs.map((aPair: MatchChallengePair, idx: number) => (
                    idx === pairIdx ? {
                        ...aPair,
                        [pairAttribute]: newText
                    } : {...aPair}
                ))
            };
            onChallengeChange(newChallenge);
        }
    };

    const handleDrop = (source: MatchItem, destination: MatchItem) => {
        const newState = matchState.filter((anAnswer: MatchAnswer) => (
            anAnswer.source.index !== source.index
            && anAnswer.destination.index !== destination.index
        ));
        newState.push({source, destination});
        setMatchState(newState);
    };

    const completed = () => matchState.length === challenge.pairs.length;

    const handleCheckClick = () => {
        const correct = challenge.pairs.reduce(
            (accPairs: boolean, currentPair: MatchChallengePair) => {
                const idxAnswer = matchState.findIndex((anAnswer: MatchAnswer) => (
                    anAnswer.source.text === currentPair.source
                    && anAnswer.destination.text === currentPair.destination
                ));
                return accPairs && idxAnswer >= 0;
            },
            true
        );
        showResult(correct);
    };

    return (
        <BasicChallengeTemplate
            mode={mode}
            challenge={challenge}
            options={options}
            onChallengeChange={handleChallengeChange}
            stopTime={stopTimer}
            onTimeUp={handlerTimeUp}
            showCheck={true}
            disabledCheck={mode === ComponentMode.Design || !completed()}
            onCheckClick={handleCheckClick}
            centralComponent={
                <Grid container xs={12} className={classes.fullHeight}>
                    <DndProvider backend={HTML5Backend}>
                        <Grid item xs={5} container direction="column" justify="space-around" alignItems="center">
                            {
                                sourceItems.map((aSource: string, sourceIdx: number) => (
                                    <MatchSource
                                        key={`source_${sourceIdx}`}
                                        mode={mode}
                                        item={{text: aSource, index: sourceIdx}}
                                        fontSize={challenge.config.answerFontSize}
                                        arrowNode={(
                                            <div
                                                id={`an_s_${sourceIdx}`}
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    border: `solid 1px ${colors.primary.main}`,
                                                    borderRadius: '20px'
                                                }}
                                            />
                                        )}
                                        onTextChange={
                                            (newText: string) => handleTextChange(
                                                newText,
                                                MatchElement.Source,
                                                sourceIdx
                                            )
                                        }
                                    />
                                ))
                            }
                        </Grid>
                        <Grid item xs={2} />
                        <Grid item xs={5} container direction="column" justify="space-around" alignItems="center">
                            {
                                destinationItems.map((aDestination: string, destinationIdx: number) => (
                                    <MatchDestination
                                        key={`destination_${destinationIdx}`}
                                        mode={mode}
                                        item={{text: aDestination, index: destinationIdx}}
                                        fontSize={challenge.config.answerFontSize}
                                        arrowNode={(
                                            <div
                                                id={`an_d_${destinationIdx}`}
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    border: `solid 1px ${colors.primary.main}`,
                                                    borderRadius: '20px'
                                                }}
                                            />
                                        )}
                                        onTextChange={
                                            (newText: string) => handleTextChange(
                                                newText,
                                                MatchElement.Destination,
                                                destinationIdx
                                            )
                                        }
                                        onDrop={(source: MatchItem) => {
                                            handleDrop(source, {text: aDestination, index: destinationIdx});
                                        }}
                                    />
                                ))
                            }
                            {
                                mode === ComponentMode.Design ? (
                                    sourceItems.map((aSource: string, idx: number) => (
                                        <Xarrow
                                            key={`designArrow_${idx}`}
                                            start={`an_s_${idx}`}
                                            end={`an_d_${(idx)}`}
                                            curveness={0}
                                        />
                                    ))
                                ) : (
                                    matchState.map((anAnswer: MatchAnswer, idx: number) => (
                                        <Xarrow
                                            key={`playArrow_${idx}`}
                                            start={`an_s_${anAnswer.source.index}`}
                                            end={`an_d_${(anAnswer.destination.index)}`}
                                            curveness={0}
                                            color={
                                                highlightResults ? (
                                                    challenge.pairs.findIndex((aPair: MatchChallengePair) => (
                                                        aPair.source === anAnswer.source.text
                                                        && aPair.destination === anAnswer.destination.text
                                                    )) >= 0 ? '#4caf50' : '#f44336'
                                                ) : undefined
                                            }
                                        />
                                    ))
                                )
                            }
                        </Grid>
                    </DndProvider>
                </Grid>
            }
        />
        // <Card variant='outlined' className={classes.root}>
        //     <div className={classes.titleContainer}>
        //         <ChallengeQuestion
        //             mode={mode}
        //             question={challenge.question}
        //             fontSize={challenge.config.questionFontSize}
        //             onChange={handleTitleChange}
        //         />
        //     </div>
        //     <div className={classes.answerContainer}>
        //         <Grid container justify='center' className={classes.fullHeight}>
        //             <Grid item xs={2} className={classes.fullHeight}>
        //                 {
        //                     options != null && !options.ignoreTimeLimit && (
        //                         <Countdown
        //                             mode={mode}
        //                             time={challenge.config.timeLimit}
        //                             stopTimer={stopTimer}
        //                             onTimeUp={handlerTimeUp}
        //                         />
        //                     )
        //                 }
        //             </Grid>
        //             <Grid item xs={8} className={classes.fullHeight} container>
        //                 <DndProvider backend={HTML5Backend}>
        //                     <Grid item xs={5} container direction="column" justify="space-around" alignItems="center">
        //                         {
        //                             sourceItems.map((aSource: string, sourceIdx: number) => (
        //                                 <MatchSource
        //                                     key={`source_${sourceIdx}`}
        //                                     mode={mode}
        //                                     item={{text: aSource, index: sourceIdx}}
        //                                     fontSize={challenge.config.answerFontSize}
        //                                     arrowNode={(
        //                                         <div
        //                                             id={`an_s_${sourceIdx}`}
        //                                             style={{
        //                                                 width: '20px',
        //                                                 height: '20px',
        //                                                 border: `solid 1px ${colors.primary.main}`,
        //                                                 borderRadius: '20px'
        //                                             }}
        //                                         />
        //                                     )}
        //                                     onTextChange={
        //                                         (newText: string) => handleTextChange(
        //                                             newText,
        //                                             MatchElement.Source,
        //                                             sourceIdx
        //                                         )
        //                                     }
        //                                 />
        //                             ))
        //                         }
        //                     </Grid>
        //                     <Grid item xs={2} />
        //                     <Grid item xs={5} container direction="column" justify="space-around" alignItems="center">
        //                         {
        //                             destinationItems.map((aDestination: string, destinationIdx: number) => (
        //                                 <MatchDestination
        //                                     key={`destination_${destinationIdx}`}
        //                                     mode={mode}
        //                                     item={{text: aDestination, index: destinationIdx}}
        //                                     fontSize={challenge.config.answerFontSize}
        //                                     arrowNode={(
        //                                         <div
        //                                             id={`an_d_${destinationIdx}`}
        //                                             style={{
        //                                                 width: '20px',
        //                                                 height: '20px',
        //                                                 border: `solid 1px ${colors.primary.main}`,
        //                                                 borderRadius: '20px'
        //                                             }}
        //                                         />
        //                                     )}
        //                                     onTextChange={
        //                                         (newText: string) => handleTextChange(
        //                                             newText,
        //                                             MatchElement.Destination,
        //                                             destinationIdx
        //                                         )
        //                                     }
        //                                     onDrop={(source: MatchItem) => {
        //                                         handleDrop(source, {text: aDestination, index: destinationIdx});
        //                                     }}
        //                                 />
        //                             ))
        //                         }
        //                         {
        //                             mode === ComponentMode.Design ? (
        //                                 sourceItems.map((aSource: string, idx: number) => (
        //                                     <Xarrow
        //                                         key={`designArrow_${idx}`}
        //                                         start={`an_s_${idx}`}
        //                                         end={`an_d_${(idx)}`}
        //                                         curveness={0}
        //                                     />
        //                                 ))
        //                             ) : (
        //                                 matchState.map((anAnswer: MatchAnswer, idx: number) => (
        //                                     <Xarrow
        //                                         key={`playArrow_${idx}`}
        //                                         start={`an_s_${anAnswer.source.index}`}
        //                                         end={`an_d_${(anAnswer.destination.index)}`}
        //                                         curveness={0}
        //                                         color={
        //                                             highlightResults ? (
        //                                                 challenge.pairs.findIndex((aPair: MatchChallengePair) => (
        //                                                     aPair.source === anAnswer.source.text
        //                                                     && aPair.destination === anAnswer.destination.text
        //                                                 )) >= 0 ? '#4caf50' : '#f44336'
        //                                             ) : undefined
        //                                         }
        //                                     />
        //                                 ))
        //                             )
        //                         }
        //                     </Grid>
        //                 </DndProvider>
        //             </Grid>
        //             <Grid item xs={2} style={{ height: '100%' }} className={classes.centerAll}>
        //                 {
        //                     <Fab
        //                         variant="extended"
        //                         size="large"
        //                         color="primary"
        //                         disabled={mode === ComponentMode.Design || !completed()}
        //                         onClick={() => { handleCheckClick(); }}
        //                     >
        //                         <Icon>check</Icon>&nbsp;{options?.language === Language.En ? 'Check' : 'Corregir'}
        //                     </Fab>
        //                 }
        //             </Grid>
        //         </Grid>
        //     </div>
        // </Card>
    );
};
