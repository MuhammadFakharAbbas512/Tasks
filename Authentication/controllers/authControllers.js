const User=require('../models/userModel');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const dotenv=require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

const transporter=nodemailer.createTransport({
    
    service:'gmail',
    secure:true,
    port:465,
    auth:{
        //sender credential
    user:process.env.myMail,
    pass:process.env.myPass //less secure app password
    }
});

const sendEmail = async (newUser)=>{
        try{
             await transporter.sendMail({
                   from:'fakharraza51214@gmail.com',
                   to:newUser,
                   subject:'Account Creation',
                   text:'Your account on Authorization has been created'
           });
          }
          catch(error)
          {
            console.log(error);
          
          }
   
}
//const jwt=require('jasonwebtoken');
exports.welcome=async(req,res)=>{
    res.send('Authorization Api');
}
exports.registerUser=async(req,res)=>{
    try
     {
      const newUser=await User.create(req.body);
      console.log('Recepient Email : ', req.body.Email);
       await sendEmail(req.body.Email);
       await res.status(200).json(newUser);
    } 
    catch (error) 
    {
        console.log('Unable to register ',error); 
        res.status(500).json({error}); 
    }
}
exports.signIn=async(req,res)=>{
    const {Email,Password}=req.body;
    console.log('Email Entered :' + Email + '\n Password :' + Password);
    try {
        const validEmailHolder=await User.findOne({Email});
        if(!validEmailHolder)
        {
            return res.status(401).json({message:'Email not found'});
        }
        else
        {
            const isValidPassword=await bcrypt.compare(Password,validEmailHolder.Password);
            if(!isValidPassword)
            {
                return res.status(401).json({message:'Password does not match'});
            }
        }

        const token=jwt.sign(
               { id:validEmailHolder._id, email:validEmailHolder.Email},
               '22I-1134',
               {expiresIn:'2h'}
        );
        console.log(`Successfully logged into your account`);
        return res.status(200).json({
            message:`Successfully logged into account registered on mail : ${Email}`,
            token
    } );
        
    } catch (error) {
        console.log('Unable to log in');
        res.status(500).json({message:error.message});
    }
}

exports.seeUser=async(req,res)=>{
    const {email}=req.params;
    const isUserExist=await User.findOne({Email:email});

    if(!isUserExist)
    {
        console.log('This user is not registred');
        res.status(404).json({message:'User not registered'});
    }
    else{
        res.status(200).send({
            FullName:`${isUserExist.FirstName} ${isUserExist.SecondName}`,
            Number:isUserExist.Number
        });
    }
}
exports.updateUser = async (req, res) => {
    const { email } = req.params;
    console.log(email);
    const { FirstName, SecondName, Email, Number, Password } = req.body;

    try {
        const isUserExist = await User.findOne({ Email: email });
        if (!isUserExist) {
            return res.status(401).json({ message: 'User Not Exists' });
        }

        const isValidPassword = await bcrypt.compare(Password, isUserExist.Password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Password does not match' });
        }

        isUserExist.FirstName = FirstName;
        isUserExist.SecondName = SecondName;
        isUserExist.Email = Email;
        isUserExist.Number = Number;
        isUserExist.Password = Password;

        await isUserExist.save();

        console.log('Updated the changes successfully');
        res.status(200).json(isUserExist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
