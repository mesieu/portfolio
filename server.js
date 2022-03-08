require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const nodemailer = require('nodemailer');
const aws = require('aws-sdk');
const app = express();

//Setting AWS region
aws.config.update({
  region: 'us-east-1',
});

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static assets
app.use(express.static('public'));

//Using handlebars as view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

//Serving home page
app.get('/', (req, res) => {
  res.render('about', { title: 'G.D.R - About' });
});
//Serving experience section
app.get('/experience', (req, res) => {
  res.render('experience', {
    title: 'G.D.R - Experience',
  });
});
//Serving contact form
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'G.D.R - Contact' });
});

// Instantiate SES.
const ses = new aws.SES();
app.post('/contact/send', async (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;
  const output = `
  <h3>Informations du contact : </h3>
  <p>Nom : ${firstName} ${lastName}</p>
  <p>Courriel : ${email}</p>
  <h3>Message</h3>
  <h4>Objet : ${subject}</h4>
  <p>${message}</p>`;

  let transporter = nodemailer.createTransport({
    SES: { ses, aws },
  });

  let mailOption = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'Nouvelle demande de contact !',
    html: output,
  };

  transporter.sendMail(mailOption, (err, info) => {
    if (err) return console.log(err);
    console.log(info);
  });

  res.redirect('/contact');
});

const listener = app.listen(process.env.PORT || 8080, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
