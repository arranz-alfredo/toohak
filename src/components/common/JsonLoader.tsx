import React, { Fragment, useRef } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { colors } from '../../theme';

const useStyles = makeStyles((theme) => ({
    uploadInput: {
        display: 'none'
    }
}));

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget
}

interface JsonLoaderProps {
    label: string,
    onDataLoaded: (data: unknown) => void,
    onError?: () => void
}

export const JsonLoader: React.FC<JsonLoaderProps> = (props: JsonLoaderProps) => {
    const { label, onDataLoaded, onError } = props;

    const inputImport = useRef({} as HTMLInputElement);

    const classes = useStyles();

    const id = uuidv4();

    const handleInput = (event: unknown) => {
        try {
            const evt = event as HTMLInputEvent;
            if (evt?.target?.files != null) {
                const file = evt.target.files[0];
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onloadend = (e) => {
                    try {
                        const newProject = JSON.parse(reader.result as string);
                        onDataLoaded(newProject);
                    } catch (err) {
                        if (onError) {
                            onError();
                        }
                    }
                };
            }
        } catch (err) {
            if (onError) {
                onError();
            }
        }
        inputImport.current.value = '';
    };

    return (
        <Fragment>
            <input
                ref={inputImport}
                accept='text'
                className={classes.uploadInput}
                id={id}
                multiple
                type='file'
                onInput={handleInput}
            />
            <Button style={{ color: colors.primary.dark }}>
                <label htmlFor={id}>
                    {label}
                </label>
            </Button>
        </Fragment>
    );
};
