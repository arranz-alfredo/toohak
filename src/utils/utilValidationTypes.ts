import { ChallengeType } from '../enums/ChallengeType';
import { PictureType } from '../enums/PictureType';
import { Challenge, ChallengeConfig, ChallengePicture } from '../types/Challenge';
import { ClassifyChallenge, ClassifyChallengeGroup } from '../types/ClassifyChallenge';
import { Project } from '../types/Project';
import { SelectAnswerChallenge, SelectAnswerChallengeAnswer, SelectAnswerChallengeConfig } from '../types/SelectAnswerChallenge';
import { SortChallenge } from '../types/SortChallenge';
import { Test } from '../types/Test';

export interface Validation {
    valid: boolean,
    errorMessage: string[]
}

export const isValidConfig = (type: ChallengeType, config: ChallengeConfig): Validation => {
    const errorMessage: string[] = [];

    if (config?.timeLimit == null || config?.timeLimit <= 0) { errorMessage.push('El tiempo límite debe ser mayor de 0') ;}
    if (config?.questionFontSize == null || config?.questionFontSize <= 0) { errorMessage.push('El tamaño de fuente del titulo debe ser mayor de 0'); }

    switch (type) {
        case ChallengeType.SelectAnswer: {
            const customConfig = config as SelectAnswerChallengeConfig;
            if (customConfig?.pictureCount == null || customConfig?.pictureCount <= 0) { errorMessage.push('El número de imágenes debe ser mayor de 0'); }
            if (customConfig?.pictureLabel == null) { errorMessage.push('Error en indicador de etiquetado de imágenes'); }
            if (customConfig?.multiselect == null) { errorMessage.push('Error en indicador de seleccion múltiple'); }
            break;
        }
        case ChallengeType.TrueOrFalse:
            break;
        case ChallengeType.FillGaps:
            break;
        case ChallengeType.Match:
            break;
        case ChallengeType.Sort:
            break;
        case ChallengeType.Classify:
            break;
        case ChallengeType.FillTable:
            break;
        case ChallengeType.Crossword:
            break;
    }
    return {
        valid: errorMessage.length === 0,
        errorMessage
    };
};

export const isValidChallenge = (challenge: Challenge): Validation => {
    let errorMessage: string[] = [];

    if (challenge?.id == null || challenge?.type == null) { errorMessage.push('Datos internos incorrectos'); }
    const configValidation = isValidConfig(challenge?.type, challenge?.config);
    if (!configValidation.valid) { errorMessage = [...errorMessage, ...configValidation.errorMessage]; }
    if (challenge?.question == null || challenge?.question === '') { errorMessage.push('Se debe rellenar el enunciado / pregunta'); }

    switch (challenge.type) {
        case ChallengeType.SelectAnswer: {
            const customChallenge = challenge as SelectAnswerChallenge;
            if (customChallenge.config.pictureCount > 1
                && customChallenge.pictures.some((aPicture: ChallengePicture) => aPicture.type === PictureType.None)
            ) {
                errorMessage.push('Hay imágenes vacías');
            }
            if(!customChallenge.answers.reduce(
                (acc: boolean, current: SelectAnswerChallengeAnswer) => acc && current.text != null && current.text !== '',
                true
            )) {
                errorMessage.push('Hay alguna respuesta vacía');
            }
            if(!customChallenge.answers.some((anAnswer: SelectAnswerChallengeAnswer) => anAnswer.valid)) {
                errorMessage.push('Debe marcarse al menos una respuesta como válida');
            }
            break;
        }
        case ChallengeType.TrueOrFalse:
            break;
        case ChallengeType.FillGaps:
            break;
        case ChallengeType.Match:
            break;
        case ChallengeType.Sort: {
            const customChallenge = challenge as SortChallenge;
            if(!customChallenge.items.reduce(
                (acc: boolean, current: string) => acc && current != null && current !== '',
                true
            )) {
                errorMessage.push('Hay elementos sin texto');
            }
            break;
        }
        case ChallengeType.Classify: {
            const customChallenge = challenge as ClassifyChallenge;
            if(!customChallenge.groups.reduce(
                (acc: boolean, current: ClassifyChallengeGroup) => acc && current.name != null && current.name !== '',
                true
            )) {
                errorMessage.push('Todos los grupos deben tener un título');
            }
            break;
        }
        case ChallengeType.FillTable:
            break;
        case ChallengeType.Crossword:
            break;
    }
    return {
        valid: errorMessage.length === 0,
        errorMessage
    };
};

export const isValidTest = (test: Test): boolean => {
    return test != null
        && test.id != null
        && test.name != null
        && test.challenges != null
        && test.challenges.reduce(
            (acc: boolean, current: Challenge) => acc && isValidChallenge(current).valid,
            true
        );
};

export const isValidProject = (project: Project): boolean => {
    return project != null
        && project.id != null
        && project.name != null
        && project.tests != null
        && project.tests.reduce(
            (acc: boolean, current: Test) => acc && isValidTest(current),
            true
        );
};