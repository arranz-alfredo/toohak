export const splitSentence = (text: string): string[] => {
    return text
        .replace(/\./g, ' .')
        .replace(/,/g, ' ,')
        .replace(/;/g, ' ;')
        .replace(/:/g, ' :')
        .split( ' ');
};

export const joinSentence = (textParts: string[]): string => {
    return textParts
        .join(' ')
        .replace(/ \./g, '.')
        .replace(/ ,/g, ',')
        .replace(/ ;/g, ';')
        .replace(/ :/g, ':');
};
