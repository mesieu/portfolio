require('dotenv').config();
const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const nodemailer = require('nodemailer');
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
  res.render('home', { title: 'G.D.R - Home' });
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

app.post('/contact/send', async (req, res) => {
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  // let transporter = nodemailer.createTransport({
  //   host: 'email-smtp.us-east-1.amazonaws.com',
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: process.env.USER,
  //     pass: process.env.PASS,
  //   },
  //   tls: {
  //     rejectUnauthorized: false,
  //   },
  // });

  // let mailOptions = {
  //   from: email,
  //   to: 'guizmo.drs@gmail.com',
  //   subject: subject,
  //   text: message,
  // };

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) return console.log(error);
  //   console.log(info);
  // });

  res.render('contact', { title: 'G.D.R - Contact' });
});

const listener = app.listen(process.env.PORT || 8080, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
