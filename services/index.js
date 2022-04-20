const userModel = require('../models/userModel')
const otpModel = require('../models/otpModel')
const buck = require('../middlewares/upload')
const ipModel = require('../models/ipModel')
const mailer = require('../mailer/index')
class user{
    static temp = (req,res)=>{
        console.log(req.headers['x-real-ip'])
        res.send("WORKING !!")
    }
    static sendMail=async(request,response)=>{

        let otp = Math.floor(Math.random()*10000);
        if(otp<1000)
        otp = otp*10

        let date = new Date;

        let expire = date.getTime() + (600*1000);

        let temp = {
            email:request.body.email,
            otp:`${otp}`,
            expire:expire,
            status:'not verified'
        }

        try{
            if(request.body.email === undefined)
            throw new Error('email is required');


                let result = await userModel.exists({'email':request.body.email});
                 if(result){
                    
                    if(!request.body.shouldExist)
                     throw new Error('User already exists');
                 }
                 else{
                     if(request.body.shouldExist)
                     throw new Error('User does not exists');
                 }


            let res  = await mailer(`${otp}`,request.body.email);
            
            let otpDoc = new otpModel(temp);

            console.log(res)
            if(res.accepted != undefined)
            if(res.accepted.length != 0)
            {
                await otpModel.deleteMany({email:request.body.email})
                await otpDoc.save();
                response.status(res.statusCode).send('success');
            }
            else
            response.status(202).send('something went wrong');
            else
            throw new Error("something went wrong, Please try after sometime");
        }
        catch(err){
            response.status(202).send(err.message);

        }
    }

    static  verifyotp=async(request,response)=>{

        try{
            if(request.body.email === undefined || request.body.otp === undefined)
            throw new Error('email or otp is missing');

             let res = await otpModel.findOne({email:request.body.email,otp:request.body.otp});
             
             let currentTime = (new Date).getTime();
             
             if(res)
             if(res.expire > currentTime){
                
                     await otpModel.deleteMany({email:request.body.email})
                    response.send('Success');
            }
             else{
                 response.status(202).send('Expired')
             }
             else
             throw new Error('Invalid');

        }
        catch(err){
            response.status(202).send(err.message);
        }
    }
    
    static  register = async(request,response)=>{
        try {
            console.log(request.body)
            request.body.likes = 0;
            let res = await userModel.exists({ email: request.body.email });
            if (res)
                throw new Error("User already exists");
            let data = new userModel(request.body);
            await data.save();
            response.send('success')
        }
        catch (err) {
            response.send(err.message);
        }
    }
    static getImg = async(request,response)=>{
        try {
            const bucket = buck.bucket;
            await bucket.find({ $or: [{ filename: `${request.params.id}-dp.jpeg` }, { filename: `${request.params.id}-dp.png` }] }).toArray((err, files) => {
                if (((files === null || files === undefined )? 0 : files.length) !== 0 && files != undefined) {
                    bucket.openDownloadStreamByName(files[0].filename).pipe(response);
                }
                else
                    response.send("nothing");
            });
        }
        catch (err) {
            response.status(202).send(err.message);
        }
    }
    static getData = async(req,res)=>{
        try {
            let pipeline = [{$sort:{likes:-1}}]
            let result = await userModel.aggregate(pipeline)
            res.send(result)
        } catch (err) {
            res.status(202).send(err.message);
        }
    }
    
    static getPostData = async(req,res)=>{
        try {
            let result = await userModel.findOne({id:req.params.id});
            if(result == null)
            result = "1"
            console.log(result)
            res.send(result)
        } catch (err) {
            res.status(202).send(err.message);
        }
    }
    static like = async(req,res)=>{
        try {
            
            let temp = {}
            temp['ip'] = req.headers['x-real-ip'];
            temp['id'] = req.body.id;
            let data = new ipModel(temp);
            

            let result = await ipModel.exists({ip:req.headers['x-real-ip']})
            if(result != null)
            throw new Error("Already liked a post")
            else{
                await data.save();
                await userModel.updateOne({id:req.body.id},{$inc:{likes:1}})
            }
            
            res.send("success")

        } catch (err) {
            res.status(202).send(err.message);
        }
    }

    static likedId = async(req,res)=>{
        try {
            
            let result = await ipModel.findOne({ip:req.headers['x-real-ip']})
            res.send(result)
        } catch (err) {
            res.status(202).send(err.message);
        }
    }

    static unlike = async(req,res)=>{
        try{
            
            await ipModel.findOneAndRemove({ip:req.headers['x-real-ip']})
            await userModel.updateOne({id:req.body.id},{$inc:{likes:-1}})
            res.send("success")
        }
        catch(err){
            res.status(202).send(err.message);
        }
    }
}

module.exports = user;