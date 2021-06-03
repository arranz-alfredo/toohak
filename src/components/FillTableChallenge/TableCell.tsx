import React, { useRef, useState } from 'react';
import { Button, Grid, Icon, makeStyles, TextField } from '@material-ui/core';
import { FillTableChallengeCell } from 'types';
import { ComponentMode } from 'enums';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        border: 'solid 1px gray'
    },
    fixed: {
        backgroundColor: theme.palette.primary.main,
        color: '#ffffff'
    },
    valid: {
        backgroundColor: '#4caf50',
    },
    invalid: {
        backgroundColor: '#f44336',
    }
}));

interface TableCellProps {
    mode: ComponentMode,
    cell: FillTableChallengeCell,
    fixed?: boolean,
    fontSize?: number,
    showResults?: boolean,
    success?: boolean,
    onCellChange: (newCell: FillTableChallengeCell) => void
}

export const TableCell: React.FC<TableCellProps> = (props: TableCellProps) => {
    const { mode, cell, fixed, fontSize, showResults, success, onCellChange } = props;

    const [formData, setFormData] = useState<FillTableChallengeCell>(cell);
    const inputText = useRef({} as HTMLInputElement);

    const classes = useStyles();

    const handleTextChange = () => {
        const newState = {
            ...formData,
            text: inputText.current.value
        };
        setFormData(newState);
        onCellChange(newState);
    };

    const handleVisibilityChange = () => {
        const newState ={
            ...formData,
            hidden: !formData.hidden
        };
        setFormData(newState);
        onCellChange(newState);
    };

    return (
        <Grid container alignItems="center" className={`${classes.root} ${fixed ? classes.fixed : (showResults ? (success ? classes.valid : classes.invalid ) : '')}`}>
            {
                mode === ComponentMode.Design && !fixed && (
                    <Grid item>
                        <Button value="hidden" onClick={handleVisibilityChange}>
                            <Icon color={formData.hidden ? 'secondary' : 'primary'}>
                                {
                                    formData.hidden ? 'visibility_off' : 'visibility'
                                }
                            </Icon>
                        </Button>
                    </Grid>
                )
            }
            <Grid item xs>
                {
                    (mode === ComponentMode.Design || formData.hidden) ? (
                        <TextField
                            inputRef={inputText}
                            value={formData.text}
                            color='secondary'
                            style={{ marginLeft: '10px', width: 'calc(100% - 20px)' }}
                            inputProps = {{
                                style: {
                                    textAlign: 'center',
                                    fontSize: `${fontSize != null ? fontSize : 28}px`,
                                    color: fixed || showResults ? '#ffffff': '#000000',
                                    width: '100%'
                                }
                            }}
                            onInput={handleTextChange}
                        />
                    ) : (
                        <div
                            style={{
                                textAlign: 'center',
                                fontSize: `${fontSize != null ? fontSize : 28}px`,
                                color: fixed || showResults ? '#ffffff': '#000000'
                            }}
                        >
                            {formData.text}
                        </div>
                    )
                }
            </Grid>
        </Grid>
    );
};
