import React, { useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import useSound from 'use-sound';
import correct from '../../assets/sounds/correct.wav';
import incorrect from '../../assets/sounds/incorrect.wav';
import { Challenge, ChallengeOptions, FillTableChallenge, FillTableChallengeCell } from 'types';
import { ComponentMode } from 'enums';
import { BasicChallengeTemplate, TableCell } from 'components';

const useStyles = makeStyles((theme) => ({
    cell: {
        height: '60px'
    }
}));

const initialFillTableState = (challenge: FillTableChallenge): FillTableChallengeCell[][] => {
    return challenge.items.map((aRow: FillTableChallengeCell[]) => {
        const updatedColumns = aRow.map((aColumn: FillTableChallengeCell) => {
            return aColumn.hidden ? { ...aColumn, text: '' } : { ...aColumn };
        });
        return updatedColumns;
    });
};

interface FillTableChallengerProps {
    mode: ComponentMode,
    challenge: FillTableChallenge,
    options?: ChallengeOptions,
    onChallengeChange?: (updatedChallenge: FillTableChallenge) => void,
    onSuccess?: () => void,
    onError?: () => void
}

export const FillTableChallenger: React.FC<FillTableChallengerProps> = (props: FillTableChallengerProps) => {
    const { mode, challenge, options, onChallengeChange, onSuccess, onError } = props;

    const [fillTableState, setFillTableState] = useState<FillTableChallengeCell[][]>(initialFillTableState(challenge));

    const [stopTimer, setStopTimer] = useState<boolean>(false);
    const [highlightResults, setHighlightResults] = useState<boolean>(false);

    const [playCorrect] = useSound(correct);
    const [playIncorrect] = useSound(incorrect);

    const classes = useStyles();

    const handleChallengeChange = (newChallenge: Challenge) => {
        if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                ...(newChallenge as FillTableChallenge)
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

    const handleCellChange = (newCell: FillTableChallengeCell, rowIdx: number, columnIdx: number) => {
        const updatedItems = (mode === ComponentMode.Design ? challenge.items : fillTableState)
            .map((aRow: FillTableChallengeCell[], auxRowIdx: number) => {
                if (auxRowIdx !== rowIdx) {
                    return [...aRow];
                }
                const updatedColumns = aRow.map((aColumn: FillTableChallengeCell, auxColumnIdx: number) => {
                    return auxColumnIdx === columnIdx ? { ...newCell } : { ...aColumn };
                });
                return updatedColumns;
            });
        if (mode === ComponentMode.Play) {
            setFillTableState(updatedItems);
        } else if (onChallengeChange) {
            onChallengeChange({
                ...challenge,
                items: updatedItems
            });
        }
    };

    const completed = () => {
        return fillTableState.reduce(
            (accRow: boolean, currentRow: FillTableChallengeCell[], rowIdx: number) => (
                accRow
                && currentRow.reduce(
                    (accColumn: boolean, currentColumn: FillTableChallengeCell, columnIdx: number) => (
                        accColumn
                        && (
                            (
                                challenge.config.firstRowFixed
                                && rowIdx === 0
                                && challenge.config.firstColumnFixed
                                && columnIdx === 0
                            )
                            || currentColumn.text !== ''
                        )
                    ),
                    true
                )
            ),
            true
        );
    };

    const handleCheckClick = () => {
        const result = fillTableState.reduce(
            (accRow: boolean, currentRow: FillTableChallengeCell[], rowIdx: number) => (
                accRow
                && currentRow.reduce(
                    (accColumn: boolean, currentColumn: FillTableChallengeCell, columnIdx: number) => (
                        accColumn
                        && (
                            (
                                challenge.config.firstRowFixed
                                && rowIdx === 0
                                && challenge.config.firstColumnFixed
                                && columnIdx === 0
                            )
                            || currentColumn.text === challenge.items[rowIdx][columnIdx].text
                        )
                    ),
                    true
                )
            ),
            true
        );

        showResult(result);
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
                <Grid container alignItems="center" style={{ height: '100%' }}>
                    <Grid item xs>
                        <Grid container direction="column">
                            {
                                (mode === ComponentMode.Design ? challenge.items : fillTableState)
                                    .map((aRow: FillTableChallengeCell[], rowIdx: number) => (
                                        <Grid item xs key={`row_${rowIdx}`}>
                                            <Grid container>
                                                {
                                                    aRow.map((aColumn: FillTableChallengeCell, columnIdx: number) => (
                                                        <Grid item xs key={`column_${columnIdx}`} className={classes.cell}>
                                                            {
                                                                !(
                                                                    challenge.config.firstRowFixed
                                                                    && challenge.config.firstColumnFixed
                                                                    && rowIdx === 0
                                                                    && columnIdx === 0
                                                                ) && (
                                                                    <TableCell
                                                                        mode={mode}
                                                                        cell={aColumn}
                                                                        fixed={
                                                                            (
                                                                                challenge.config.firstRowFixed
                                                                                && rowIdx === 0
                                                                            ) || (
                                                                                challenge.config.firstColumnFixed
                                                                                && columnIdx === 0
                                                                            )
                                                                        }
                                                                        fontSize={challenge.config.itemsFontSize}
                                                                        showResults={highlightResults}
                                                                        success={
                                                                            (
                                                                                !challenge.config.firstRowFixed
                                                                                || rowIdx !== 0
                                                                            ) && (
                                                                                !challenge.config.firstColumnFixed
                                                                                || columnIdx !== 0
                                                                            ) && (
                                                                                challenge.items != null
                                                                                && challenge.items[rowIdx] != null
                                                                                && challenge.items[rowIdx][columnIdx] != null
                                                                                && fillTableState[rowIdx] != null
                                                                                && fillTableState[rowIdx][columnIdx] != null
                                                                            ) && (
                                                                                challenge.items[rowIdx][columnIdx].text
                                                                                === fillTableState[rowIdx][columnIdx].text
                                                                            )
                                                                        }
                                                                        onCellChange={(cell) => {
                                                                            handleCellChange(cell, rowIdx, columnIdx);
                                                                        }}
                                                                    />
                                                                )
                                                            }
                                                        </Grid>
                                                    ))
                                                }
                                            </Grid>
                                        </Grid>
                                    ))
                            }
                        </Grid>
                    </Grid>
                </Grid>
            }
        />
    );
};
