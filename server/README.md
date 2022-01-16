# Van Computer API

An API for the Van Computer...

## Developing locally

Clone the repo, and do the `npm install` thing.

To run the system locally:

`npx arc sandbox`

To run the tests:

`npm test`

## ENV Varibles

- JWT_SIGNING_KEY: Secure key for signing JWT tokens. New keys can be created by running `node ../scripts/create-signing-key.js`
- ROOT_URL: The url the server is hosted at... locally we run on `http://localhost:3333`
