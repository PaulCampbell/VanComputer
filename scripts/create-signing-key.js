var secureRandom = require('secure-random');

var signingKey = secureRandom(256, {type: 'Buffer'});

console.log(signingKey.toString('base64'));