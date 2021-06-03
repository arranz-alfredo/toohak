import { useContext, useEffect } from 'react';
import { ProjectContext } from 'context/ProjectContext';
import { Project } from 'types';

const LOCALSTORAGE_KEY = 'projects';

/**
 * Hook para la gestión del mapa
 */
export const useProjects = (): any => {
    // Contexto del mapa
    const { projects, setProjects: saveProjects } = useContext(ProjectContext);

    useEffect(() => {
        if (projects == null || projects.length === 0) {
            const strProjects = localStorage.getItem(LOCALSTORAGE_KEY);
            if (strProjects != null && strProjects !== '') {
                saveProjects(JSON.parse(strProjects));
            } else {
                saveProjects([]);
            }
        }
    });

    const setProjects = (newProjects: Project[]) => {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(newProjects));
        saveProjects(newProjects);
    };

    return { projects, setProjects };
};
