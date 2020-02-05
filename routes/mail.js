var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var config = require("config");

var transport = {
  host: config.get("SMTP_SERVER"), // Don’t forget to replace with the SMTP host of your provider
  port: config.get("SMTP_PORT"),
  auth: {
    user: config.get("SMTP_USER"),
    pass: config.get("SMTP_PASS")
  }
};
// var transport = {
//   host: "smtp.mailtrap.io", // Don’t forget to replace with the SMTP host of your provider
//   port: "587",
//   auth: {
//     user: "65f938a78242cb",
//     pass: "bda7fda18f5443"
//   }
// };
//console.log("trasport: ", transport);
var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log("Oh, my Dog", error);
  } else {
    console.log("Praise the Lord");
  }
});

router.post("/send", (req, res, next) => {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;
  var phone = req.body.phone;
  var content = `\n nombre: ${name} \n email: ${email} \n Telefono: ${phone} \n =========================  MENSAJE ================ \n \n ${message} \n \n =======================FIN MENSAJE ================`;

  var mail = {
    from: "indesan@indesan.com",
    to: "compras@indesan.com", // Change to email address that you want to receive messages on
    subject: "Mensaje desde el formulario de contacto",
    text: content
  };

  //console.log(mail);
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: "fail",
        error: err
      });
    } else {
      res.json({
        status: "success"
      });
    }
  });
});

module.exports = router;
