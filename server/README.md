# Van Computer API

An API for the Van Computer...

## Endpoints

There are a bunch of enpoints for the website... I'm not detailing these here yet as they're essentially
internal. The enpoints I am documenting are those used by the hardware tracker.

### POST /api/vehicles/:vehicleId/token

Returns a JSON webtoken. Further requests to the API should have a header containing the token in the format
'authorization': 'Bearer <TOKEN>'

**REQUEST**

```
POST /api/vehicles/:vehicleId/token

body:
{ userId: '123asd' }
```

**RESPONSE**

```
status: 200 OK

body
{ token: 'abc123'}
```

### POST /api/vehicles/:vehicleId/data

Post vicle data to the API. This endpoint is rate limited... No more than 1 request per minute else you'll get a 429.

**REQUEST**

```
POST /api/vehicles/:vehicleId/data
Headers: {
  Authorization: 'Bearer ${token}'
}

body: {
  location: {
    longitude: 53.71588,
    latitude: -1.8590
  }
}
```

**RESPONSE**

```
status: 201 OK
```

### GET /api/me

Get user and vehicle data from the API

**REQUEST**

```
POST /api/vehicles/:vehicleId/data
Headers: {
  Authorization: 'Bearer ${token}'
}
Body: {
  location: {
    latitude: 1.123,
    longitude: 0.54345,
    speed: 12,
    altitude: 5
  }
}
```

**RESPONSE**

```
status: 200 OK

body
{

}
```

## Developing locally

Clone the repo, and do the `npm install` thing.

To run the system locally:

`npx arc sandbox`

To run the tests:

`npm test`

## ENV Varibles

- JWT_SIGNING_KEY: Secure key for signing JWT tokens. New keys can be created by running `node ../scripts/create-signing-key.js`
- ROOT_URL: The url the server is hosted at... locally we run on `http://localhost:3333`
