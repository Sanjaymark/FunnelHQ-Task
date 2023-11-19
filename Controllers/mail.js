import nodemailer from "nodemailer";


export function sendEmail(toEmail, subject, content){

    let transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD
        },
    });

    const mailOption = {
        from: process.env.EMAIL_ID,
        to: toEmail,
        subject: subject,
        html: content
    };


    console.log(mailOption)

    transporter.sendMail(mailOption, (error,info)=>{
        if(error){
            console.log("error occured while sending", error)
        }else{
            console.log("Email sent successfully", info.response)
        }
    })
}