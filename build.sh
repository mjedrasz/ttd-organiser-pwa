
#!/bin/bash
set -e
set -o pipefail

instruction()
{
  echo "usage: ./build.sh deploy <stage> <region>"
  echo ""
  echo "stage: eg. int, staging, test, prod, ..."
  echo "region: eg. eu-central-1, eu-west-1, ..."
  echo ""
  echo "for example: ./build.sh deploy test eu-central-1"
}

if [ $# -eq 0 ]; then
  instruction
  exit 1
elif [ "$1" = "install" ] && [ $# -eq 1 ]; then
  yarn install

elif [ "$1" = "build" ] && [ $# -eq 3 ]; then
  REACT_APP_STAGE=$2
  REACT_APP_REGION=$3
  PARAMETERS=`aws ssm get-parameters --names \
    "/$REACT_APP_STAGE/google/api/key" \
    "/$REACT_APP_STAGE/cognito/user-pool-client/org/sign-in-url" \
    "/$REACT_APP_STAGE/cognito/user-pool-client/org/sign-out-url" \
    "/$REACT_APP_STAGE/cognito/org-identity-pool/id" \
    "/$REACT_APP_STAGE/cognito/user-pools/org/id" \
    "/$REACT_APP_STAGE/cognito/org/user-pool-client/id" \
    "/$REACT_APP_STAGE/s3/assets" \
    "/$REACT_APP_STAGE/graphql-api/org/url" \
    --query "Parameters[*].{Name:Name,Value:Value}" \
    --with-decryption`

  REACT_APP_GOOGLE_API_KEY=`echo $PARAMETERS | jq .[] | jq -c "select(.Name == \\"/$REACT_APP_STAGE/google/api/key\\")" | jq -r '.Value'`
  REACT_APP_CALLBACK_REDIRECT_SIGN_IN=`echo $PARAMETERS | jq .[] | jq -c "select(.Name == \\"/$REACT_APP_STAGE/cognito/user-pool-client/org/sign-in-url\\")" | jq -r '.Value'`
  REACT_APP_CALLBACK_REDIRECT_SIGN_OUT=`echo $PARAMETERS | jq .[] | jq -c "select(.Name == \\"/$REACT_APP_STAGE/cognito/user-pool-client/org/sign-out-url\\")" | jq -r '.Value'`
  REACT_APP_IDENTITY_POOL_ID=`echo $PARAMETERS | jq .[] | jq -c "select(.Name == \\"/$REACT_APP_STAGE/cognito/org-identity-pool/id\\")" | jq -r '.Value'`
  REACT_APP_USER_POOL_ID=`echo $PARAMETERS | jq .[] | jq -c "select(.Name == \\"/$REACT_APP_STAGE/cognito/user-pools/org/id\\")" | jq -r '.Value'`
  REACT_APP_USER_POOL_WEB_CLIENT_ID=`echo $PARAMETERS | jq .[] | jq -c "select(.Name == \\"/$REACT_APP_STAGE/cognito/org/user-pool-client/id\\")" | jq -r '.Value'`
  REACT_APP_GRAPHQL_API=`echo $PARAMETERS | jq .[] | jq -c "select(.Name == \\"/$REACT_APP_STAGE/graphql-api/org/url\\")" | jq -r '.Value'`
  REACT_APP_ASSETS_NAME=`echo $PARAMETERS | jq .[] | jq -c "select(.Name == \\"/$REACT_APP_STAGE/s3/assets\\")" | jq -r '.Value'`
  
  echo "REACT_APP_GOOGLE_API_KEY=$REACT_APP_GOOGLE_API_KEY" > .env
  echo "REACT_APP_CALLBACK_REDIRECT_SIGN_IN=$REACT_APP_CALLBACK_REDIRECT_SIGN_IN" >> .env
  echo "REACT_APP_CALLBACK_REDIRECT_SIGN_OUT=$REACT_APP_CALLBACK_REDIRECT_SIGN_OUT" >> .env
  echo "REACT_APP_IDENTITY_POOL_ID=$REACT_APP_IDENTITY_POOL_ID" >> .env
  echo "REACT_APP_USER_POOL_ID=$REACT_APP_USER_POOL_ID" >> .env
  echo "REACT_APP_USER_POOL_WEB_CLIENT_ID=$REACT_APP_USER_POOL_WEB_CLIENT_ID" >> .env
  echo "REACT_APP_GRAPHQL_API=$REACT_APP_GRAPHQL_API" >> .env
  echo "REACT_APP_ASSETS_NAME=$REACT_APP_ASSETS_NAME" >> .env
  echo "REACT_APP_STAGE=$REACT_APP_STAGE" >> .env
  echo "REACT_APP_REGION=$REACT_APP_REGION" >> .env

  yarn build
#   npm run integration-test
# elif [ "$1" = "acceptance-test" ] && [ $# -eq 1 ]; then
#   npm install

#   npm run acceptance-test
elif [ "$1" = "deploy" ] && [ $# -eq 2 ]; then
  STAGE=$2
  DISTRIBUTION=`aws ssm get-parameter --name "/$STAGE/cloudfront/organiser-ui/distribution/id" | jq -r '.Parameter.Value'`
  
  aws s3 cp --recursive ./build s3://$STAGE-organiser-ui-ttd-pl/

  aws s3 cp --cache-control="max-age=0, no-cache, no-store, must-revalidate" \
        ./build/service-worker.js s3://$STAGE-organiser-ui-ttd-pl/

  aws s3 cp --acl public-read \
        --cache-control="max-age=0, no-cache, no-store, must-revalidate" \
        ./build/index.html s3://$STAGE-organiser-ui-ttd-pl/
# invalidate the CloudFront cache for index.html and service-worker.js
# to force CloudFront to update its edge locations with the new versions

  aws cloudfront create-invalidation --distribution-id $DISTRIBUTION \
        --paths /index.html /service-worker.js
else
  instruction
  exit 1
fi