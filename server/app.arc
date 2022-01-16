@app
van-computer

@http
post /logout
post /login

post /api/users
get /api/me

post /api/vehicles
post /api/vehicles/:vehicleId/data
post /api/vehicles/:vehicleId/register


@aws
region eu-west-1

@tables
users
  userId *String

vehicles
  userId *String
  vehicleId **String

vehicleData
  vehicleId *String
  dateTime **String
  expires TTL

@tables-indexes
users
  email *String
  name usersByEmail
