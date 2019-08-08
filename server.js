const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {regexCheck} = require('./tools/regexCheck');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// enable cors
const corsOptions = {
    origin: process.env.ORIGIN_WEBSITE
}
app.use(cors(corsOptions));

app.post('/email', (req,res) => {
    const {name, email, title, body} = req.body;
    if(!name || !email || !title || !body){
        res.status(400).json('Bad Input');
    }
    else if(!regexCheck(name, 'special') || !regexCheck(email,'email') || !regexCheck(title, 'special') || !regexCheck(body, 'special')){
        res.status(400).json('Very Bad Input');
    }else{
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: process.env.MY_TO_EMAIL,
            from: process.env.MY_FROM_EMAIL,
            subject: `Contact Form Submission ${email} ${title}`,
            text: body,
        };
        sgMail.send(msg);
        res.json('Success')
    }
});

app.listen(process.env.PORT);
