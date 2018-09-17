const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET_TOKEN = 'policia_angostura_api_secret_key_venezuela_2018';

function createToken(user) {
  const payload = {
    sub: 20,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  }

  return jwt.encode(payload, SECRET_TOKEN);
}

module.exports = {
  createToken,
  SECRET_TOKEN
};