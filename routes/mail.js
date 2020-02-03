var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
const config = require("config");

var transport = {
  host: config.get("SMTP_SERVER"), // Don’t forget to replace with the SMTP host of your provider
  port: config.get("SMTP_PORT"),
  auth: {
    user: config.get("SMTP_USER"),
    pass: config.get("SMTP_PASS")
  }
};

console.log(transport);
var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log("Oh, my god", error);
  } else {
    console.log("Praise the Lord");
  }
});

router.post("/send", (req, res, next) => {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var content = `nombre: ${name} \n email: ${email} \n mensaje: ${message} `;

  var mail = {
    from: name,
    to: "lortuno1@gmail.com", // Change to email address that you want to receive messages on
    subject: "Mensaje desde el formulario de contacto",
    text: content
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: "fail"
      });
    } else {
      res.json({
        status: "success"
      });
    }
  });
});

module.exports = router;
