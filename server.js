require("dotenv").config();
const express = require("express");
const { engine } = require("express-handlebars");
const nodemailer = require("nodemailer");
const aws = require("aws-sdk");
const app = express();

//Setting AWS region
aws.config.update({
  region: "us-east-1",
});

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static assets
app.use(express.static("public"));

//Using handlebars as view engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

//Serving home page
app.get("/", (req, res) => {
  res.render("about");
});
//Serving experience section
app.get("/experience", (req, res) => {
  res.render("experience");
});
// //Serving contact form
// app.get('/contact', (req, res) => {
//   res.render('contact');
// });

// Instantiate SES.
const ses = new aws.SES();

// Verify email addresses.
app.get("/verify", function (req, res) {
  var params = {
    EmailAddress: "guillaume.drs@hotmail.fr",
  };

  ses.verifyEmailAddress(params, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

//Listing verified emails
app.get("/list", function (req, res) {
  ses.listVerifiedEmailAddresses(function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

// Sending mail
app.post("/contact/send", async (req, res, next) => {
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

  // const confirmationOutput = `
  // Hello and thank you for your message. I will try to respond as soon as possible.
  // Guillaume`;

  let transporter = nodemailer.createTransport({
    SES: { ses, aws },
  });

  let mailOption = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "Nouvelle demande de contact !",
    html: output,
  };

  // let mailOptionReceptionConfirmation = {
  //   from: process.env.EMAIL,
  //   to: email,
  //   subject: 'Thank you for reaching out !',
  //   text: confirmationOutput,
  // };

  transporter.sendMail(mailOption, (err, info) => {
    if (err) return console.log(err);
    console.log(info);
  });
  // transporter.sendMail(mailOptionReceptionConfirmation, (err, info) => {
  //   if (err) return console.log(err);
  //   console.log(info);
  // });

  res.redirect("/contact");
});

const listener = app.listen(process.env.PORT || 8080, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
