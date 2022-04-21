const nodeMailer = require('nodemailer')

async function mailer1(otp,recepient){

    let email = recepient;
    let parts = email.split("@");
    if (parts[parts.length - 1] !== "rgukt.ac.in")
        throw new Error("Please use rgukt domain mail");
       
       let transporter = nodeMailer.createTransport({
        service:'gmail',
        pool:true,
        port: 527,
        secure: false,
        maxConnections:3000,
        maxMessages:5,
        auth: {
            user: 'b171325@rgukt.ac.in',
            pass: 'asd123@#$'
        }
       })
    
       let mailOptions = {
           from:'b171325@rgukt.ac.in',
           to:recepient,
           subject:'OTP for verification',
           text:`${otp} is your otp for verification \n\n Thank you.\n\n Regards,\n Your juniors.` 
       }
    
       try{
           let info = await transporter.sendMail(mailOptions);
           transporter.close()
           info.statusCode = 200;
           return info;
       }
       catch(err){
    
           err.statusCode = 202;
           return err;
       }
       
    }

    module.exports= mailer1;