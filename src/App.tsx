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
        overflow: 'hidden'
    },
    headerContainer: {
        width: '100%',
        height: '65px',
        [theme.breakpoints.down(LIMIT)]: {
            height: '30px'
        }
    },
    content: {
        height: 'calc(100% - 105px)',
        padding: '20px 10px',
        [theme.breakpoints.down(LIMIT)]: {
            height: 'calc(100% - 35px)',
            paddingTop: '5px'
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
