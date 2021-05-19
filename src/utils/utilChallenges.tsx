import React from 'react';
import { Icon } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { ChallengeType } from "../enums/ChallengeType";
import { Language } from "../enums/Language";
import { Challenge, ChallengeConfig } from "../types/Challenge";
import { CSSProperties } from '@material-ui/styles';
import { PictureType } from '../enums/PictureType';
import { SelectAnswerChallenge, SelectAnswerChallengeConfig } from '../types/SelectAnswerChallenge';
import { TrueOrFalseChallenge, TrueOrFalseChallengeConfig } from '../types/TrueOrFalseChallenge';
import { ClassifyChallenge, ClassifyChallengeConfig } from '../types/ClassifyChallenge';
import { SortChallenge, SortChallengeConfig } from '../types/SortChallenge';
import { FillTableChallenge, FillTableChallengeConfig } from '../types/FillTableChallenge';

export const getChallengeTypeDescription = (type: ChallengeType, language: Language = Language.Es): string => {
    switch (type) {
        case ChallengeType.SelectAnswer:
            return language === Language.Es ? "Selecciona la respuesta correcta" : "Choose the correct answer";
        case ChallengeType.TrueOrFalse:
            return language === Language.Es ? "Verdadero o falso" : "True or false";
        case ChallengeType.Match:
            return language === Language.Es ? "Une las opciones" : "Match the options";
        case ChallengeType.FillGaps:
            return language === Language.Es ? "Rellena los huecos" : "Fill in the gaps";
        case ChallengeType.Sort:
            return language === Language.Es ? "Ordena los elementos" : "Order the elements";
        case ChallengeType.Classify:
            return language === Language.Es ? "Clasifica los elementos" : "Classify the elements";
        case ChallengeType.FillTable:
            return language === Language.Es ? "Completa la tabla" : "Complete the table";
        case ChallengeType.Crossword:
            return language === Language.Es ? "Crucigrama" : "Crossword";
        default:
            return language === Language.Es ? "Sin definir" : "Undefined";
    }
};

export const getChallengeTypeIcon = (type: ChallengeType, size: 'large' | 'default' | 'small' = 'default', style: CSSProperties = {}): JSX.Element => {
    return (
        <Icon fontSize={size} style={style}>
            {
                type === ChallengeType.SelectAnswer ? 'widgets'
                    : type === ChallengeType.TrueOrFalse ? 'check'
                        : type === ChallengeType.FillGaps ? 'space_bar'
                            : type === ChallengeType.Match ? 'shuffle'
                                : type === ChallengeType.Sort ? 'swap_vert'
                                    : type === ChallengeType.Classify ? 'category'
                                        : type === ChallengeType.FillTable ? 'grid_on'
                                            : type === ChallengeType.Crossword ? 'font_download' : ''
            }
        </Icon>
    );
};

const getDefaultChallengeConfig = (type: ChallengeType): ChallengeConfig => {
    const defaultChallengeConfig: ChallengeConfig = {
        timeLimit: 30,
        questionFontSize: 28
    };

    switch (type) {
        case ChallengeType.SelectAnswer:
            return {
                ...defaultChallengeConfig,
                answerFontSize: 22,
                pictureCount: 1,
                pictureLabel: false,
                multiselect: false
            } as SelectAnswerChallengeConfig;
        case ChallengeType.TrueOrFalse:
            return {
                ...defaultChallengeConfig,
                pictureCount: 1,
                pictureLabel: false
            } as TrueOrFalseChallengeConfig;
        case ChallengeType.Match:
            return defaultChallengeConfig;
        case ChallengeType.FillGaps:
            return defaultChallengeConfig;
        case ChallengeType.Sort:
            return {
                ...defaultChallengeConfig,
                itemsFontSize: 18,
                itemCount: 5
            } as SortChallengeConfig;
        case ChallengeType.Classify:
            return {
                ...defaultChallengeConfig,
                itemsFontSize: 18,
                groupCount: 3
            } as ClassifyChallengeConfig;
        case ChallengeType.FillTable:
            return {
                ...defaultChallengeConfig,
                itemsFontSize: 18,
                rowCount: 3,
                columnCount: 3,
                firstRowFixed: false,
                firstColumnFixed: false
            } as FillTableChallengeConfig;
        default:
            return defaultChallengeConfig;
    }
};

export const getDefaultChallenge = (type: ChallengeType): Challenge => {
    const defaultChallenge: Challenge = {
        id: uuidv4(),
        type,
        question: '',
        config: getDefaultChallengeConfig(type)
    };

    switch (type) {
        case ChallengeType.SelectAnswer:
            return {
                ...defaultChallenge,
                pictures: [{
                    type: PictureType.None,
                    data: ''
                }],
                answers: [
                    { text: '', valid: false },
                    { text: '', valid: false },
                    { text: '', valid: false },
                    { text: '', valid: false }
                ]
            } as SelectAnswerChallenge;
        case ChallengeType.TrueOrFalse:
            return {
                ...defaultChallenge,
                pictures: [{
                    type: PictureType.None,
                    data: ''
                }],
                answer: true
            } as TrueOrFalseChallenge;
        case ChallengeType.Match:
            return defaultChallenge;
        case ChallengeType.FillGaps:
            return defaultChallenge;
        case ChallengeType.Sort:
            return {
                ...defaultChallenge,
                items: ['', '', '', '', '']
            } as SortChallenge;
        case ChallengeType.Classify:
            return {
                ...defaultChallenge,
                groups: [
                    { name: '', items: ([] as string[]) },
                    { name: '', items: ([] as string[]) },
                    { name: '', items: ([] as string[]) }
                ]
            } as ClassifyChallenge;
        case ChallengeType.FillTable:
            return {
                ...defaultChallenge,
                items: [
                    [{ text: '', hidden: false },{ text: '', hidden: false },{ text: '', hidden: false }],
                    [{ text: '', hidden: false },{ text: '', hidden: false },{ text: '', hidden: false }],
                    [{ text: '', hidden: false },{ text: '', hidden: false },{ text: '', hidden: false }]
                ]
            } as FillTableChallenge;
        default:
            return defaultChallenge;
    }
};
