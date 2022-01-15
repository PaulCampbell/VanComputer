@app
van-computer

@http
post /logout
post /login

post /api/users
get /api/users/:userId

post /api/vehicles

post /api/vehicles/:vehicleId/data

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


@tables-indexes
users
  email *String
  name usersByEmail