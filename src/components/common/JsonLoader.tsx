import React, { Fragment, useRef } from 'react';
import { Button, makeStyles } from '@material-ui/core';
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
    onDataLoaded: (data: unknown) => void,
    onError?: () => void
}

export const JsonLoader: React.FC<JsonLoaderProps> = (props: JsonLoaderProps) => {
    const { onDataLoaded, onError } = props;

    const inputImport = useRef({} as HTMLInputElement);

    const classes = useStyles();

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
                id='contained-button-file'
                multiple
                type='file'
                onInput={handleInput}
            />
            <Button style={{ color: colors.primary.dark }}>
                <label htmlFor='contained-button-file'>
                    Importar proyecto
                </label>
            </Button>
        </Fragment>
    );
};
