const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const envvar = require('envvar');
const { User } = require('../models/user');

const client = jwksClient({
  jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
});
function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      callback(err);
    } else {
      var signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    }
  });
}

const options = {
  audience: envvar.string('GOOGLE_CLIENT_ID'),
};

module.exports = (req, res, next) => {
  if (!req.headers['authorization']) return res.status(401).json({ errors: ['No token provided.']});
  let token = req.headers['authorization'].split(' ')[1];
  if (!token) return res.status(401).json({ errors: ['No token provided.'] });
  jwt.verify(token, getKey, options, (error, decoded) => {
    if (error) return res.status(401).json({ errors: ['Failed to authenticate token.', error] });
    User.findOrCreate(decoded.sub, (error, user) => {
      if (error || !user) {
        console.log(error);
        return res.status(500).json({ errors: ['Failed to find or create user.', error, user] });
      }
      console.log('User ' + user.id + ' made a request to server at ' + req.path);
      req.sub = decoded.sub;
      req.user = user.id;
      next();
    });
  });
};
