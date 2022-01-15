# Van Computer

Van location updates for your camper

## Server

This is a group of functions that run on AWS Lambdas. It uses [Architect](https://arc.codes/) to set up the AWS environment.

## ENV Varibles

### Server

- JWT_SIGNING_KEY: Secure key for signing JWT tokens. New keys can be created by running `node ./scripts/create-signing-key.js`
- ROOT_URL: The url the server is hosted at... locally we run on `http://localhost:3333`
