import Auth from '@aws-amplify/auth';
import JS from '@aws-amplify/core/lib/JS';

import { SIGNED_IN, VERIFY_CONTACT } from '../constants/authStates';

const GOOGLE_PROVIDER = 'Google';
const FACEBOOK_PROVIDER = 'Facebook';

export class AuthClass {

    confirmSignUp = async (username, code) => {
        await Auth.confirmSignUp(username, code);
    };

    resendCodeSignUp = async (username) => {
        await Auth.resendSignUp(username);
    };

    forgotPassword = async (username) => {
        await Auth.forgotPassword(username)
    };

    resetPassword = async (username, code, password) => {
        await Auth.forgotPasswordSubmit(username, code, password);
    };

    resendCode = async (username) => {
        await Auth.forgotPassword(username);
    };

    signIn = async (email, password) => {
        const user = await Auth.signIn(email, password);
        return await this.checkContact(user);
    };

    checkContact = async (user) => {
        const data = await Auth.verifiedContact(user);
        if (!JS.isEmpty(data.verified)) {
            return {
                state: SIGNED_IN,
                data: user
            };
        } else {
            return {
                state: VERIFY_CONTACT,
                data: { ...user, ...data }
            };
        }
    };

    socialSignIn = (provider) => {
        const config = Auth.configure();

        const {
            userPoolWebClientId,
            oauth: {
                scope,
                domain,
                redirectSignIn,
                responseType
            }
        } = config;
        const url = `https://${domain}/oauth2/authorize?identity_provider=${provider}&redirect_uri=${redirectSignIn}&response_type=${responseType}&client_id=${userPoolWebClientId}&scope=${scope.join('+')}`;
        window.location.assign(url);
    }

    googleSignIn = () => {
        this.socialSignIn(GOOGLE_PROVIDER);
    }

    facebookSignIn = () => {
        this.socialSignIn(FACEBOOK_PROVIDER);
    }

    signUp = async (username, password, attributes = {}) =>
        await Auth.signUp({
            username,
            password,
            attributes
        });


    signOut = async () => await Auth.signOut({ global: true });
}

const AuthService = new AuthClass();

export default AuthService;