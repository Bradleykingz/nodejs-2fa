const express = require('express');
const app = express();
import {generateSecret, generateQRCode, verify} from './2fa';

app.post('/setup=2fa', (req, res)=> {
    const user = req.user;
    user.secret = generateSecret();

    // save user to database

    const imageUrl = generateQRCode(user, user.secret);

    res.status(200).send({imageUrl});
})

app.post('/login', (req, res) => {
    const user = req.user;

    //Do some validation to make sure username and password exist
    // Check that the email exists
    if (user.existsInDatabase){
        // Check to see if email and password are valid
        // If email and password are valid, check if 2fa is enabled
        if (user.hasCorrectCredentials) {
            if (user.is2FAEnabled) {
                return res.status(200).send({
                    shortLivedToken: 'xxyy', // this shouldn't be a normal access token that can be used elsewhere in the app
                    is2FAEnabled: true
                })
            }
        }
    }
});

app.post('/login/verify', (req, res)=> {
    const otpToken = req.body.otpToken;
    const accessToken = req.headers["Authorization"];
    const user = req.user;

    if (accessToken.isValid) {
        const isOTPTokenValid = verify(otpToken, user.secret);
        if (isOTPTokenValid) {
            res.status(200).send({
                accessToken: '' //jwt generate token. This is a normal token that can be used to log in.
            })
        }
    }
})

app.listen(2333).on('listening', function () {
    console.log("Listening on 2333")
})
