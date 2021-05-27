import React, { useRef, useState } from 'react';
import { Button, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { Language } from '../../enums/Language';
import { Test } from '../../types/Test';

interface TestState {
    name: string,
    description: string
    language: Language
}

const initialState = (test?: Test): TestState => {
    if (test != null) {
        return {
            name: test.name,
            description: test.description || '',
            language: test.language || Language.Es
        };
    }
    return {
        name: '',
        description: '',
        language: Language.Es
    };
};

interface TestFormProps {
    test?: Test,
    onAccept: (newTest: Test) => void,
    onCancel: () => void
}

export const TestForm: React.FC<TestFormProps> = (props: TestFormProps) => {
    const { test, onAccept, onCancel } = props;

    const [formState, setFormState] = useState<TestState>(initialState(test));

    const inputName = useRef({} as HTMLInputElement);
    const inputDescription = useRef({} as HTMLInputElement);

    const handleNameChange = () => {
        setFormState({
            ...formState,
            name: inputName.current.value
        });
    };

    const handleDescriptionChange = () => {
        setFormState({
            ...formState,
            description: inputDescription.current.value
        });
    };

    const handleLanguageChange = (evt: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
        const updatedLanguage = evt.target.value === Language.Es.toString() ? Language.Es : Language.En;
        setFormState({
            ...formState,
            language: updatedLanguage
        });
    };

    const handleAcceptClick = () => {
        const newTest: Test = test ?
            {
                ...test,
                name: formState.name,
                description: formState.description,
                language: formState.language
            }
            : {
                id: uuidv4(),
                name: formState.name,
                description: formState.description,
                language: formState.language,
                challenges: []
            };

        onAccept(newTest);
    };

    const handleCancelClick = () => {
        onCancel();
    };

    return (
        <Grid
            container
            direction='column'
            spacing={4}
        >
            <Grid item xs={12}>
                <TextField
                    inputRef={inputName}
                    id='newTestNameInput'
                    label='Nombre'
                    fullWidth
                    value={formState.name}
                    onInput={handleNameChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    inputRef={inputDescription}
                    id='newTestNameInput'
                    label='Descripción'
                    fullWidth
                    value={formState.description}
                    onInput={handleDescriptionChange}
                />
            </Grid>
            <Grid item xs={12}>
                <InputLabel shrink id="label-language">
                    Idioma
                </InputLabel>
                <Select
                    labelId="label-language"
                    id='newTestLanguageInput'
                    label='Idioma'
                    fullWidth
                    value={formState.language.toString()}
                    onChange={handleLanguageChange}
                >
                    <MenuItem value={Language.Es.toString()}>Español</MenuItem>
                    <MenuItem value={Language.En.toString()}>Inglés</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={12}>
                <Grid container justify='flex-end' spacing={1}>
                    <Grid item>
                        <Button variant='contained' color='primary' onClick={handleAcceptClick}>Aceptar</Button>
                    </Grid>
                    <Grid item>
                        <Button color='primary' onClick={handleCancelClick}>Cancelar</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
