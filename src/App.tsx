import React from "react";
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { ProjectContextProvider } from './context/ProjectContext';
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { theme } from "./theme";
import { MainHeader } from "./components/Common/MainHeader";
import { Home } from "./views/Home";
import { Designer } from "./views/Designer";
import { Evaluator } from "./views/Evaluator";

const LIMIT = 'sm';

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    headerContainer: {
        width: '100%',
        height: '75px',
        [theme.breakpoints.down(LIMIT)]: {
            height: '30px'
        }
    },
    content: {
        flex: '1 100%',
        padding: '30px',
        [theme.breakpoints.down(LIMIT)]: {
            padding: '5px'
        }
    }
}));

export default function App() {
    const classes = useStyles();

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <ProjectContextProvider>
                    <div className={classes.mainContainer}>
                        <div className={classes.headerContainer}>
                            <MainHeader></MainHeader>
                        </div>
                        <div className={classes.content}>
                            <Switch>
                                <Route exact path="/">
                                    <Home />
                                </Route>
                                <Route path="/designer/:projectId/:testId">
                                    <Designer />
                                </Route>
                                <Route path="/play/:projectId/:testId">
                                    <Evaluator />
                                </Route>
                            </Switch>
                        </div>
                    </div>
                </ProjectContextProvider>
            </ThemeProvider>
        </Router >
    );
}
