const oauth2 = {
    // Domain name
    domain: `${process.env.REACT_APP_STAGE}-org-ttd.auth.${process.env.REACT_APP_REGION}.amazoncognito.com`,
    
    scope: ['email', 'openid', 'aws.cognito.signin.user.admin'],

    // Callback URL
    redirectSignIn: process.env.REACT_APP_CALLBACK_REDIRECT_SIGN_IN,

    // Sign out URL
    redirectSignOut: process.env.REACT_APP_CALLBACK_REDIRECT_SIGN_OUT,

    // 'code' for Authorization code grant,
    // 'token' for Implicit grant
    responseType: 'code',

    // optional, for Cognito hosted ui specified options
    options: {
        // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
        AdvancedSecurityDataCollectionFlag: false
    }
};

const auth = {
    Auth: {
        // REQUIRED - Amazon Cognito Identity Pool ID
        identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID, 
        // REQUIRED - Amazon Cognito Region
        region: process.env.REACT_APP_REGION,
        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: process.env.REACT_APP_USER_POOL_ID, 
        // OPTIONAL - Amazon Cognito Web Client ID
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID, 
        oauth: oauth2,
        aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS'
    },
    Interactions: {}
};

export default {
    graphqlEndpoint: process.env.REACT_APP_GRAPHQL_API, 
    region: process.env.REACT_APP_REGION,
    auth: auth,
    assetsBucket: process.env.REACT_APP_ASSETS_NAME
}

