const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, html, attachment = null) => {
  try {

    const msg = {
      to: to,
      from: "rachanaaj21@gmail.com",
      subject: subject,
      html: html,
    };

    // ✅ attach PDF if available
    if (attachment) {
      msg.attachments = [attachment];
    }

    await sgMail.send(msg);
    console.log("Mail sent");

  } catch (err) {
    console.log("MAIL ERROR:");
    console.log(err.response?.body || err);
  }
};

module.exports = sendMail;