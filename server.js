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

const corsOptions = {
    origin: 'http://localhost:3000'
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
        sgMail.setApiKey('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');
        const msg = {
            to: 'sfhemstreet@gmail.com',
            from: 'spencerhemstreet@gmail.com',
            subject: `Contact Form Submission ${email} ${title}`,
            text: body,
        };
        sgMail.send(msg);
        res.json('Success')
    }
});

app.listen(process.env.PORT || 8000);
