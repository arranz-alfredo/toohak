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

export const createQueryString = (params: Record<string, unknown>): string => (
    Object.keys(params).reduce(
        (acc: string, current: string, idx: number) => (
            `${acc}${idx > 0 ? '&' : ''}${current}=${params[current]}`
        ),
        '?'
    )
);

export const parseQueryString = (qs: string): any => {
    const qsAux = qs[0] === '?' ? qs.slice(1) : qs;
    const result: any = {};
    qsAux.split(/&/g).forEach((aParam: string) => {
        const paramParts = aParam.split('=');
        result[paramParts[0]] = (
            paramParts[1] === 'true' || paramParts[1] === 'false' ? paramParts[1] === 'true' : paramParts[1]
        );
    });
    return result;
};
