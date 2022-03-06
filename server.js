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

//Configuring handlebars
app.get('/', (req, res) => {
  res.render('index.hbs');
});
// Serving index.html

app.post('/send', async (req, res) => {
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  res.json({
    email: email,
    subject: subject,
    message: message,
  });
});

const listener = app.listen(process.env.PORT || 8080, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
