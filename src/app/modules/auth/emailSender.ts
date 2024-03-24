

import nodemailer from "nodemailer";
import config from "../../../config";

export const sendMail = async (to: string, html: string)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", //smtp.gmail.com
        port: 587,
        secure: config.env === 'production', 
        auth: {
          user: config.appEmail,
          pass: config.appPassword,
        },
        tls:{
            rejectUnauthorized:false
        }
      });
      
      await transporter.sendMail({
          from: `"PH Health Care <${config.appEmail}>"`, // sender address
          to,
          subject: 'Reset your password within ten minutes!', // Subject line
          text: '', // plain text body
          html,
        });
}
