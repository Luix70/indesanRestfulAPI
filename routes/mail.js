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

var email_recepcion = config.get("email_recepcion");

// var transport = {
//   host: "smtp.mailtrap.io", // Don’t forget to replace with the SMTP host of your provider
//   port: "587",
//   auth: {
//     user: "65f938a78242cb",
//     pass: "bda7fda18f5443"
//   }
// };

console.log("transport: ", transport);

var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log("Oh, my Dog", error);
  } else {
    console.log("Praise the Lord");
  }
});

router.post("/send", (req, res, next) => {
  var name = req.body.nombre;
  var email = req.body.email;
  var message = req.body.mensaje;
  var phone = req.body.telefono;
  var content = `\n nombre: ${name} \n email: ${email} \n Telefono: ${phone} \n \n  ======  MENSAJE ====== \n \n ${message} \n \n ====== FIN MENSAJE ===`;

  var mail = {
    from: transport.auth.user,
    to: email_recepcion, // Change to email address that you want to receive messages on
    subject: "Mensaje desde el formulario de contacto",
    text: content
  };

  console.log(mail);
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

  //correo de confirmacion
  var mail2 = {
    from: "contacto@indesan.com",
    to: email,
    subject:
      "Mensaje Recibido / Message bien reçu / Submission was successful ",
    text: `ES: Gracias por contactar con nosotros! \nFR: Merci de nous contacter! \nEN: Thank you for contacting us! \n============================= \n ${content}`
  };

  console.log(mail2);

  transporter.sendMail(mail2, (err, data) => {
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
