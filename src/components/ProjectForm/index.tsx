import React, { useRef, useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { Project } from '../../types/Project';

interface FormState {
    name: string,
    description: string
}

const initialState = (project?: Project): FormState => {
    if (project != null) {
        return {
            name: project.name,
            description: project.description || '' 
        };
    }
    return {
        name: '',
        description: ''
    };
};

interface ProjectFormProps {
    project?: Project,
    onAccept: (newProject: Project) => void,
    onCancel: () => void
}

export const ProjectForm: React.FC<ProjectFormProps> = (props: ProjectFormProps) => {
    const { project, onAccept, onCancel } = props;

    const [formState, setFormState] = useState<FormState>(initialState(project));

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

    const handleAcceptClick = () => {
        const newProject: Project = project ?
            {
                ...project,
                name: inputName.current.value,
                description: inputDescription.current.value
            }
            : {
                id: uuidv4(),
                name: inputName.current.value,
                description: inputDescription.current.value,
                tests: []
            };

        onAccept(newProject);
    };

    const handleCancelClick = () => {
        onCancel();
    };

    return (
        <Grid
            container
            direction='column'
            spacing={2}
        >
            <Grid item xs={12}>
                <TextField
                    inputRef={inputName}
                    label='Nombre'
                    fullWidth
                    value={formState.name}
                    onInput={handleNameChange} 
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    inputRef={inputDescription}
                    label='Descripción'
                    fullWidth
                    value={formState.description}
                    onInput={handleDescriptionChange}
                />
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
