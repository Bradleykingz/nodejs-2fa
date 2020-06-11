const {authenticator} = require('otplib') ;
const crypto = require('crypto');
const qrcode = require('qrcode');

module.exports = {
    generateSecret: ()=> authenticator.generateSecret(),
    generateToken: (secret) => authenticator.generate(secret),
    verify: (token, secret)=> authenticator.verify({secret, token}),
    generateQRCode: (user, secret) => {

        const otp = authenticator.keyuri(user, "Our TFA App", secret);
        let imagePath = '';

        qrcode.toDataURL(otp, (err, imageUrl) => {
            if (err) {
                console.log('Could not generate QR code', err);
                return;
            }
            imagePath = imageUrl;
        });
        return imagePath;

    }
}
