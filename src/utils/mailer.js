import nodemailer from "nodemailer";
import {google} from "googleapis";
import ejs from "ejs";
import {fileURLToPath} from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  SENDER_EMAIL,
} = process.env;

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
);

oAuth2Client.setCredentials({refresh_token: GMAIL_REFRESH_TOKEN});

const sendEmail = async (to, subject, html) => {
  const accessToken = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: SENDER_EMAIL,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
      accessToken: accessToken,
    }
  });

  const mailOptions = {
    to,
    subject,
    html,
  };

  return transport.sendMail(mailOptions);
}

const getEmailHtml = (filename, data) => {
  return new Promise(async (resolve, reject) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, '/../views/email/', filename);

    await ejs.renderFile(filePath, data, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    })
  })
};

export {
  sendEmail,
  getEmailHtml,
};