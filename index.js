import express from 'express';

const app = express();

app.use('/login', (req, res)=> {
    if (req.body) {
        //Do some validation to make sure username and password exist
        // Check to see if email and password are valid
    }
})
