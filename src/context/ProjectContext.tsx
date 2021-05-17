import React, { useState } from 'react';

/**
 * Contexto para almacenar los proyectos importados
 */
export const ProjectContext = React.createContext<any | React.Dispatch<any>>([]);

type Props = {
    children: React.ReactNode
}

/** Proveedor del contexto de proyectos */
export const ProjectContextProvider = ({ children }: Props) => {
    // Hook para mantener el estado del contexto
    const [projects, setProjects] = useState<any | React.Dispatch<any>>([]);

    return (
        <ProjectContext.Provider value={{ projects, setProjects }}>
            {children}
        </ProjectContext.Provider>
    );
};
