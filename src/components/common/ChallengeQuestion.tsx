import React, { useEffect, useRef, useState } from 'react';
import { Card, makeStyles, TextField } from '@material-ui/core';
import { ComponentMode } from 'enums';

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '90%',
        height: '80%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: '90%'
    }
});

interface ChallengeQuestionProps {
    mode: ComponentMode,
    question: string,
    fontSize?: number,
    onChange?: (newTitle: string) => void
}

export const ChallengeQuestion: React.FC<ChallengeQuestionProps> = (props: ChallengeQuestionProps) => {
    const { mode, question, fontSize, onChange } = props;

    const [questionText, setQuestionText] = useState<string>(question);
    const inputQuestion = useRef({} as HTMLInputElement);

    const classes = useStyles();

    useEffect(() => {
        setQuestionText(question);
    },[question]);

    const handleInputChange = () => {
        setQuestionText(inputQuestion.current.value);
        if (onChange) {
            onChange(inputQuestion.current.value);
        }
    };

    return (
        <div className={classes.root}>
            <Card className={classes.inputContainer}>
                <TextField
                    inputRef={inputQuestion}
                    variant='standard'
                    className={classes.input}
                    inputProps = {{
                        style: {
                            textAlign: 'center',
                            fontSize: `${fontSize != null ? fontSize : 28}px`,
                            lineHeight: '32px'
                        }
                    }}
                    InputProps={{
                        readOnly: mode === ComponentMode.Play,
                        disableUnderline: mode === ComponentMode.Play
                    }}
                    placeholder='Escribe aquí el enunciado o pregunta'
                    multiline
                    rowsMax={2}
                    value={questionText}
                    onInput={handleInputChange}
                />
            </Card>
        </div>
    );
};
