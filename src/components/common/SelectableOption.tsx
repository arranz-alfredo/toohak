import React, { useEffect, useRef, useState } from 'react';
import {
    Card,
    CardActionArea,
    Checkbox,
    Grid,
    Icon,
    InputAdornment,
    makeStyles,
    Radio,
    TextField
} from '@material-ui/core';
import { isMobile, isTablet } from 'react-device-detect';
import { ComponentMode } from 'enums';
import { colors } from 'theme';

const useStyles = makeStyles(() => ({
    option: {
        width: '100%',
        height: '100%'
    },
    optionActionArea: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    optionInput: {
        width: '90%',
        color: '#ffffff'
    },
    optionInnerInput: {
        cursor: 'pointer'
    },
    optionIcon: {
        color: '#ffffff'
    },
    selector: {
        color: '#ffffff',
        '&$checked': {
            color: '#ffffff'
        }
    },
    checked: {}
}));

interface OptionState {
    text: string,
    valid: boolean
}

interface SelectableOptionProps {
    mode: ComponentMode,
    text: string,
    icon: string,
    valid?: boolean,
    selected?: boolean,
    color?: string,
    fontSize?: number,
    multiselect?: boolean,
    showResults?: boolean,
    onClick?: () => void,
    onTextChange?: (newText: string) => void,
    onValidChange?(newValid: boolean): void
}

export const SelectableOption: React.FC<SelectableOptionProps> = (props: SelectableOptionProps) => {
    const {
        mode,
        text,
        icon,
        valid,
        selected,
        color,
        fontSize,
        multiselect,
        showResults,
        onClick,
        onTextChange,
        onValidChange
    } = props;

    const [optionState, setOptionState] = useState<OptionState>({ text: text || '', valid: valid || false });
    const inputTextOption = useRef({} as HTMLInputElement);
    const radioOption = useRef({} as HTMLInputElement);
    const checkOption = useRef({} as HTMLInputElement);

    const classes = useStyles();

    useEffect(() => {
        setOptionState({ text: text || '', valid: valid || false });
    }, [text, valid]);

    const handleOptionTextChange = () => {
        const newState = {
            ...optionState,
            text: inputTextOption.current.value
        };
        setOptionState(newState);
        if (onTextChange) {
            onTextChange(inputTextOption.current.value);
        }
    };

    const handleRadioChange = () => {
        const newState = {
            ...optionState,
            selected: radioOption.current.checked
        };
        setOptionState(newState);
        if (onValidChange) {
            onValidChange(radioOption.current.checked);
        }
    };

    const handleCheckboxChange = () => {
        const newState = {
            ...optionState,
            selected: checkOption.current.checked
        };
        setOptionState(newState);
        if (onValidChange) {
            onValidChange(checkOption.current.checked);
        }
    };

    const handlerOptionClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <Card
            className={classes.option}
            style={{
                backgroundColor: color || colors.primary.main,
                borderStyle: 'solid',
                borderWidth: (showResults && valid) || selected ? '3px' : '0px',
                borderColor: showResults ? (
                    valid ? '#00ff00' : '#ff0000'
                ) : '#323232'
            }}>
            {
                mode === ComponentMode.Design ? (
                    <div className={classes.optionActionArea}>
                        <TextField
                            inputRef={inputTextOption}
                            value={optionState.text}
                            placeholder="Escribe aquí una respuesta"
                            className={classes.optionInput}
                            InputProps={{
                                style: {
                                    color: '#ffffff',
                                    fontSize: `${fontSize || 22}px`,
                                },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Icon className={classes.optionIcon}>{icon}</Icon>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    multiselect ? (
                                        <Checkbox
                                            inputRef={checkOption}
                                            checked={optionState.valid}
                                            classes={{ root: classes.selector, checked: classes.checked }}
                                            onChange={handleCheckboxChange}
                                        />
                                    ) : (
                                        <Radio
                                            inputRef={radioOption}
                                            checked={optionState.valid}
                                            classes={{ root: classes.selector, checked: classes.checked }}
                                            onChange={handleRadioChange}
                                        />
                                    )
                                ),
                            }}
                            onInput={handleOptionTextChange}
                            onClick={(ev) => { ev.preventDefault(); }}
                        />
                    </div>
                ): (
                    <CardActionArea
                        className={classes.optionActionArea}
                        onClick={handlerOptionClick}
                    >
                        <Grid container className={classes.optionInput} spacing={2} alignItems="center">
                            {
                                (!isMobile || isTablet) && (
                                    <Grid item>
                                        <Icon className={classes.optionIcon}>{icon}</Icon>
                                    </Grid>
                                )
                            }
                            <Grid item>
                                <label style={{color: '#ffffff', fontSize: `${fontSize != null ? (fontSize / (isMobile && !isTablet ? 2 : 1)) : 22}px`, justifySelf: 'left'}}>
                                    {optionState.text}
                                </label>
                            </Grid>
                        </Grid>
                    </CardActionArea>
                )
            }
        </Card>
    );
};
