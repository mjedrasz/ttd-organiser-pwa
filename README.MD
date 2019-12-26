# Things Todo organiser PWA

Organiser's web app that allows creating events and activities for kids.

## Getting Started

This project depends on AWS infrastructure set up by [ttd_infra](https://github.com/mjedrasz/ttd_infra) and [ttd_serverless](https://github.com/mjedrasz/ttd_infra). Please run/install these projects before following the instructions below.

### Prerequisites

To build the application a configured AWS CLI is required (e.g. some ids and values are retrieved from AWS Parameter Store). Follow the AWS official documentation to install AWS CLI. Note that the build scripts uses AWS CLI version 1 - if you prefer using AWS CLI version 2 simply change (or alias) *aws...* commands with *aws2...*. 

It also requires nodejs, yarn and jq.

### Installing

To install dependencies run

```
bash ./build.sh install
```

To build the application run
```
bash ./build.sh build <stage_here> <region_here>
```

for example
```
bash ./build.sh build test eu-central-1
```

The above command builds a production ready bundle. It also generates *.env* file you can use/change when working in a development mode.

## Running the tests

Simply run

```
npm test
```

## Deployment


To deploy the application run
```
bash ./build.sh deploy <stage_here> <region_here>
```

for example
```
bash ./build.sh deploy test eu-central-1
```

The deploy command uploads files to S3 and invalidates CloudFront cache for /index.html and /service-worker.js.

## Local development

To run the app locally in a development mode

```
yarn start
```

To serve a production bundle locally
```
yarn -s build
```

## License

This project is licensed under the MIT License - see the [LICENSE.MD](LICENSE.MD) file for details
