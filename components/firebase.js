const { Component } = require('aghanim')
const firebase = require('firebase-admin')

module.exports = class Firebase extends Component {
    constructor(client, options) {
        super(client)
        const firebaseConfig = {
            "type": "service_account",
            // "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
            // "client_email": process.env.CLIENT_EMAIL,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://accounts.google.com/o/oauth2/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        }
        firebaseConfig.private_key = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
        firebaseConfig.client_email = process.env.CLIENT_EMAIL;
        firebase.initializeApp({
            credential: firebase.credential.cert(firebaseConfig),
            databaseURL: "https://roshan-bot.firebaseio.com",
            storageBucket: "roshan-bot.appspot.com"
        })
        this.client.firebase = firebase;
        this.client.storage = firebase.storage().bucket()
        this.client.db = firebase.database().ref()
    }
}