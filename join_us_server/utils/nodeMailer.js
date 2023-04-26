"use strict";
const nodemailer = require("nodemailer");
//CKRCBJPPFBEZUITR
async function sendEmail(mail,code) {
  if(!mail ||!code ) return false
  let transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'zhaopin606@163.com', // generated ethereal user
      pass: 'CKRCBJPPFBEZUITR', // generated ethereal password
    },
  });

   await transporter.sendMail({
    from: 'zhaopin606@163.com', // sender address
    to: `${mail}`, // list of receivers
    subject: "用户登录验证", // Subject line
    // text: "用户登录验证", // plain text body
    html: `欢迎访问！您的验证码为<b> ${code} </b>,请勿泄漏,有效时间6分钟！`, // html body
  });

}


exports.sendEmail = sendEmail
// sendEmail('x709500@126.com',123123).then(res=>{
//   console.log(res)
// },(err)=>{
//   console.log(err)
// })