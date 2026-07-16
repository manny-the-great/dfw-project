const nodemailer = require("nodemailer");

const mailSender = async (mailData) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: true, // for 465
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"DFWerrands" <${process.env.MAIL_USER}>`,
    to: mailData?.to,
    subject: mailData?.subject,
    html: mailData?.html,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err, "err==>");
      return err;
    }
    if (info) {
      console.log(info, "info");
      return info;
    }
  });
};

module.exports = { mailSender };
