const firebase = require('firebase-admin');
const env = require('../env.json');

const firebaseConfig = {
  "type": "service_account",
  // "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  // "client_email": process.env.CLIENT_EMAIL,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
};

firebaseConfig.private_key = env.PRIVATE_KEY.replace(/\\n/g, '\n');
firebaseConfig.client_email = env.CLIENT_EMAIL

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  databaseURL: "https://roshan-bot.firebaseio.com"
});

module.exports = {
  firebase,
  db : firebase.database().ref()
}
