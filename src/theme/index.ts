import { createMuiTheme } from "@material-ui/core";

export const colors = {
    primary: {
        main: '#2196f3',
        light: '#6ec6ff',
        dark: '#0069c0'
    },
    secondary: {
        main: '#e91e63',
        light: '#ff6090',
        dark: '#b0003a'
    },
    error: '#f44336',
    background: {
        main: '#2196f3',
        light: '#ffffff',
        dark: '#0069c0'
    },
    font: {
        main: '#000000',
        mainContrast: "#ffffff",
        light: '#000000',
        dark: '#888888',
        contrast: '#6ec6ff',
        errorContrast: "#ffffff"
    },
    action: "#4caf50"
};

export const fontSize = {
    s: 10,
    m: 12,
    l: 16
};

export const theme = createMuiTheme({
    palette: {
        primary: {            
            main: colors.primary.main,
            contrastText: colors.font.mainContrast,
            light: colors.primary.light
        },
        secondary: {
            main: colors.secondary.main,
            contrastText: colors.font.main,
            light: colors.secondary.light
        },
        background: {
            default: colors.background.main,
            paper: colors.background.light
        },
        error: {
            main: colors.error,
        },
        text: {
            primary: colors.font.main,
            secondary: colors.font.dark
        }
    },
    typography: {
        fontSize: fontSize.m,
    }
});