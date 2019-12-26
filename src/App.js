import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { withAuthenticator } from 'aws-amplify-react';
import Home from './components/Home/Home';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ConfirmSignUp from './components/ConfirmSignUp/ConfirmSignUp';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import { ApolloProvider } from '@apollo/react-hooks';
import settings from './settings';
import Amplify, { Analytics, Storage } from 'aws-amplify';
import graphQlClient from './clients/graphql';

window.LOG_LEVEL = 'DEBUG';

Analytics.disable();

Amplify.configure(settings.auth);

Storage.configure({
    AWSS3: {
        bucket: settings.assetsBucket,
        region: settings.region
    }
});

const theme = createMuiTheme({
    typography: {
        button: {
            textTransform: 'none'
        }
    }
});

const GraphQLApp = () => (
    <ApolloProvider client={graphQlClient({ uri: settings.graphqlEndpoint })}>
        <MuiThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Home />
            </MuiPickersUtilsProvider>
        </MuiThemeProvider>
    </ApolloProvider>
);

export default () => {
    const AppWithAuth = withAuthenticator(GraphQLApp, false, [
        <SignIn />,
        <SignUp />,
        <ConfirmSignUp />,
        <ForgotPassword />,
        <ResetPassword />
    ]);

    return (<MuiThemeProvider theme={theme}><AppWithAuth /></MuiThemeProvider>);
};


