import dotenv from 'dotenv';
dotenv.config();
import nodemailer from "nodemailer";
import { google } from "googleapis";
import ejs from "ejs";
import { fileURLToPath } from 'url';
import path from 'path';
import { createRequire } from "module";

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

oAuth2Client.setCredentials( { refresh_token : GMAIL_REFRESH_TOKEN } );

const sendEmail = (to, subject, html) => {
  return new Promise(async(resolve, reject) => {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service : 'gmail',
      auth : {
        type : 'OAuth2',
        user : SENDER_EMAIL,
        clientId : GOOGLE_CLIENT_ID,
        clientSecret : GOOGLE_CLIENT_SECRET,
        refreshToken : GMAIL_REFRESH_TOKEN,
        accessToken : accessToken,
      }
    });

    const mailOptions = {
      to,
      subject,
      html,
    };

    await transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      }

      resolve(info);
    })
  })
}

export {
  sendEmail,

};