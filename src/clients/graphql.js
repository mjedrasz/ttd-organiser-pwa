import ApolloClient from 'apollo-boost';
import { Auth } from 'aws-amplify';

export default ({ uri }) => new ApolloClient({
    uri,
    request: async (operation) => {
        const token = (await Auth.currentSession()).getAccessToken().getJwtToken();
        operation.setContext({
            headers: {
                authorization: token || ''
            }
        })
    }
});